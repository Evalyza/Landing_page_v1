-- Applied to Supabase project Landing_page_v1 (oobfyooytxscmqkrwemj) on 2026-10-26.
--
-- Where each request comes from: the page that sent it (home of programmes or /startups)
-- and the campaign parameters of the visit (utm_source, utm_medium, utm_campaign).
-- Also opens source = 'startups' for the paid-diagnosis page.
-- On rows with source = 'startups', quiz_size is the team size (s: under 15, m: 15 to 60, l: over 60).

alter table public.waitlist drop constraint waitlist_source_check;
alter table public.waitlist add constraint waitlist_source_check check (source in ('hero','waitlist','blog','startups'));

alter table public.waitlist
  add column page text check (page in ('home','startups','recursos')),
  add column utm_source text check (char_length(utm_source) <= 120),
  add column utm_medium text check (char_length(utm_medium) <= 120),
  add column utm_campaign text check (char_length(utm_campaign) <= 120);

alter table public.call_requests
  add column page text check (page in ('home','startups','recursos')),
  add column utm_source text check (char_length(utm_source) <= 120),
  add column utm_medium text check (char_length(utm_medium) <= 120),
  add column utm_campaign text check (char_length(utm_campaign) <= 120);

comment on column public.waitlist.quiz_size is 'Startups per intake (s: up to 10, m: 11-30, l: 30+); team size on rows before 2026-10-25 and on source = startups (s: under 15, m: 15-60, l: over 60)';

-- join_waitlist: same checks as before, plus optional page and UTM parameters
drop function public.join_waitlist(text, text, text, text, text, text, text, text, boolean, text, text);

create function public.join_waitlist(
  p_email text, p_company text, p_role text, p_lang text,
  p_quiz_phase text, p_quiz_size text, p_quiz_pain text,
  p_source text, p_consent boolean, p_article text default null,
  p_prompt text default null, p_page text default null,
  p_utm_source text default null, p_utm_medium text default null, p_utm_campaign text default null
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

  insert into public.waitlist (email, company, role, lang, quiz_phase, quiz_size, quiz_pain, source, article, first_prompt,
                               page, utm_source, utm_medium, utm_campaign, consent)
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
    true
  )
  -- Same email again: keep one row, refresh the optional details, never reveal it existed.
  -- The first page and campaign that brought the person are kept.
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
    consent_at   = now();
end;
$$;

-- request_call: same checks as before, plus optional page and UTM parameters
drop function public.request_call(text, text, text, text, text, boolean);

create function public.request_call(
  p_name text, p_phone_prefix text, p_phone text, p_slot text, p_lang text, p_consent boolean,
  p_page text default null, p_utm_source text default null, p_utm_medium text default null, p_utm_campaign text default null
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_phone text := regexp_replace(coalesce(p_phone, ''), '[\s\-().]', '', 'g');
  v_page text := nullif(p_page, '');
begin
  if p_consent is not true then
    raise exception 'consent_required' using errcode = '22023';
  end if;
  if char_length(trim(coalesce(p_name, ''))) = 0 then
    raise exception 'invalid_name' using errcode = '22023';
  end if;
  if v_phone !~ '^[0-9]{6,15}$' then
    raise exception 'invalid_phone' using errcode = '22023';
  end if;
  if v_page is not null and v_page not in ('home','startups','recursos') then
    v_page := null;
  end if;

  insert into public.call_requests (name, phone_prefix, phone, slot, lang, consent, page, utm_source, utm_medium, utm_campaign)
  values (left(trim(p_name), 120), p_phone_prefix, v_phone, p_slot, coalesce(nullif(p_lang, ''), 'es'), true, v_page,
          nullif(left(trim(coalesce(p_utm_source, '')), 120), ''),
          nullif(left(trim(coalesce(p_utm_medium, '')), 120), ''),
          nullif(left(trim(coalesce(p_utm_campaign, '')), 120), ''));
end;
$$;

revoke all on function public.join_waitlist(text, text, text, text, text, text, text, text, boolean, text, text, text, text, text, text) from public;
revoke all on function public.request_call(text, text, text, text, text, boolean, text, text, text, text) from public;
grant execute on function public.join_waitlist(text, text, text, text, text, text, text, text, boolean, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.request_call(text, text, text, text, text, boolean, text, text, text, text) to anon, authenticated;
