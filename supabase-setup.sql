-- ============================================================
-- Home Weavers — Supabase database setup
-- Run this ONCE in your Supabase project:
--   Supabase dashboard -> SQL Editor -> New query -> paste -> Run
-- ============================================================

-- 1) The store table: holds your whole store as one JSON record.
create table if not exists public.store (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2) Turn on Row Level Security (locks the table by default).
alter table public.store enable row level security;

-- 3) Anyone (your website visitors) can READ the store.
drop policy if exists "public can read store" on public.store;
create policy "public can read store"
  on public.store for select
  to anon, authenticated
  using (true);

-- 4) Only signed-in admins can WRITE (insert/update) the store.
drop policy if exists "authenticated can insert store" on public.store;
create policy "authenticated can insert store"
  on public.store for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated can update store" on public.store;
create policy "authenticated can update store"
  on public.store for update
  to authenticated
  using (true)
  with check (true);

-- 5) Seed an empty row so the site has something to load on first run.
insert into public.store (id, data)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

-- ============================================================
-- After running this:
--  A) Create your admin user:
--     Authentication -> Users -> Add user -> enter your email + a
--     strong password -> (tick "Auto Confirm User").
--  B) Get your keys:
--     Project Settings -> API ->
--        "Project URL"      = your Supabase Project URL
--        "anon public" key  = your anon key
--  C) In your store: Admin -> Dashboard -> Backend & sync ->
--     paste URL + anon key -> Save -> sign in with the admin
--     email/password from step (A).
-- Your edits now publish live to every visitor.
-- ============================================================
