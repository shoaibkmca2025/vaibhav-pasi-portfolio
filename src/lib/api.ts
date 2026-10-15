// Tiny fetch wrapper for the site's own /api endpoints
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fields?: Record<string, string>,
  ) {
    super(message);
  }
}

export async function postJson<T>(url: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  } catch {
    throw new ApiError('Network error. Check your connection and try again.', 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || 'Something went wrong. Please try again.', res.status, data.fields);
  return data as T;
}

// UTM parameters from the landing URL, kept for the session so every lead is attributed
export function getUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = sessionStorage.getItem('vp-utm');
    if (stored) return JSON.parse(stored);
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    params.forEach((v, k) => {
      if (k.startsWith('utm_')) utm[k] = v.slice(0, 100);
    });
    sessionStorage.setItem('vp-utm', JSON.stringify(utm));
    return utm;
  } catch {
    return {};
  }
}

export const queryParam = (name: string) =>
  typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get(name) ?? '';
