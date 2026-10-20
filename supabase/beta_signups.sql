-- Beta-Anmeldungen der Website (smartbasket.samisam.org).
-- Einmalig im Supabase-SQL-Editor des App-Projekts ausführen.
create table if not exists public.beta_signups (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  consent_at  timestamptz not null default now(),
  consent_text text not null,
  source      text not null default 'website-de',
  created_at  timestamptz not null default now(),
  constraint beta_signups_email_format check (email = lower(email) and length(email) <= 254 and email like '%_@_%._%')
);
create unique index if not exists beta_signups_email_key on public.beta_signups (email);

-- Kein Zugriff für App-Rollen: nur die Website-Function schreibt mit dem Service-Role-Schlüssel.
alter table public.beta_signups enable row level security;
revoke all on public.beta_signups from anon, authenticated;
