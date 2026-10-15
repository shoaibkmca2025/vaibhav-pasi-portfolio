// Small helpers shared by the serverless functions in /api.
// Files and folders starting with "_" are not exposed as routes by Vercel.
import type { IncomingMessage, ServerResponse } from 'node:http';

export type Req = IncomingMessage & { body?: unknown; query?: Record<string, string | string[]> };
export type Res = ServerResponse;

export const env = (name: string) => (process.env[name] ?? '').trim();

export function send(res: Res, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

// Vercel parses JSON bodies for us; the Vite dev bridge passes a raw stream
export async function readJson<T = Record<string, unknown>>(req: Req, maxBytes = 64 * 1024): Promise<T> {
  if (req.body && typeof req.body === 'object') return req.body as T;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > maxBytes) throw new Error('Body too large');
    chunks.push(chunk as Buffer);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : ({} as T);
}

// Only accept POSTs from our own pages (blocks drive-by cross-site form posts)
export function sameOrigin(req: Req) {
  const origin = req.headers.origin;
  if (!origin) return true; // server-to-server / curl
  const host = req.headers['x-forwarded-host'] ?? req.headers.host;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function guard(req: Req, res: Res, method = 'POST') {
  if (req.method !== method) {
    res.setHeader('Allow', method);
    send(res, 405, { error: 'Method not allowed' });
    return false;
  }
  if (method === 'POST' && !sameOrigin(req)) {
    send(res, 403, { error: 'Forbidden' });
    return false;
  }
  return true;
}

// Best-effort, per-instance rate limit: enough to stop a single noisy client
const hits = new Map<string, number[]>();
export function rateLimited(req: Req, limit = 8, windowMs = 60_000) {
  const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? 'unknown').split(',')[0].trim();
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > limit;
}

export const siteUrl = () => env('SITE_URL') || 'https://vaibhavpasi.online';
