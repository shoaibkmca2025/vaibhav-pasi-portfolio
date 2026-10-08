// GET /api/auth: starts "Sign in with GitHub" for the blog admin at /admin.
// Needs a GitHub OAuth App (see docs in README → Blog admin) with its callback set to
// https://<your-domain>/api/callback, plus GITHUB_OAUTH_CLIENT_ID / GITHUB_OAUTH_CLIENT_SECRET in Vercel.
import { randomBytes } from 'node:crypto';
import { env, send, type Req, type Res } from './_lib/http';

export default function handler(req: Req, res: Res) {
  const clientId = env('GITHUB_OAUTH_CLIENT_ID');
  if (!clientId) {
    return send(res, 503, {
      error: 'GitHub sign-in is not configured yet. Use "Sign in with token" on /admin, or add GITHUB_OAUTH_CLIENT_ID.',
    });
  }

  const host = String(req.headers['x-forwarded-host'] ?? req.headers.host);
  const state = randomBytes(16).toString('hex');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `https://${host}/api/callback`,
    // The repo is public, so write access to public repos is all the editor needs.
    // If you make the repo private, set GITHUB_OAUTH_SCOPE=repo in Vercel.
    scope: env('GITHUB_OAUTH_SCOPE') || 'public_repo,read:user',
    state,
  });

  // The state value is checked in /api/callback to stop forged sign-in responses
  res.setHeader('Set-Cookie', `cms_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  res.statusCode = 302;
  res.setHeader('Location', `https://github.com/login/oauth/authorize?${params}`);
  res.end();
}
