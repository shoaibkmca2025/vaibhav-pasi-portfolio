// GET /api/instagram -> { items } your latest Instagram posts (empty if not connected).
// Cached at Vercel's edge for an hour, so visitors never wait on Instagram and the API's
// rate limits are never close.
import { getInstagramPosts } from './_lib/instagram.js';
import { send, type Req, type Res } from './_lib/http.js';

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return send(res, 405, { error: 'Method not allowed' });
  }
  const { items } = await getInstagramPosts(12);
  // A public, read-only feed: safe to cache (unlike the no-store responses from send())
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.end(JSON.stringify({ items }));
}
