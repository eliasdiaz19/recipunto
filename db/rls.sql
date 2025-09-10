-- Row Level Security (RLS) policies for Recipunto
-- Run this after creating the tables in schema.sql

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.recycling_boxes enable row level security;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
create policy "Users can view all profiles" on public.profiles
  for select using (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = uid);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = uid);

-- User settings policies
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
create policy "Users can view their own settings" on public.user_settings
  for select using (auth.uid() = uid);

DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
create policy "Users can update their own settings" on public.user_settings
  for update using (auth.uid() = uid);

DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;
create policy "Users can insert their own settings" on public.user_settings
  for insert with check (auth.uid() = uid);

-- Recycling boxes policies
DROP POLICY IF EXISTS "Anyone can view recycling boxes" ON public.recycling_boxes;
create policy "Anyone can view recycling boxes" on public.recycling_boxes
  for select using (true);

DROP POLICY IF EXISTS "Authenticated users can create boxes" ON public.recycling_boxes;
create policy "Authenticated users can create boxes" on public.recycling_boxes
  for insert with check (auth.uid() = created_by);

-- Policy: Box creators can update their boxes (all fields)
DROP POLICY IF EXISTS "Box creators can update their boxes" ON public.recycling_boxes;
create policy "Box creators can update their boxes" on public.recycling_boxes
  for update using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

-- Policy: Authenticated users can update current_amount and is_full (collaborative updates)
DROP POLICY IF EXISTS "Authenticated users can update status" ON public.recycling_boxes;
create policy "Authenticated users can update status" on public.recycling_boxes
  for update using (auth.role() = 'authenticated')
  with check (
    auth.role() = 'authenticated' AND
    -- Ensure current_amount is within valid range
    current_amount >= 0 AND current_amount <= capacity
  );

DROP POLICY IF EXISTS "Box creators can delete their boxes" ON public.recycling_boxes;
create policy "Box creators can delete their boxes" on public.recycling_boxes
  for delete using (auth.uid() = created_by);

-- Admins can do everything (optional - uncomment if you have admin role)
-- create policy "Admins can manage all boxes" on public.recycling_boxes
--   for all using (
--     exists (
--       select 1 from public.profiles 
--       where uid = auth.uid() and role = 'admin'
--     )
--   );
