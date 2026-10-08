-- Contacts the Ozmetra team adds by hand (outreach, partners, investors).
-- Applied to Supabase project Landing_page_v1 (oobfyooytxscmqkrwemj) on 2026-10-08.
-- Separate from public.waitlist, which only holds people who signed up
-- on the website and gave consent. Private: no access from the website.

create table public.contactos (
  id              bigint generated always as identity primary key,
  empresa         text not null check (char_length(empresa) between 1 and 160),
  sector          text check (char_length(sector) <= 200),
  ubicacion       text check (char_length(ubicacion) <= 160),
  ronda           text check (char_length(ronda) <= 300),
  nota            text check (char_length(nota) <= 2000),
  telefono        text check (char_length(telefono) <= 40),
  tipo_telefono   text check (tipo_telefono in ('movil','fijo')),
  email           text check (char_length(email) <= 254),
  web             text check (char_length(web) <= 300),
  web_secundaria  text check (char_length(web_secundaria) <= 300),
  fuente_url      text check (char_length(fuente_url) <= 500),
  estado          text not null default 'pendiente'
                  check (estado in ('pendiente','contactado','en_conversacion','en_waitlist','descartado')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create unique index contactos_email_lower_key on public.contactos (lower(email)) where email is not null;

alter table public.contactos enable row level security;
revoke all on public.contactos from anon, authenticated;

create or replace function public.contactos_touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger contactos_updated_at before update on public.contactos
  for each row execute function public.contactos_touch_updated_at();
