create table if not exists public.property_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null,
  society text,
  location text not null default 'Kharadi, Pune',
  excerpt text not null,
  body text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.property_posts enable row level security;

create policy "Published posts are public"
on public.property_posts
for select
using (status = 'published');
