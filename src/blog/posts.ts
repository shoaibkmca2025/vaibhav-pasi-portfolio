import { marked } from 'marked';
import { parse as parseYaml } from 'yaml';

// Every .md file in ./posts becomes a blog post. The file name is the URL slug:
// posts/my-first-post.md  ->  /blog/my-first-post
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

type Frontmatter = Record<string, unknown>;

// Simple "key: value" reader, used when a hand-written header isn't valid YAML
// (e.g. an unquoted title containing a colon)
function parseLoose(header: string): Frontmatter {
  const data: Frontmatter = {};
  for (const line of header.split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (key) data[key] = value;
  }
  return data;
}

function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: raw };

  // Posts saved from the /admin editor are proper YAML (quoted strings, tag lists, booleans)
  let data: Frontmatter;
  try {
    const parsed = parseYaml(match[1]);
    data = parsed && typeof parsed === 'object' ? (parsed as Frontmatter) : {};
  } catch {
    data = parseLoose(match[1]);
  }
  return { data, body: raw.slice(match[0].length) };
}

const text = (value: unknown) => (value == null ? '' : String(value).trim());
const flag = (value: unknown) => value === true || value === 'true';

// Accepts "2026-09-18", a Date, or a full ISO timestamp, and returns YYYY-MM-DD
function toDate(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return text(value).slice(0, 10);
}

// Accepts a YAML list (from the editor) or a comma-separated string (hand-written)
function toTags(value: unknown) {
  const list = Array.isArray(value) ? value : text(value).split(',');
  return list.map((t) => text(t)).filter(Boolean);
}

function toPost(path: string, raw: string): Post | null {
  const slug = path.split('/').pop()!.replace(/\.md$/, '');
  const { data, body } = parseFrontmatter(raw);
  if (flag(data.draft)) return null;

  const words = body.trim().split(/\s+/).length;

  return {
    slug,
    title: text(data.title) || slug.replace(/-/g, ' '),
    date: toDate(data.date),
    category: text(data.category) || 'Insights',
    excerpt: text(data.excerpt),
    cover: text(data.cover),
    tags: toTags(data.tags),
    featured: flag(data.featured),
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
