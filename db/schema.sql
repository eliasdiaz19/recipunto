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

-- 5) Recycling boxes table
create table if not exists public.recycling_boxes (
  id uuid primary key default gen_random_uuid(),
  lat decimal(10, 8) not null,
  lng decimal(11, 8) not null,
  current_amount integer not null default 0,
  capacity integer not null,
  is_full boolean not null default false,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  -- Constraints
  constraint chk_capacity_positive check (capacity > 0),
  constraint chk_current_amount_non_negative check (current_amount >= 0),
  constraint chk_current_amount_not_exceed_capacity check (current_amount <= capacity)
);

-- 6) Updated_at trigger for recycling_boxes
create trigger trg_recycling_boxes_updated_at
before update on public.recycling_boxes
for each row execute function public.set_updated_at();

-- 7) Function to automatically set is_full based on current_amount and capacity
create or replace function public.update_box_full_status()
returns trigger language plpgsql as $$
begin
  new.is_full = (new.current_amount >= new.capacity);
  new.updated_at = now();
  return new;
end; $$;

create trigger trg_recycling_boxes_full_status
before insert or update on public.recycling_boxes
for each row execute function public.update_box_full_status();

-- 8) Useful indexes
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_created_at on public.profiles(created_at);
create index if not exists idx_recycling_boxes_created_by on public.recycling_boxes(created_by);
create index if not exists idx_recycling_boxes_location on public.recycling_boxes(lat, lng);
create index if not exists idx_recycling_boxes_is_full on public.recycling_boxes(is_full);
create index if not exists idx_recycling_boxes_updated_at on public.recycling_boxes(updated_at);

-- 6) Minimal seed for local (replace UUID with an existing auth.users.id)
-- insert into public.profiles(uid, full_name, role, avatar_url)
-- values ('00000000-0000-0000-0000-000000000000', 'Usuario Demo', 'user', null)
-- on conflict (uid) do nothing;

-- RLS policies are in db/rls.sql