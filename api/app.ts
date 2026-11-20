// POST /api/app: public endpoint for the mobile app (one function, to stay under Vercel's limit)
//   { action: "track", slug, event: "view" | "share" }           -> counts a view or share
//   { action: "register-push", token: "ExponentPushToken[...]", platform } -> subscribes to new-article pushes
//   { action: "unregister-push", token }                         -> unsubscribes
// Reading articles needs no API: the app reads the static /feed/*.json built with the site.
import { isValidSlug } from '../shared/blog.js';
import { deletePushToken, savePushToken, trackEvent } from './_lib/app-data.js';
import { rateLimited, readJson, send, type Req, type Res } from './_lib/http.js';

const PUSH_TOKEN = /^(Exponent|Expo)PushToken\[[\w-]{10,200}\]$/;

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'Method not allowed' });
  }
  // Generous for real readers, but stops anyone inflating the numbers from one address
  if (rateLimited(req, 60)) return send(res, 429, { error: 'Too many requests' });

  let input: { action?: unknown; slug?: unknown; event?: unknown; token?: unknown; platform?: unknown };
  try {
    input = await readJson(req, 4 * 1024);
  } catch {
    return send(res, 400, { error: 'Invalid request' });
  }

  try {
    if (input.action === 'track') {
      const slug = String(input.slug ?? '');
      if (!isValidSlug(slug) || (input.event !== 'view' && input.event !== 'share')) {
        return send(res, 400, { error: 'Invalid request' });
      }
      await trackEvent(slug, input.event);
      return send(res, 200, { ok: true });
    }

    if (input.action === 'register-push' || input.action === 'unregister-push') {
      const token = String(input.token ?? '');
      if (!PUSH_TOKEN.test(token)) return send(res, 400, { error: 'Invalid push token' });
      if (input.action === 'unregister-push') {
        await deletePushToken(token);
      } else {
        const platform = input.platform === 'ios' || input.platform === 'android' ? input.platform : 'unknown';
        await savePushToken(token, platform);
      }
      return send(res, 200, { ok: true });
    }

    return send(res, 400, { error: 'Unknown action' });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: 'Something went wrong' });
  }
}
