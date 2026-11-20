// Client for the website's publishing API (/api/admin-*), the same one the web dashboard uses.
// Auth is a bearer token from /api/admin-session, kept in the device keychain (see auth.tsx).
import type { PostMeta, PostStatus } from './blog';
import { SITE_URL } from './config';

export interface PostSummary extends PostMeta {
  slug: string;
  sha: string;
  status: PostStatus;
  words: number;
}

export interface FullPost {
  slug: string;
  sha: string;
  meta: PostMeta;
  body: string; // Markdown
  html: string; // rendered for the editor (absolute image URLs)
  status: PostStatus;
}

export interface SaveResult {
  ok: true;
  slug: string;
  sha: string;
  status: PostStatus;
  publishAt: string | null;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields: Record<string, string> = {},
  ) {
    super(message);
  }
}

let token: string | null = null;
let onUnauthorized: () => void = () => {};

export const setApiToken = (value: string | null) => {
  token = value;
};
export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

async function request<T>(path: string, init: RequestInit & { json?: unknown; timeoutMs?: number } = {}): Promise<T> {
  const { json, timeoutMs = 30_000, ...rest } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(`${SITE_URL}${path}`, {
      ...rest,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: json !== undefined ? JSON.stringify(json) : undefined,
    });
  } catch {
    throw new ApiError(0, controller.signal.aborted ? 'The server took too long to answer. Try again.' : 'You appear to be offline. Check your connection and try again.');
  } finally {
    clearTimeout(timer);
  }
  const data = (await res.json().catch(() => ({}))) as { error?: string; fields?: Record<string, string> };
  if (!res.ok) {
    if (res.status === 401 && !path.startsWith('/api/admin-session')) onUnauthorized();
    throw new ApiError(res.status, data.error ?? 'Something went wrong. Please try again.', data.fields);
  }
  return data as T;
}

export const api = {
  login: (password: string) =>
    request<{ ok: true; token: string; expiresAt: string }>('/api/admin-session', {
      method: 'POST',
      json: { password, client: 'app' },
    }),

  listPosts: () => request<{ posts: PostSummary[] }>('/api/admin-posts'),
  stats: () => request<{ stats: Record<string, { views: number; shares: number }> }>('/api/admin-posts?stats=1'),
  getPost: (slug: string) => request<{ post: FullPost }>(`/api/admin-posts?slug=${encodeURIComponent(slug)}`),

  // From the app editor: HTML, converted to Markdown on the server
  saveHtml: (input: { slug: string; sha?: string; meta: PostMeta; html: string }) =>
    request<SaveResult>('/api/admin-posts', { method: 'POST', json: input }),
  // Metadata-only changes (feature, unpublish): send the Markdown back untouched
  saveMarkdown: (input: { slug: string; sha: string; meta: PostMeta; body: string }) =>
    request<SaveResult>('/api/admin-posts', { method: 'POST', json: input }),

  deletePost: (slug: string, sha: string) =>
    request<{ ok: true }>(`/api/admin-posts?slug=${encodeURIComponent(slug)}&sha=${encodeURIComponent(sha)}`, { method: 'DELETE' }),

  uploadImage: (input: { filename: string; contentType: string; data: string }) =>
    request<{ ok: true; url: string }>('/api/admin-upload', { method: 'POST', json: input, timeoutMs: 90_000 }),
};

// Public, unauthenticated calls for readers. Failures are ignored: they must never get in the way of reading.
export const publicApi = {
  track: (slug: string, event: 'view' | 'share') =>
    fetch(`${SITE_URL}/api/app`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'track', slug, event }),
    }).catch(() => undefined),
  registerPush: (pushToken: string, platform: string) => pushAction({ action: 'register-push', token: pushToken, platform }),
  unregisterPush: (pushToken: string) => pushAction({ action: 'unregister-push', token: pushToken }),
};

async function pushAction(body: Record<string, string>) {
  const r = await fetch(`${SITE_URL}/api/app`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${body.action} ${r.status}`);
}
