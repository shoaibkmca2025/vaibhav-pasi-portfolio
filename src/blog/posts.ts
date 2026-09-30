import { marked } from 'marked';

// Every .md file in ./posts becomes a blog post. The file name is the URL slug:
// posts/my-first-post.md  ->  #/blog/my-first-post
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
  html: string;
}

type Frontmatter = Record<string, string>;

function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: raw };

  const data: Frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (key) data[key] = value;
  }
  return { data, body: raw.slice(match[0].length) };
}

function toPost(path: string, raw: string): Post | null {
  const slug = path.split('/').pop()!.replace(/\.md$/, '');
  const { data, body } = parseFrontmatter(raw);
  if (data.draft === 'true') return null;

  const words = body.trim().split(/\s+/).length;

  return {
    slug,
    title: data.title || slug.replace(/-/g, ' '),
    date: data.date || '',
    category: data.category || 'Insights',
    excerpt: data.excerpt || '',
    cover: data.cover || '',
    tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    featured: data.featured === 'true',
    readingMinutes: Math.max(1, Math.round(words / 200)),
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
