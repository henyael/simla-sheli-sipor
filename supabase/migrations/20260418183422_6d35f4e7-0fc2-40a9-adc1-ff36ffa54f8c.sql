create table public.stories (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  child_name text not null,
  topic text not null,
  length text not null,
  sentiment text not null,
  title text not null,
  pages jsonb not null,
  created_at timestamptz not null default now()
);

create index stories_device_id_created_at_idx
  on public.stories (device_id, created_at desc);

alter table public.stories enable row level security;

create policy "read own device stories"
  on public.stories for select
  using (device_id = coalesce(
    current_setting('request.headers', true)::json->>'x-device-id',
    ''
  ) and device_id <> '');

create policy "insert own device stories"
  on public.stories for insert
  with check (device_id = coalesce(
    current_setting('request.headers', true)::json->>'x-device-id',
    ''
  ) and device_id <> '');

create policy "delete own device stories"
  on public.stories for delete
  using (device_id = coalesce(
    current_setting('request.headers', true)::json->>'x-device-id',
    ''
  ) and device_id <> '');