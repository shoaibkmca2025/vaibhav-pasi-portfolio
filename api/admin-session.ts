// /api/admin-session: dashboard sign-in
//   GET    -> { authenticated, setup: { password, github } }
//   POST   { password } -> signs in (sets the session cookie)
//   DELETE -> signs out
import { adminConfigured, endSession, isAuthenticated, passwordMatches, startSession } from './_lib/admin.js';
import { env, rateLimited, readJson, sameOrigin, send, type Req, type Res } from './_lib/http.js';

export default async function handler(req: Req, res: Res) {
  if (req.method === 'GET') {
    return send(res, 200, {
      authenticated: isAuthenticated(req),
      setup: { password: adminConfigured(), github: Boolean(env('GITHUB_TOKEN')) },
    });
  }

  if (!sameOrigin(req)) return send(res, 403, { error: 'Forbidden' });

  if (req.method === 'DELETE') {
    endSession(req, res);
    return send(res, 200, { ok: true });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, DELETE');
    return send(res, 405, { error: 'Method not allowed' });
  }

  // Slows down password guessing: 5 attempts per minute per address
  if (rateLimited(req, 5)) return send(res, 429, { error: 'Too many attempts. Wait a minute and try again.' });

  if (!adminConfigured()) {
    return send(res, 503, { error: 'The dashboard is not set up yet: add ADMIN_PASSWORD (8+ characters) in Vercel.' });
  }

  let body: { password?: unknown };
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { error: 'Invalid request' });
  }

  if (typeof body.password !== 'string' || !passwordMatches(body.password)) {
    return send(res, 401, { error: 'That password is not right.' });
  }

  startSession(req, res);
  return send(res, 200, { ok: true });
}
