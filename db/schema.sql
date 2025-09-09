-- Recipunto initial schema (Supabase/Postgres)
-- Run this in Supabase SQL editor or via psql:
--   psql "$DB_URL" -f db/schema.sql

-- 1) App role enum
create type app_role as enum ('user', 'recycler', 'admin');

-- 2) Profiles table (1:1 with auth.users)
create table if not exists public.profiles (
  uid uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role app_role not null default 'user',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) Updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- 4) Optional per-user settings
create table if not exists public.user_settings (
  uid uuid primary key references auth.users(id) on delete cascade,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_user_settings_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

-- 5) Useful indexes
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_created_at on public.profiles(created_at);

-- 6) Minimal seed for local (replace UUID with an existing auth.users.id)
-- insert into public.profiles(uid, full_name, role, avatar_url)
-- values ('00000000-0000-0000-0000-000000000000', 'Usuario Demo', 'user', null)
-- on conflict (uid) do nothing;

-- RLS policies are in db/rls.sql