// Runtime data for the mobile app, in Supabase (the same project the leads use).
// Tables: docs/mobile-app/supabase.sql. Optional like every integration: without
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY, tracking is skipped and stats come back empty.
// The service-role key stays on the server. The app never talks to Supabase directly.
import { env } from './http.js';

export type ArticleEvent = 'view' | 'share';

function supabase() {
  const url = env('SUPABASE_URL');
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return null;
  return (path: string, init: RequestInit = {}) =>
    fetch(`${url.replace(/\/$/, '')}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        ...(init.headers as Record<string, string>),
      },
    });
}

export const appDataConfigured = () => supabase() !== null;

export async function trackEvent(slug: string, event: ArticleEvent) {
  const db = supabase();
  if (!db) return;
  const r = await db('article_events', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ slug, event }),
  });
  if (!r.ok) console.error('article_events insert failed', r.status, await r.text().catch(() => ''));
}

export async function savePushToken(token: string, platform: string) {
  const db = supabase();
  if (!db) return;
  // Upsert on the token, so reinstalling or re-registering never creates duplicates
  const r = await db('push_tokens?on_conflict=token', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ token, platform, updated_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error(`push_tokens upsert failed: ${r.status}`);
}

export async function deletePushToken(token: string) {
  const db = supabase();
  if (!db) return;
  const r = await db(`push_tokens?token=eq.${encodeURIComponent(token)}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
  if (!r.ok) throw new Error(`push_tokens delete failed: ${r.status}`);
}

// { "<slug>": { views, shares } } summed over all time (view: article_stats in supabase.sql)
export async function articleStats(): Promise<Record<string, { views: number; shares: number }>> {
  const db = supabase();
  if (!db) return {};
  const r = await db('article_stats?select=slug,views,shares');
  if (!r.ok) {
    console.error('article_stats read failed', r.status);
    return {};
  }
  const rows = (await r.json()) as { slug: string; views: number; shares: number }[];
  return Object.fromEntries(rows.map((row) => [row.slug, { views: Number(row.views) || 0, shares: Number(row.shares) || 0 }]));
}
