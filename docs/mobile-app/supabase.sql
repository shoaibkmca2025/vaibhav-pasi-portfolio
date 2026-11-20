-- Mobile app tables, in the same Supabase project as the leads table.
-- Run once in Supabase → SQL Editor. Safe to re-run.
-- Articles themselves are NOT here: they stay as Markdown in the Git repo (see ARCHITECTURE.md).

create table if not exists public.article_events (
  id bigint generated always as identity primary key,
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  event text not null check (event in ('view', 'share')),
  created_at timestamptz not null default now()
);
create index if not exists article_events_slug_idx on public.article_events (slug);

-- Totals per article, read by /api/admin-posts?stats=1
create or replace view public.article_stats as
  select slug,
         count(*) filter (where event = 'view')  as views,
         count(*) filter (where event = 'share') as shares
  from public.article_events
  group by slug;

create table if not exists public.push_tokens (
  token text primary key,
  platform text not null default 'unknown',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Lock everything down: only the server (service-role key, which bypasses RLS) may read or write.
-- No policies are created, so the public anon key can do nothing with these tables.
alter table public.article_events enable row level security;
alter table public.push_tokens enable row level security;
revoke all on public.article_events, public.push_tokens, public.article_stats from anon, authenticated;
