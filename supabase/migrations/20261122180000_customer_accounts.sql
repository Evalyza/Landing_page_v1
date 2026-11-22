-- Customer accounts (2026-11-22): sign-up and profile at ozmetra.com/cuenta/.
-- Applied to Supabase project Landing_page_v1 (oobfyooytxscmqkrwemj).
--
-- This project's Auth is shared with the internal CRM (crm_profiles, is_member()). Customers are
-- told apart by raw_user_meta_data.account_type = 'customer', which the website sets on sign-up:
-- - crm_private.handle_new_user() no longer creates a CRM team profile for them.
-- - crm_private.handle_new_customer() creates their row in public.accounts and a CRM lead.
-- A customer can read and edit only their own account and only the company fields; plan and
-- plan_status change through request_plan(), and a paid plan stays 'requested' until the team
-- activates it from the database or the CRM.

create table public.accounts (
  id                 uuid primary key references auth.users (id) on delete cascade,
  email              text not null,
  full_name          text check (char_length(full_name) <= 120),
  company            text check (char_length(company) <= 160),
  role               text check (role in ('founder','director','analyst','mentor','other')),
  program_type       text check (program_type in ('incub','accel','uni','corp')),
  sector             text check (char_length(sector) <= 80),
  team_size          text check (team_size in ('1-10','11-50','51-200','200+')),
  website            text check (char_length(website) <= 200),
  phone              text check (char_length(phone) <= 30),
  plan               text not null default 'free' check (plan in ('free','custom','programs')),
  plan_status        text not null default 'active' check (plan_status in ('active','requested','cancelled')),
  plan_requested_at  timestamptz,
  lang               text not null default 'es' check (lang in ('es','en','fr','de','it')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.accounts is 'Customer accounts created from ozmetra.com/cuenta/. plan_status: active (in use), requested (paid plan asked for, pending activation by the team), cancelled.';

alter table public.accounts enable row level security;

create policy "own account read" on public.accounts for select to authenticated
  using (id = (select auth.uid()));
create policy "own account update" on public.accounts for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "crm members read" on public.accounts for select to authenticated
  using ((select crm_private.is_member()));

-- Only the company fields are editable by the customer
revoke all on public.accounts from anon, authenticated;
grant select on public.accounts to authenticated;
grant update (full_name, company, role, program_type, sector, team_size, website, phone, lang) on public.accounts to authenticated;

create function public.accounts_touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;
create trigger accounts_touch_updated_at before update on public.accounts
  for each row execute function public.accounts_touch_updated_at();

-- CRM team profiles: not for customers
create or replace function crm_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare first_user boolean;
begin
  if new.raw_user_meta_data->>'account_type' = 'customer' then
    return new;
  end if;
  select not exists (select 1 from public.crm_profiles) into first_user;
  insert into public.crm_profiles (id, email, full_name, role, active)
  values (
    new.id, new.email,
    coalesce(nullif(new.raw_user_meta_data->>'full_name',''), split_part(new.email,'@',1)),
    case when first_user then 'admin' else 'sales' end,
    first_user
  ) on conflict (id) do nothing;
  return new;
end $$;

-- Customers: account row + CRM lead (never blocks the sign-up)
create function crm_private.handle_new_customer()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_plan text := case when m->>'plan' in ('free','custom','programs') then m->>'plan' else 'free' end;
  v_program text := case when v_plan = 'programs' and m->>'program_type' in ('incub','accel','uni','corp') then m->>'program_type' end;
  v_role text := case when m->>'role' in ('founder','director','analyst','mentor','other') then m->>'role' end;
  v_lang text := case when m->>'lang' in ('es','en','fr','de','it') then m->>'lang' else 'es' end;
  v_name text := nullif(left(trim(coalesce(m->>'full_name', '')), 120), '');
  v_company text := nullif(left(trim(coalesce(m->>'company', '')), 160), '');
  v_segment text;
begin
  if m->>'account_type' is distinct from 'customer' then
    return new;
  end if;

  insert into public.accounts (id, email, full_name, company, role, program_type, plan, plan_status, plan_requested_at, lang)
  values (new.id, new.email, v_name, v_company, v_role, v_program, v_plan,
          case when v_plan = 'free' then 'active' else 'requested' end,
          case when v_plan = 'free' then null else now() end,
          v_lang)
  on conflict (id) do nothing;

  begin
    v_segment := case
      when v_plan <> 'programs' then 'pyme'
      when v_program = 'accel' then 'aceleradora'
      when v_program = 'incub' then 'incubadora'
      when v_program = 'uni' then 'universidad'
      when v_program = 'corp' then 'corporate'
      else 'otro' end;
    perform crm_private.upsert_web_lead(
      new.email, v_name, null, v_company, v_role, v_segment,
      case when v_plan = 'programs' then 'programas' else 'diagnostico' end,
      'signup',
      'Cuenta creada en ozmetra.com con el plan ' || v_plan,
      jsonb_strip_nulls(jsonb_build_object('origen', 'cuenta', 'plan', v_plan, 'tipo_programa', v_program,
        'idioma', v_lang, 'cuenta_id', new.id)),
      true,
      nullif(left(m->>'utm_source', 120), ''), nullif(left(m->>'utm_medium', 120), ''), nullif(left(m->>'utm_campaign', 120), ''));
  exception when others then
    raise warning 'crm handle_new_customer: %', sqlerrm;
  end;
  return new;
end $$;

create trigger customer_on_auth_user_created after insert on auth.users
  for each row execute function crm_private.handle_new_customer();

-- Change of plan from the profile: free is active at once, paid plans are requested
create function public.request_plan(p_plan text)
returns public.accounts
language plpgsql
security definer
set search_path = ''
as $$
declare a public.accounts;
begin
  if p_plan not in ('free','custom','programs') then
    raise exception 'invalid_plan' using errcode = '22023';
  end if;
  update public.accounts set
    plan = p_plan,
    plan_status = case when p_plan = 'free' then 'active' else 'requested' end,
    plan_requested_at = case when p_plan = 'free' then null else now() end
  where id = (select auth.uid())
  returning * into a;
  if not found then
    raise exception 'no_account' using errcode = '42501';
  end if;

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
  return a;
end $$;

revoke all on function public.request_plan(text) from public, anon;
grant execute on function public.request_plan(text) to authenticated;
revoke all on function crm_private.handle_new_customer() from public, anon, authenticated;
revoke all on function public.accounts_touch_updated_at() from public, anon, authenticated;
