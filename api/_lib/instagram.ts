// Latest posts from Instagram's official API ("Instagram API with Instagram Login").
// Needs INSTAGRAM_ACCESS_TOKEN: a long-lived token for a Professional (Creator/Business) account.
// Tokens last 60 days; we ask Instagram to extend it about once a day while the site is visited,
// and if it ever expires the gallery simply shows the dashboard uploads instead.
import type { GalleryItem } from '../../shared/gallery.js';
import { env } from './http.js';

// Override only for local testing
const API = process.env.INSTAGRAM_API_URL || 'https://graph.instagram.com';
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
const CACHE_MS = 10 * 60 * 1000;

export interface InstagramStatus {
  configured: boolean;
  ok: boolean;
  error?: string;
}

interface Media {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

let cache: { at: number; items: GalleryItem[]; status: InstagramStatus } | null = null;
let lastRefresh = 0;

function toItem(m: Media): GalleryItem | null {
  // Videos show their cover frame; carousels show the first photo
  const image = m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url;
  if (!image) return null;
  return {
    id: `ig-${m.id}`,
    image,
    caption: (m.caption ?? '').slice(0, 300),
    link: m.permalink,
    date: m.timestamp.slice(0, 10),
    kind: m.media_type === 'VIDEO' ? 'video' : m.media_type === 'CAROUSEL_ALBUM' ? 'carousel' : 'image',
    source: 'instagram',
  };
}

// Extends the token's 60-day life. Best effort: failures are ignored.
function refreshToken(token: string) {
  if (Date.now() - lastRefresh < 24 * 60 * 60 * 1000) return;
  lastRefresh = Date.now();
  fetch(`${API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`).catch(() => {});
}

export async function getInstagramPosts(limit = 12): Promise<{ items: GalleryItem[]; status: InstagramStatus }> {
  const token = env('INSTAGRAM_ACCESS_TOKEN');
  if (!token) return { items: [], status: { configured: false, ok: false } };
  if (cache && Date.now() - cache.at < CACHE_MS) return { items: cache.items, status: cache.status };

  try {
    const res = await fetch(`${API}/me/media?fields=${FIELDS}&limit=${limit}&access_token=${encodeURIComponent(token)}`);
    const data = (await res.json()) as { data?: Media[]; error?: { message?: string; code?: number } };
    if (!res.ok || !data.data) {
      const expired = data.error?.code === 190;
      const status: InstagramStatus = {
        configured: true,
        ok: false,
        error: expired
          ? 'The Instagram token has expired. Generate a new one and update INSTAGRAM_ACCESS_TOKEN in Vercel.'
          : `Instagram returned an error: ${data.error?.message ?? res.statusText}`,
      };
      cache = { at: Date.now(), items: [], status };
      return { items: [], status };
    }
    refreshToken(token);
    const items = data.data.map(toItem).filter((i): i is GalleryItem => i !== null);
    cache = { at: Date.now(), items, status: { configured: true, ok: true } };
    return { items, status: cache.status };
  } catch {
    return { items: cache?.items ?? [], status: { configured: true, ok: false, error: 'Could not reach Instagram.' } };
  }
}
