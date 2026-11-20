// Static JSON feed for the mobile app, written by scripts/prerender.mjs at build time:
//   /feed/posts.json         every published article, without the body (lists, search)
//   /feed/posts/<slug>.json  one article with its rendered HTML
// It is built from the same posts as the website, so the app always matches the live site.
import { absolutizeHtml } from '../shared/markdown';
import { posts, type Post } from './blog/posts';
import { SITE_URL, absoluteUrl } from './site';

export const FEED_VERSION = 1;

const coverUrl = (cover: string) => (cover && cover.startsWith('/') ? absoluteUrl(cover) : cover);

// Plain text for in-app keyword search (capped so the index stays small)
const plainText = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 4000);

function summary(p: Post) {
  return {
    slug: p.slug,
    url: absoluteUrl(`/blog/${p.slug}`),
    title: p.title,
    date: p.date,
    category: p.category,
    excerpt: p.excerpt,
    cover: coverUrl(p.cover),
    tags: p.tags,
    featured: p.featured,
    readingMinutes: p.readingMinutes,
    wordCount: p.wordCount,
  };
}

export function feedFiles(): Record<string, string> {
  const files: Record<string, string> = {
    'feed/posts.json': JSON.stringify({
      version: FEED_VERSION,
      generatedAt: new Date().toISOString(),
      posts: posts.map((p) => ({ ...summary(p), searchText: plainText(p.html) })),
    }),
  };
  for (const p of posts) {
    files[`feed/posts/${p.slug}.json`] = JSON.stringify({ ...summary(p), html: absolutizeHtml(p.html, SITE_URL) });
  }
  return files;
}
