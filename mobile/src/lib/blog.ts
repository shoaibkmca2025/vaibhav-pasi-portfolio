// Mirrors shared/blog.ts in the website repo (kept separate so the app doesn't bundle server
// code). Keep CATEGORIES and slugify in sync with that file.

export const CATEGORIES = [
  'Technology',
  'AI',
  'Digital Marketing',
  'Software Development',
  'Business',
  'Entrepreneurship',
  'Personal Growth',
  'Travel',
] as const;

// Older topics still used by existing articles; offered when editing those
export const LEGACY_CATEGORIES = ['Growth', 'Social Media', 'E-commerce', 'AI & Tech', 'Branding', 'Insights'];

export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface PostMeta {
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  date: string; // YYYY-MM-DD
  publishAt?: string; // ISO timestamp, future = scheduled
  category: string;
  excerpt: string;
  cover: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
}

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

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const htmlToText = (html: string) =>
  html
    .replace(/<(br|\/p|\/h[1-6]|\/li|\/blockquote)[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ');

export const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

// Same formula as the website: 200 words a minute, at least one minute
export const readingMinutes = (words: number) => Math.max(1, Math.round(words / 200));

export function postStatus(meta: Pick<PostMeta, 'draft' | 'publishAt'>, now = Date.now()): PostStatus {
  if (meta.draft) return 'draft';
  if (meta.publishAt && new Date(meta.publishAt).getTime() > now) return 'scheduled';
  return 'published';
}
