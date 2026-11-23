-- Subscription management from the profile (2026-11-23).
-- No online payments yet: paid plans are billed by invoice. The customer sees plan, price and status,
-- keeps their billing details, can change plan or cancel, and every change creates a task in the CRM
-- (crm_activities, type 'task', linked to the customer's lead) so the team activates, invoices or stops
-- billing. The team manages plans from the CRM through crm_set_account_plan().

alter table public.accounts
  add column billing_name    text check (char_length(billing_name) <= 160),
  add column billing_tax_id  text check (char_length(billing_tax_id) <= 40),
  add column billing_address text check (char_length(billing_address) <= 300),
  add column billing_email   text check (char_length(billing_email) <= 200),
  add column cancel_reason   text check (char_length(cancel_reason) <= 500),
  add column cancelled_at    timestamptz;

-- The customer can edit their billing details (plan and status still only through the functions)
grant update (billing_name, billing_tax_id, billing_address, billing_email) on public.accounts to authenticated;

-- Task for the team in the CRM, linked to the customer's most recent lead. Never blocks the customer.
create function crm_private.account_task(p_email text, p_subject text, p_body text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare v_lead uuid; v_owner uuid;
begin
  -- Owner: the lead's owner, otherwise the CRM admin (so it shows in "My tasks")
  select id, owner_id into v_lead, v_owner from public.crm_leads
   where lower(email) = lower(p_email) order by created_at desc limit 1;
  if v_owner is null then
    select id into v_owner from public.crm_profiles where active and role = 'admin' limit 1;
  end if;
  insert into public.crm_activities (type, subject, body, due_at, lead_id, owner_id)
  values ('task', left(p_subject, 200), p_body, now() + interval '1 day', v_lead, v_owner);
exception when others then
  raise warning 'crm account_task: %', sqlerrm;
end $$;

revoke all on function crm_private.account_task(text, text, text) from public, anon, authenticated;

-- Change of plan (also reactivates a cancelled plan): free is active at once, paid plans are requested
create or replace function public.request_plan(p_plan text)
returns public.accounts
language plpgsql
security definer
set search_path = ''
as $$
declare
  a public.accounts;
  v_old text;
  v_old_status text;
begin
  if p_plan not in ('free','custom','programs') then
    raise exception 'invalid_plan' using errcode = '22023';
  end if;
  select plan, plan_status into v_old, v_old_status from public.accounts where id = (select auth.uid());
  if not found then
    raise exception 'no_account' using errcode = '42501';
  end if;

  update public.accounts set
    plan = p_plan,
    plan_status = case when p_plan = 'free' then 'active' else 'requested' end,
    plan_requested_at = case when p_plan = 'free' then null else now() end,
    cancelled_at = null,
    cancel_reason = null
  where id = (select auth.uid())
  returning * into a;

  begin
    perform crm_private.upsert_web_lead(
      a.email, a.full_name, a.phone, a.company, a.role,
      case when p_plan <> 'programs' then 'pyme'
           when a.program_type = 'accel' then 'aceleradora' when a.program_type = 'incub' then 'incubadora'
           when a.program_type = 'uni' then 'universidad' when a.program_type = 'corp' then 'corporate'
           else 'otro' end,
      case when p_plan = 'programs' then 'programas' else 'diagnostico' end,
      'signup',
      'Cambio de plan desde su cuenta: ' || p_plan,
      jsonb_build_object('origen', 'cuenta', 'plan', p_plan, 'cuenta_id', a.id),
      true, null, null, null);
  exception when others then
    raise warning 'crm request_plan: %', sqlerrm;
  end;

  perform crm_private.account_task(a.email,
    case when v_old_status = 'cancelled' and v_old = p_plan then 'Reactivar plan ' || p_plan
         else 'Cambio de plan: ' || v_old || ' → ' || p_plan end
      || ' · ' || coalesce(a.company, a.email),
    'El cliente ' || a.email || ' ha pedido desde su perfil pasar del plan ' || v_old || ' (' || v_old_status
      || ') al plan ' || p_plan || '.'
      || case when p_plan = 'free' then ' El plan Gratis ya está activo: dejar de facturar el plan anterior.'
              else ' Llamar al cliente, activar el plan en CRM → Clientes y emitir la factura.' end);
  return a;
end $$;

revoke all on function public.request_plan(text) from public, anon;
grant execute on function public.request_plan(text) to authenticated;

-- Cancellation of a paid plan from the profile
create function public.cancel_plan(p_reason text default null)
returns public.accounts
language plpgsql
security definer
set search_path = ''
as $$
declare a public.accounts;
begin
  update public.accounts set
    plan_status = 'cancelled',
    cancelled_at = now(),
    cancel_reason = nullif(left(trim(coalesce(p_reason, '')), 500), '')
  where id = (select auth.uid()) and plan <> 'free' and plan_status <> 'cancelled'
  returning * into a;
  if not found then
    raise exception 'nothing_to_cancel' using errcode = '22023';
  end if;

  perform crm_private.account_task(a.email,
    'Cancelación del plan ' || a.plan || ' · ' || coalesce(a.company, a.email),
    'El cliente ' || a.email || ' ha cancelado su suscripción al plan ' || a.plan
      || ' desde su perfil. Dejar de facturar a partir del próximo periodo.'
      || coalesce(' Motivo: ' || a.cancel_reason, ''));
  return a;
end $$;

revoke all on function public.cancel_plan(text) from public, anon;
grant execute on function public.cancel_plan(text) to authenticated;

-- The team (CRM members) activates, changes or closes a customer's plan from the CRM
-- (first created by migration crm_set_account_plan from the CRM repo; now also keeps cancelled_at)
create or replace function public.crm_set_account_plan(p_account uuid, p_plan text, p_status text)
returns public.accounts
language plpgsql
security definer
set search_path = ''
as $$
declare a public.accounts;
begin
  if not (select crm_private.is_member()) then
    raise exception 'Solo el equipo del CRM puede cambiar planes' using errcode = '42501';
  end if;
  if p_plan not in ('free','custom','programs') or p_status not in ('active','requested','cancelled') then
    raise exception 'Plan o estado no válido' using errcode = '22023';
  end if;
  update public.accounts set
    plan = p_plan,
    plan_status = p_status,
    plan_requested_at = case when p_status = 'requested' then coalesce(plan_requested_at, now()) else plan_requested_at end,
    cancelled_at = case when p_status = 'cancelled' then coalesce(cancelled_at, now()) else null end
  where id = p_account
  returning * into a;
  if not found then
    raise exception 'Cuenta no encontrada' using errcode = 'P0002';
  end if;
  return a;
end $$;

revoke all on function public.crm_set_account_plan(uuid, text, text) from public, anon;
grant execute on function public.crm_set_account_plan(uuid, text, text) to authenticated;
