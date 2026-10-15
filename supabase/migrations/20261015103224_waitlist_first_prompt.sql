-- "Empezar gratis": the request typed in the hero prompt box travels with the sign-up.
-- Applied to Supabase project Landing_page_v1 (oobfyooytxscmqkrwemj) on 2026-10-15.
--
-- - waitlist.first_prompt: the visitor's first request to Ozmetra (max 500 chars).
-- - join_waitlist gains an optional p_prompt; calls without it keep working.

alter table public.waitlist add column first_prompt text check (char_length(first_prompt) <= 500);

drop function public.join_waitlist(text, text, text, text, text, text, text, text, boolean, text);

create function public.join_waitlist(
  p_email text, p_company text, p_role text, p_lang text,
  p_quiz_phase text, p_quiz_size text, p_quiz_pain text,
  p_source text, p_consent boolean, p_article text default null,
  p_prompt text default null
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
  v_article text := nullif(lower(trim(coalesce(p_article, ''))), '');
  v_prompt text := nullif(left(trim(coalesce(p_prompt, '')), 500), '');
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

  insert into public.waitlist (email, company, role, lang, quiz_phase, quiz_size, quiz_pain, source, article, first_prompt, consent)
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
    true
  )
  -- Same email again: keep one row, refresh the optional details, never reveal it existed
  on conflict (lower(email)) do update set
    company      = coalesce(excluded.company, public.waitlist.company),
    role         = coalesce(excluded.role, public.waitlist.role),
    quiz_phase   = coalesce(excluded.quiz_phase, public.waitlist.quiz_phase),
    quiz_size    = coalesce(excluded.quiz_size, public.waitlist.quiz_size),
    quiz_pain    = coalesce(excluded.quiz_pain, public.waitlist.quiz_pain),
    article      = coalesce(public.waitlist.article, excluded.article),
    first_prompt = coalesce(excluded.first_prompt, public.waitlist.first_prompt),
    consent_at   = now();
end;
$$;

revoke all on function public.join_waitlist(text, text, text, text, text, text, text, text, boolean, text, text) from public;
grant execute on function public.join_waitlist(text, text, text, text, text, text, text, text, boolean, text, text) to anon, authenticated;
