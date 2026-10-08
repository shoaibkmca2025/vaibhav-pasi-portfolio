// Browser client for the dashboard API (/api/admin-*). The session lives in an HttpOnly cookie,
// so there is no token to store here.
import type { PostMeta } from '../../shared/blog';

export interface PostSummary extends PostMeta {
  slug: string;
  sha: string;
  words: number;
}

export interface FullPost {
  slug: string;
  sha: string;
  meta: PostMeta;
  body: string;
}

export interface Session {
  authenticated: boolean;
  setup: { password: boolean; github: boolean };
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

// Set by the app so any expired session sends you back to the sign-in screen
let onUnauthorized: () => void = () => {};
export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      credentials: 'same-origin',
      ...init,
      headers: init.body ? { 'Content-Type': 'application/json' } : undefined,
    });
  } catch {
    throw new ApiError(0, 'You appear to be offline. Check your connection and try again.');
  }
  const data = (await res.json().catch(() => ({}))) as { error?: string; fields?: Record<string, string> };
  if (!res.ok) {
    if (res.status === 401 && !url.endsWith('/api/admin-session')) onUnauthorized();
    throw new ApiError(res.status, data.error ?? 'Something went wrong. Please try again.', data.fields);
  }
  return data as T;
}

const json = (body: unknown) => JSON.stringify(body);

export const api = {
  session: () => request<Session>('/api/admin-session'),
  login: (password: string) => request<{ ok: true }>('/api/admin-session', { method: 'POST', body: json({ password }) }),
  logout: () => request<{ ok: true }>('/api/admin-session', { method: 'DELETE' }),

  listPosts: () => request<{ posts: PostSummary[] }>('/api/admin-posts'),
  getPost: (slug: string) => request<{ post: FullPost }>(`/api/admin-posts?slug=${encodeURIComponent(slug)}`),
  savePost: (input: { slug: string; sha?: string; meta: PostMeta; body: string }) =>
    request<{ ok: true; slug: string; sha: string }>('/api/admin-posts', { method: 'POST', body: json(input) }),
  deletePost: (slug: string, sha: string) =>
    request<{ ok: true }>(`/api/admin-posts?slug=${encodeURIComponent(slug)}&sha=${encodeURIComponent(sha)}`, {
      method: 'DELETE',
    }),

  uploadImage: (input: { filename: string; contentType: string; data: string }) =>
    request<{ ok: true; url: string }>('/api/admin-upload', { method: 'POST', body: json(input) }),
};
