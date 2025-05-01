create extension if not exists pgcrypto;

create table if not exists public.notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text,
  content     text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Enable Row-Level Security
alter table public.notes enable row level security;

-- RLS Policies
create policy "Users can INSERT their own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Users can SELECT/UPDATE/DELETE only their notes"
  on public.notes for select, update, delete
  using (auth.uid() = user_id);