// Blog post file format, shared by the website (src/blog/posts.ts), the admin dashboard
// (src/admin) and the publishing API (api/admin-posts.ts).
// A post is a Markdown file in src/blog/posts/<slug>.md with a YAML header:
//   ---
//   title: "My post"
//   date: 2026-10-08
//   ...
//   ---
//   Markdown body
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

export const POSTS_DIR = 'src/blog/posts';
export const MEDIA_DIR = 'public/blog';

export const CATEGORIES = ['Growth', 'Social Media', 'E-commerce', 'AI & Tech', 'Branding', 'Insights'];

export interface PostMeta {
  title: string;
  date: string; // YYYY-MM-DD
  category: string;
  excerpt: string;
  cover: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
}

type Raw = Record<string, unknown>;

// Simple "key: value" reader for hand-written headers that aren't valid YAML
// (e.g. an unquoted title containing a colon)
function parseLoose(header: string): Raw {
  const data: Raw = {};
  for (const line of header.split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (key) data[key] = value;
  }
  return data;
}

const text = (value: unknown) => (value == null ? '' : String(value).trim());
const flag = (value: unknown) => value === true || value === 'true';

// Accepts "2026-09-18", a Date, or a full ISO timestamp, and returns YYYY-MM-DD
function toDate(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return text(value).slice(0, 10);
}

// Accepts a YAML list or a comma-separated string
function toTags(value: unknown) {
  const list = Array.isArray(value) ? value : text(value).split(',');
  return list.map((t) => text(t)).filter(Boolean);
}

export function parsePostFile(raw: string): { meta: PostMeta; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  let data: Raw = {};
  if (match) {
    try {
      const parsed = parseYaml(match[1]);
      data = parsed && typeof parsed === 'object' ? (parsed as Raw) : {};
    } catch {
      data = parseLoose(match[1]);
    }
  }
  return {
    meta: {
      title: text(data.title),
      date: toDate(data.date),
      category: text(data.category) || 'Insights',
      excerpt: text(data.excerpt),
      cover: text(data.cover),
      tags: toTags(data.tags),
      featured: flag(data.featured),
      draft: flag(data.draft),
    },
    body: match ? raw.slice(match[0].length) : raw,
  };
}

export function serializePost(meta: PostMeta, body: string) {
  const header: Raw = {
    title: meta.title,
    date: meta.date,
    category: meta.category,
    excerpt: meta.excerpt,
  };
  if (meta.cover) header.cover = meta.cover;
  if (meta.tags.length) header.tags = meta.tags;
  header.featured = meta.featured;
  header.draft = meta.draft;
  return `---\n${stringifyYaml(header, { lineWidth: 0 }).trim()}\n---\n\n${body.trim()}\n`;
}

// "Engineering Virality: Why…" -> "engineering-virality-why"
export function slugify(input: string) {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

export const isValidSlug = (slug: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 80;

// Validation shared by the dashboard (instant feedback) and the API (the real check)
export function validatePost(meta: PostMeta, body: string) {
  const errors: Partial<Record<keyof PostMeta | 'body', string>> = {};
  if (!meta.title.trim()) errors.title = 'Add a title.';
  else if (meta.title.length > 150) errors.title = 'Keep the title under 150 characters.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) errors.date = 'Pick a publish date.';
  if (!meta.category.trim()) errors.category = 'Choose a category.';
  if (meta.excerpt.length > 300) errors.excerpt = 'Keep the excerpt under 300 characters.';
  if (meta.cover && !/^(\/blog\/[\w.-]+|https:\/\/[^\s]+)$/.test(meta.cover)) errors.cover = 'Cover must be an uploaded image or an https:// link.';
  if (meta.tags.length > 12) errors.tags = 'Use at most 12 tags.';
  if (!meta.draft && body.trim().length < 20) errors.body = 'Write the article before publishing.';
  if (body.length > 200_000) errors.body = 'The article is too long.';
  return errors;
}

export const readingMinutes = (body: string) => Math.max(1, Math.round(body.trim().split(/\s+/).filter(Boolean).length / 200));
