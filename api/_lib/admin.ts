// Dashboard sign-in: a single admin password (ADMIN_PASSWORD) and a signed session cookie.
// The cookie is HttpOnly (page scripts can't read it), Secure, SameSite=Strict and lasts 7 days.
// Changing ADMIN_PASSWORD signs everyone out, because the signing key is derived from it.
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { env, send, sameOrigin, type Req, type Res } from './http.js';

const COOKIE = 'vp_admin';
const MAX_AGE_S = 7 * 24 * 60 * 60;

const sha256 = (value: string) => createHash('sha256').update(value).digest();

function signingKey() {
  const secret = env('ADMIN_SESSION_SECRET') || `session:${env('ADMIN_PASSWORD')}`;
  return sha256(secret);
}

const sign = (payload: string) => createHmac('sha256', signingKey()).update(payload).digest('base64url');

export const adminConfigured = () => env('ADMIN_PASSWORD').length >= 8;

// Constant-time comparison, so response timing reveals nothing about the password
export function passwordMatches(input: string) {
  if (!adminConfigured()) return false;
  return timingSafeEqual(sha256(input), sha256(env('ADMIN_PASSWORD')));
}

function cookieFlags(req: Req) {
  const host = String(req.headers['x-forwarded-host'] ?? req.headers.host ?? '');
  // Secure (https-only) everywhere except local development over plain http
  const secure = /^(localhost|127\.0\.0\.1)(:|$)/.test(host) ? '' : '; Secure';
  return `Path=/api; HttpOnly; SameSite=Strict${secure}`;
}

export function startSession(req: Req, res: Res) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE_S * 1000 })).toString('base64url');
  res.setHeader('Set-Cookie', `${COOKIE}=${payload}.${sign(payload)}; ${cookieFlags(req)}; Max-Age=${MAX_AGE_S}`);
}

export function endSession(req: Req, res: Res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; ${cookieFlags(req)}; Max-Age=0`);
}

export function isAuthenticated(req: Req) {
  if (!adminConfigured()) return false;
  const match = String(req.headers.cookie ?? '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!match) return false;
  const [payload, signature] = match[1].split('.');
  if (!payload || !signature) return false;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp: number };
    return typeof exp === 'number' && exp > Date.now();
  } catch {
    return false;
  }
}

// Gate for every dashboard endpoint: signed in, and (for changes) coming from our own pages
export function requireAdmin(req: Req, res: Res) {
  if (req.method !== 'GET' && !sameOrigin(req)) {
    send(res, 403, { error: 'Forbidden' });
    return false;
  }
  if (!isAuthenticated(req)) {
    send(res, 401, { error: 'Please sign in again.' });
    return false;
  }
  return true;
}
