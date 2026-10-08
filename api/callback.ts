// GET /api/callback: GitHub redirects here after sign-in. Swaps the one-time code for an
// access token and hands it to the /admin window using the standard Decap/Sveltia CMS handshake.
import { env, type Req, type Res } from './_lib/http';

function page(res: Res, status: number, script: string) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Set-Cookie', 'cms_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  res.end(`<!doctype html><meta charset="utf-8"><title>Signing in…</title><body style="font-family:system-ui;background:#050505;color:#f5f5f7;padding:2rem"><p id="msg">Finishing sign-in…</p><script>${script}</script></body>`);
}

// Sends "authorization:github:<status>:<json>" back to the /admin window, but only if that
// window is on our own site, so the token can never be handed to another origin
function reply(res: Res, status: number, origin: string, outcome: 'success' | 'error', payload: object) {
  const message = JSON.stringify(`authorization:github:${outcome}:${JSON.stringify(payload)}`);
  page(
    res,
    status,
    `(function () {
      var origin = ${JSON.stringify(origin)};
      function receive(e) {
        if (e.origin !== origin) return;
        window.removeEventListener('message', receive);
        window.opener.postMessage(${message}, origin);
        ${outcome === 'success' ? 'setTimeout(function () { window.close(); }, 300);' : ''}
      }
      if (!window.opener) { document.getElementById('msg').textContent = 'Please start sign-in from the /admin page.'; return; }
      window.addEventListener('message', receive);
      window.opener.postMessage('authorizing:github', origin);
      ${outcome === 'error' ? `document.getElementById('msg').textContent = ${JSON.stringify((payload as { message?: string }).message ?? 'Sign-in failed.')};` : ''}
    })();`,
  );
}

function readCookie(req: Req, name: string) {
  const match = String(req.headers.cookie ?? '').match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match?.[1] ?? '';
}

export default async function handler(req: Req, res: Res) {
  const host = String(req.headers['x-forwarded-host'] ?? req.headers.host);
  const origin = `https://${host}`;
  const url = new URL(req.url ?? '', origin);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state || state !== readCookie(req, 'cms_oauth_state')) {
    return reply(res, 400, origin, 'error', { message: 'Sign-in expired or was tampered with. Please try again.' });
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: env('GITHUB_OAUTH_CLIENT_ID'),
        client_secret: env('GITHUB_OAUTH_CLIENT_SECRET'),
        code,
        redirect_uri: `${origin}/api/callback`,
      }),
    });
    const data = (await tokenRes.json()) as { access_token?: string; error_description?: string };
    if (!data.access_token) {
      return reply(res, 401, origin, 'error', { message: data.error_description ?? 'GitHub did not return a token.' });
    }

    // Optional allowlist: ADMIN_GITHUB_USERS="vaibhavpasi,shoaibkmca2025" limits who can sign in,
    // on top of GitHub's own rule that only people with write access to the repo can publish
    const allowed = env('ADMIN_GITHUB_USERS')
      .split(',')
      .map((u) => u.trim().toLowerCase())
      .filter(Boolean);
    if (allowed.length) {
      const userRes = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${data.access_token}`, 'User-Agent': 'vaibhavpasi-cms' },
      });
      const user = (await userRes.json()) as { login?: string };
      if (!user.login || !allowed.includes(user.login.toLowerCase())) {
        return reply(res, 403, origin, 'error', { message: `@${user.login ?? 'unknown'} is not an admin of this site.` });
      }
    }

    return reply(res, 200, origin, 'success', { token: data.access_token, provider: 'github' });
  } catch {
    return reply(res, 502, origin, 'error', { message: 'Could not reach GitHub. Please try again.' });
  }
}
