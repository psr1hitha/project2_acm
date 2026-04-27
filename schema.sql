-- ============================================================
-- Stock Tracker — Supabase Schema
-- Paste this entire file into the Supabase SQL Editor and click "Run"
-- ============================================================

-- 1. Create the watchlist table
create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  symbol text not null,
  created_at timestamptz default now() not null,
  unique (user_id, symbol)
);

-- 2. Enable Row Level Security (RLS)
-- This makes sure each user only sees and edits their own watchlist
alter table public.watchlist enable row level security;

-- 3. Policies: users can only access their own rows
create policy "Users can view own watchlist"
  on public.watchlist for select
  using (auth.uid() = user_id);

create policy "Users can insert into own watchlist"
  on public.watchlist for insert
  with check (auth.uid() = user_id);

create policy "Users can delete from own watchlist"
  on public.watchlist for delete
  using (auth.uid() = user_id);

-- 4. Index for faster lookups
create index if not exists watchlist_user_id_idx on public.watchlist(user_id);
