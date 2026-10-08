import { marked } from 'marked';
import { parsePostFile } from '../../shared/blog';

// Every .md file in ./posts becomes a blog post. The file name is the URL slug:
// posts/my-first-post.md  ->  /blog/my-first-post
// Posts are usually written in the dashboard at /admin, which commits them here.
const files = import.meta.glob('./posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  cover: string;
  tags: string[];
  featured: boolean;
  readingMinutes: number;
  wordCount: number;
  html: string;
}

function toPost(path: string, raw: string): Post | null {
  const slug = path.split('/').pop()!.replace(/\.md$/, '');
  const { meta, body } = parsePostFile(raw);
  if (meta.draft) return null;

  const words = body.trim().split(/\s+/).length;

  return {
    slug,
    title: meta.title || slug.replace(/-/g, ' '),
    date: meta.date,
    category: meta.category,
    excerpt: meta.excerpt,
    cover: meta.cover,
    tags: meta.tags,
    featured: meta.featured,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    wordCount: words,
    html: marked.parse(body, { async: false }),
  };
}

export const posts: Post[] = Object.entries(files)
  .map(([path, raw]) => toPost(path, raw))
  .filter((p): p is Post => p !== null)
  .sort((a, b) => b.date.localeCompare(a.date));

export const categories = Array.from(new Set(posts.map((p) => p.category)));

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(date: string) {
  if (!date) return '';
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
