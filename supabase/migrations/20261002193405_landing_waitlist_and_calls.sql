-- Landing page leads: waitlist sign-ups and call requests.
-- Applied to Supabase project Landing_page_v1 (oobfyooytxscmqkrwemj, eu-west-1) on 2026-10-02.
-- The browser never touches these tables directly: it calls the two
-- SECURITY DEFINER functions below, which validate every field.

create table public.waitlist (
  id            bigint generated always as identity primary key,
  email         text not null check (char_length(email) between 5 and 254),
  company       text check (char_length(company) <= 160),
  role          text check (role in ('founder','ops','product','investor','other')),
  lang          text not null default 'es' check (lang in ('es','en','fr','de','it')),
  quiz_phase    text check (quiz_phase in ('preseed','seed','seriea')),
  quiz_size     text check (quiz_size in ('s','m','l')),
  quiz_pain     text check (quiz_pain in ('coord','sales','hiring','report')),
  source        text not null default 'waitlist' check (source in ('hero','waitlist')),
  consent       boolean not null check (consent),
  consent_at    timestamptz not null default now(),
  created_at    timestamptz not null default now()
);
create unique index waitlist_email_lower_key on public.waitlist (lower(email));

create table public.call_requests (
  id            bigint generated always as identity primary key,
  name          text not null check (char_length(name) between 1 and 120),
  phone_prefix  text not null check (phone_prefix in ('+34','+44','+33','+49','+39','+351','+1')),
  phone         text not null check (phone ~ '^[0-9]{6,15}$'),
  slot          text not null check (slot in ('am','pm')),
  lang          text not null default 'es' check (lang in ('es','en','fr','de','it')),
  consent       boolean not null check (consent),
  consent_at    timestamptz not null default now(),
  status        text not null default 'pending' check (status in ('pending','called','discarded')),
  created_at    timestamptz not null default now()
);

alter table public.waitlist enable row level security;
alter table public.call_requests enable row level security;
-- No policies: anon/authenticated cannot read or write the tables directly.
revoke all on public.waitlist, public.call_requests from anon, authenticated;

create or replace function public.join_waitlist(
  p_email text, p_company text, p_role text, p_lang text,
  p_quiz_phase text, p_quiz_size text, p_quiz_pain text,
  p_source text, p_consent boolean
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
begin
  if p_consent is not true then
    raise exception 'consent_required' using errcode = '22023';
  end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' or char_length(v_email) > 254 then
    raise exception 'invalid_email' using errcode = '22023';
  end if;

  insert into public.waitlist (email, company, role, lang, quiz_phase, quiz_size, quiz_pain, source, consent)
  values (
    v_email,
    nullif(left(trim(coalesce(p_company, '')), 160), ''),
    nullif(p_role, ''),
    coalesce(nullif(p_lang, ''), 'es'),
    nullif(p_quiz_phase, ''),
    nullif(p_quiz_size, ''),
    nullif(p_quiz_pain, ''),
    coalesce(nullif(p_source, ''), 'waitlist'),
    true
  )
  -- Same email again: keep one row, refresh the optional details, never reveal it existed
  on conflict (lower(email)) do update set
    company    = coalesce(excluded.company, public.waitlist.company),
    role       = coalesce(excluded.role, public.waitlist.role),
    quiz_phase = coalesce(excluded.quiz_phase, public.waitlist.quiz_phase),
    quiz_size  = coalesce(excluded.quiz_size, public.waitlist.quiz_size),
    quiz_pain  = coalesce(excluded.quiz_pain, public.waitlist.quiz_pain),
    consent_at = now();
end;
$$;

create or replace function public.request_call(
  p_name text, p_phone_prefix text, p_phone text, p_slot text, p_lang text, p_consent boolean
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_phone text := regexp_replace(coalesce(p_phone, ''), '[\s\-().]', '', 'g');
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

  insert into public.call_requests (name, phone_prefix, phone, slot, lang, consent)
  values (left(trim(p_name), 120), p_phone_prefix, v_phone, p_slot, coalesce(nullif(p_lang, ''), 'es'), true);
end;
$$;

revoke all on function public.join_waitlist(text, text, text, text, text, text, text, text, boolean) from public;
revoke all on function public.request_call(text, text, text, text, text, boolean) from public;
grant execute on function public.join_waitlist(text, text, text, text, text, text, text, text, boolean) to anon, authenticated;
grant execute on function public.request_call(text, text, text, text, text, boolean) to anon, authenticated;
