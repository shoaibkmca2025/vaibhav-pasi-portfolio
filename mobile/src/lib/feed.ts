// Reader data: the static JSON feed the website builds alongside its pages (src/feed.ts in
// the site repo). The last good copy is kept on the device, so reading works offline.
import { useQuery } from '@tanstack/react-query';
import { SITE_URL } from './config';
import { KEYS, readJson, writeJson } from './storage';

export interface ArticleSummary {
  slug: string;
  url: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  cover: string;
  tags: string[];
  featured: boolean;
  readingMinutes: number;
  wordCount: number;
}

export interface FeedArticle extends ArticleSummary {
  searchText: string;
}

export interface Article extends ArticleSummary {
  html: string;
}

class FeedError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function getJson<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${SITE_URL}${path}`, { headers: { Accept: 'application/json' } });
  } catch {
    throw new FeedError(0, 'You appear to be offline.');
  }
  if (!res.ok) throw new FeedError(res.status, res.status === 404 ? 'This article is not available.' : 'Could not load articles.');
  return (await res.json()) as T;
}

async function fetchFeed(): Promise<FeedArticle[]> {
  try {
    const data = await getJson<{ posts: FeedArticle[] }>('/feed/posts.json');
    writeJson(KEYS.feedCache, data.posts);
    return data.posts;
  } catch (e) {
    const cached = await readJson<FeedArticle[] | null>(KEYS.feedCache, null);
    if (cached) return cached;
    throw e;
  }
}

const articleCacheKey = (slug: string) => `vp:article:${slug}`;

async function fetchArticle(slug: string): Promise<Article> {
  try {
    const article = await getJson<Article>(`/feed/posts/${encodeURIComponent(slug)}.json`);
    writeJson(articleCacheKey(slug), article);
    return article;
  } catch (e) {
    const cached = await readJson<Article | null>(articleCacheKey(slug), null);
    if (cached && !(e instanceof FeedError && e.status === 404)) return cached;
    throw e;
  }
}

export const useFeed = () => useQuery({ queryKey: ['feed'], queryFn: fetchFeed, staleTime: 60_000 });

export const useArticle = (slug: string) =>
  useQuery({
    queryKey: ['article', slug],
    queryFn: () => fetchArticle(slug),
    enabled: Boolean(slug),
    staleTime: 60_000,
    // A just-published article can take a minute to deploy: keep trying briefly
    retry: (count, error) => count < 3 && error instanceof FeedError && error.status === 404,
    retryDelay: 20_000,
  });

export function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function searchArticles(articles: FeedArticle[], query: string, category?: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return articles
    .filter((a) => !category || a.category === category)
    .map((a) => {
      if (!terms.length) return { a, score: 1 };
      const title = a.title.toLowerCase();
      const meta = `${a.excerpt} ${a.category} ${a.tags.join(' ')}`.toLowerCase();
      const body = a.searchText.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (title.includes(t)) score += 5;
        else if (meta.includes(t)) score += 3;
        else if (body.includes(t)) score += 1;
        else return { a, score: 0 }; // every word must match somewhere
      }
      return { a, score };
    })
    .filter((r) => r.score > 0)
    .sort((x, y) => y.score - x.score || y.a.date.localeCompare(x.a.date))
    .map((r) => r.a);
}
