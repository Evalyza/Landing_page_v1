-- Recursos (blog at ozmetra.com/recursos/): downloads in exchange for an email,
-- and which article brought each waitlist sign-up.
-- Applied to Supabase project Landing_page_v1 (oobfyooytxscmqkrwemj) on 2026-10-05.
--
-- - waitlist.source accepts 'blog' (sign-ups made from a resource download form).
-- - waitlist.article: first article that brought the person (kept on later sign-ups).
-- - waitlist.marketing_consent: separate, optional consent to receive content by email.
--   The launch-notice consent stays in waitlist.consent.
-- - resource_downloads: one row per download, so a person who downloads three
--   resources counts three times per article but stays one row in the waitlist.
-- - blog_stats(): per-article totals for the monthly report (service role only).

alter table public.waitlist drop constraint waitlist_source_check;
alter table public.waitlist add constraint waitlist_source_check check (source in ('hero','waitlist','blog'));

alter table public.waitlist
  add column article text check (article ~ '^[a-z0-9-]{1,120}$'),
  add column marketing_consent boolean not null default false,
  add column marketing_consent_at timestamptz;

create table public.resource_downloads (
  id                bigint generated always as identity primary key,
  email             text not null check (char_length(email) between 5 and 254),
  article           text not null check (article ~ '^[a-z0-9-]{1,120}$'),
  lang              text not null default 'es' check (lang in ('es','en','fr','de','it')),
  marketing_consent boolean not null default false,
  created_at        timestamptz not null default now()
);
create index resource_downloads_article_idx on public.resource_downloads (article, created_at);

alter table public.resource_downloads enable row level security;
revoke all on public.resource_downloads from anon, authenticated;

-- join_waitlist gains an optional p_article. The old signature is dropped so
-- PostgREST resolves a single function; calls without p_article keep working.
drop function public.join_waitlist(text, text, text, text, text, text, text, text, boolean);

create function public.join_waitlist(
  p_email text, p_company text, p_role text, p_lang text,
  p_quiz_phase text, p_quiz_size text, p_quiz_pain text,
  p_source text, p_consent boolean, p_article text default null
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
  v_article text := nullif(lower(trim(coalesce(p_article, ''))), '');
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

  insert into public.waitlist (email, company, role, lang, quiz_phase, quiz_size, quiz_pain, source, article, consent)
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
    true
  )
  -- Same email again: keep one row, refresh the optional details, never reveal it existed
  on conflict (lower(email)) do update set
    company    = coalesce(excluded.company, public.waitlist.company),
    role       = coalesce(excluded.role, public.waitlist.role),
    quiz_phase = coalesce(excluded.quiz_phase, public.waitlist.quiz_phase),
    quiz_size  = coalesce(excluded.quiz_size, public.waitlist.quiz_size),
    quiz_pain  = coalesce(excluded.quiz_pain, public.waitlist.quiz_pain),
    article    = coalesce(public.waitlist.article, excluded.article),
    consent_at = now();
end;
$$;

-- Resource download: the person accepts the terms and the launch notice (same as the
-- waitlist) and may opt in to content emails. Logs the download and joins the waitlist.
create function public.download_resource(
  p_email text, p_article text, p_lang text, p_consent boolean, p_marketing_consent boolean
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
  v_article text := lower(trim(coalesce(p_article, '')));
  v_lang text := coalesce(nullif(p_lang, ''), 'es');
  v_marketing boolean := coalesce(p_marketing_consent, false);
begin
  if p_consent is not true then
    raise exception 'consent_required' using errcode = '22023';
  end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' or char_length(v_email) > 254 then
    raise exception 'invalid_email' using errcode = '22023';
  end if;
  if v_article !~ '^[a-z0-9-]{1,120}$' then
    raise exception 'invalid_article' using errcode = '22023';
  end if;

  insert into public.resource_downloads (email, article, lang, marketing_consent)
  values (v_email, v_article, v_lang, v_marketing);

  insert into public.waitlist (email, lang, source, article, consent, marketing_consent, marketing_consent_at)
  values (v_email, v_lang, 'blog', v_article, true, v_marketing, case when v_marketing then now() end)
  -- Opting in again refreshes the consent; leaving the box empty never withdraws it
  -- silently (withdrawal goes through the contact email in the privacy policy).
  on conflict (lower(email)) do update set
    article              = coalesce(public.waitlist.article, excluded.article),
    marketing_consent    = public.waitlist.marketing_consent or excluded.marketing_consent,
    marketing_consent_at = case when excluded.marketing_consent then now() else public.waitlist.marketing_consent_at end,
    consent_at           = now();
end;
$$;

-- Monthly report: downloads and sign-ups attributed to each article in [p_from, p_to).
create function public.blog_stats(p_from timestamptz, p_to timestamptz)
returns table (article text, downloads bigint, downloaders bigint, signups bigint, marketing_optins bigint)
language sql
stable
security definer
set search_path = ''
as $$
  with d as (
    select r.article, count(*) as downloads, count(distinct r.email) as downloaders,
           count(distinct r.email) filter (where r.marketing_consent) as marketing_optins
    from public.resource_downloads r
    where r.created_at >= p_from and r.created_at < p_to
    group by r.article
  ), s as (
    select w.article, count(*) as signups
    from public.waitlist w
    where w.article is not null and w.created_at >= p_from and w.created_at < p_to
    group by w.article
  )
  select coalesce(d.article, s.article),
         coalesce(d.downloads, 0), coalesce(d.downloaders, 0),
         coalesce(s.signups, 0), coalesce(d.marketing_optins, 0)
  from d full join s on s.article = d.article
  order by 4 desc, 2 desc;
$$;

revoke all on function public.join_waitlist(text, text, text, text, text, text, text, text, boolean, text) from public;
revoke all on function public.download_resource(text, text, text, boolean, boolean) from public;
revoke all on function public.blog_stats(timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.join_waitlist(text, text, text, text, text, text, text, text, boolean, text) to anon, authenticated;
grant execute on function public.download_resource(text, text, text, boolean, boolean) to anon, authenticated;
grant execute on function public.blog_stats(timestamptz, timestamptz) to service_role;
