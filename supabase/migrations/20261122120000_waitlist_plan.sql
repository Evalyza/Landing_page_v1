-- Plans on the home page (2026-11-22): Free for companies, Custom (from 35,99 €/month)
-- and Incubators & accelerators (from 49,99 €/month).
-- Applied to Supabase project Landing_page_v1 (oobfyooytxscmqkrwemj).
--
-- - waitlist.plan: plan chosen in the sign-up form (free, custom, programs).
-- - join_waitlist gains an optional p_plan; calls without it (older cached pages) keep working.
-- - The CRM lead takes its segment and product from the plan: company plans go to
--   segment 'pyme' / product 'diagnostico', the programme plan to 'programas'.
--   The plan also travels in the lead payload.

alter table public.waitlist
  add column plan text check (plan in ('free','custom','programs'));

comment on column public.waitlist.plan is 'Plan chosen on the home page: free (companies, 0 €), custom (companies, from 35,99 €/month), programs (incubators and accelerators, from 49,99 €/month)';

-- join_waitlist: same checks as before, plus the optional plan
drop function public.join_waitlist(text, text, text, text, text, text, text, text, boolean, text, text, text, text, text, text);

create function public.join_waitlist(
  p_email text, p_company text, p_role text, p_lang text,
  p_quiz_phase text, p_quiz_size text, p_quiz_pain text,
  p_source text, p_consent boolean, p_article text default null,
  p_prompt text default null, p_page text default null,
  p_utm_source text default null, p_utm_medium text default null, p_utm_campaign text default null,
  p_plan text default null
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
  v_article text := nullif(lower(trim(coalesce(p_article, ''))), '');
  v_prompt text := nullif(left(trim(coalesce(p_prompt, '')), 500), '');
  v_page text := nullif(p_page, '');
  v_plan text := nullif(p_plan, '');
begin
  if p_consent is not true then
    raise exception 'consent_required' using errcode = '22023';
  end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' or char_length(v_email) > 254 then
    raise exception 'invalid_email' using errcode = '22023';
  end if;
  if v_article is not null and v_article !~ '^[a-z0-9-]{1,120}$' then
    v_article := null;
  end if;
  if v_page is not null and v_page not in ('home','startups','recursos') then
    v_page := null;
  end if;
  if v_plan is not null and v_plan not in ('free','custom','programs') then
    v_plan := null;
  end if;

  insert into public.waitlist (email, company, role, lang, quiz_phase, quiz_size, quiz_pain, source, article, first_prompt,
                               page, utm_source, utm_medium, utm_campaign, plan, consent)
  values (
    v_email,
    nullif(left(trim(coalesce(p_company, '')), 160), ''),
    nullif(p_role, ''),
    coalesce(nullif(p_lang, ''), 'es'),
    nullif(p_quiz_phase, ''),
    nullif(p_quiz_size, ''),
    nullif(p_quiz_pain, ''),
    coalesce(nullif(p_source, ''), 'waitlist'),
    v_article,
    v_prompt,
    v_page,
    nullif(left(trim(coalesce(p_utm_source, '')), 120), ''),
    nullif(left(trim(coalesce(p_utm_medium, '')), 120), ''),
    nullif(left(trim(coalesce(p_utm_campaign, '')), 120), ''),
    v_plan,
    true
  )
  -- Same email again: keep one row, refresh the optional details, never reveal it existed.
  -- The first page and campaign that brought the person are kept; the latest plan wins.
  on conflict (lower(email)) do update set
    company      = coalesce(excluded.company, public.waitlist.company),
    role         = coalesce(excluded.role, public.waitlist.role),
    quiz_phase   = coalesce(excluded.quiz_phase, public.waitlist.quiz_phase),
    quiz_size    = coalesce(excluded.quiz_size, public.waitlist.quiz_size),
    quiz_pain    = coalesce(excluded.quiz_pain, public.waitlist.quiz_pain),
    article      = coalesce(public.waitlist.article, excluded.article),
    first_prompt = coalesce(excluded.first_prompt, public.waitlist.first_prompt),
    page         = coalesce(public.waitlist.page, excluded.page),
    utm_source   = coalesce(public.waitlist.utm_source, excluded.utm_source),
    utm_medium   = coalesce(public.waitlist.utm_medium, excluded.utm_medium),
    utm_campaign = coalesce(public.waitlist.utm_campaign, excluded.utm_campaign),
    plan         = coalesce(excluded.plan, public.waitlist.plan),
    consent_at   = now();
end;
$$;

revoke all on function public.join_waitlist(text, text, text, text, text, text, text, text, boolean, text, text, text, text, text, text, text) from public;
grant execute on function public.join_waitlist(text, text, text, text, text, text, text, text, boolean, text, text, text, text, text, text, text) to anon, authenticated;

-- CRM: segment and product follow the plan when there is one
create or replace function crm_private.waitlist_to_lead()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare v_segment text; v_startups boolean; v_product text;
begin
  v_startups := new.source = 'startups' or new.page = 'startups';
  v_segment := case
    when new.plan in ('free','custom') then 'pyme'
    else case new.quiz_phase
      when 'accel' then 'aceleradora' when 'incub' then 'incubadora'
      when 'uni' then 'universidad' when 'corp' then 'corporate'
      when 'preseed' then 'startup' when 'seed' then 'startup' when 'seriea' then 'startup'
      else case when v_startups then 'startup' else 'otro' end end
  end;
  v_product := case
    when new.plan = 'programs' then 'programas'
    when new.plan in ('free','custom') or v_startups or v_segment = 'startup' then 'diagnostico'
    else 'programas'
  end;
  perform crm_private.upsert_web_lead(
    new.email, null, null, new.company, new.role, v_segment, v_product,
    case when new.source = 'blog' then 'resource' else 'pilot' end,
    new.first_prompt,
    jsonb_strip_nulls(jsonb_build_object('origen', new.source, 'pagina', new.page, 'idioma', new.lang, 'plan', new.plan,
      'tipo_programa', new.quiz_phase, 'tamano', new.quiz_size, 'preocupacion', new.quiz_pain, 'articulo', new.article)),
    new.marketing_consent, new.utm_source, new.utm_medium, new.utm_campaign);
  return new;
exception when others then
  raise warning 'crm waitlist_to_lead: %', sqlerrm;
  return new;
end $$;
