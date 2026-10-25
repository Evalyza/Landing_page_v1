-- Landing refocused on accelerators, incubators and viveros (2026-10-25).
-- Applied to Supabase project Landing_page_v1 (oobfyooytxscmqkrwemj).
--
-- The sign-up form now asks for the visitor's role inside a programme and the quick
-- check asks about the programme, so the accepted values grow. The old values stay
-- valid so existing rows keep passing the checks.
--   role:       + director (programme lead), analyst (selection or investment), mentor
--   quiz_phase: + accel, incub, uni, corp   (type of programme)
--   quiz_size:  s / m / l now mean startups per intake (up to 10, 11 to 30, more than 30)
--   quiz_pain:  + select, follow, impact, time (main concern)

alter table public.waitlist drop constraint waitlist_role_check;
alter table public.waitlist add constraint waitlist_role_check
  check (role in ('founder','ops','product','investor','other','director','analyst','mentor'));

alter table public.waitlist drop constraint waitlist_quiz_phase_check;
alter table public.waitlist add constraint waitlist_quiz_phase_check
  check (quiz_phase in ('preseed','seed','seriea','accel','incub','uni','corp'));

alter table public.waitlist drop constraint waitlist_quiz_pain_check;
alter table public.waitlist add constraint waitlist_quiz_pain_check
  check (quiz_pain in ('coord','sales','hiring','report','select','follow','impact','time'));

comment on column public.waitlist.quiz_phase is 'Type of programme (accel, incub, uni, corp); preseed/seed/seriea on rows before 2026-10-25';
comment on column public.waitlist.quiz_size is 'Startups per intake (s: up to 10, m: 11-30, l: 30+); team size on rows before 2026-10-25';
comment on column public.waitlist.quiz_pain is 'Main concern (select, follow, impact, time); startup pain on rows before 2026-10-25';
