// /api/admin-posts: articles for the dashboard (all routes require sign-in)
//   GET                   -> { posts: [...] } every post, drafts included, newest first
//   GET    ?slug=x        -> { post } one post with its Markdown body
//   POST   { slug?, sha?, meta, body } -> create (no sha) or update (with sha); commits to GitHub
//   DELETE ?slug=x&sha=y  -> deletes the post
// Every save is a Git commit, so Vercel redeploys and the change is live in about a minute.
import {
  POSTS_DIR,
  isValidSlug,
  parsePostFile,
  serializePost,
  slugify,
  validatePost,
  type PostMeta,
} from '../shared/blog';
import { requireAdmin } from './_lib/admin';
import { GitHubError, deleteFile, listDir, readFile, writeFile } from './_lib/github';
import { readJson, send, type Req, type Res } from './_lib/http';

const postPath = (slug: string) => `${POSTS_DIR}/${slug}.md`;

function query(req: Req, key: string) {
  const url = new URL(req.url ?? '', 'http://localhost');
  return url.searchParams.get(key) ?? '';
}

// Normalises whatever the browser sent into a clean PostMeta
function cleanMeta(input: Partial<Record<keyof PostMeta, unknown>> = {}): PostMeta {
  const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  return {
    title: str(input.title, 150),
    date: str(input.date, 10),
    category: str(input.category, 40),
    excerpt: str(input.excerpt, 300),
    cover: str(input.cover, 500),
    tags: Array.isArray(input.tags)
      ? input.tags.map((t) => str(t, 40)).filter(Boolean).slice(0, 12)
      : [],
    featured: input.featured === true,
    draft: input.draft === true,
  };
}

async function listPosts() {
  const files = (await listDir(POSTS_DIR)).filter((f) => f.type === 'file' && f.name.endsWith('.md'));
  const posts = await Promise.all(
    files.map(async (f) => {
      const file = await readFile(f.path);
      if (!file) return null;
      const { meta, body } = parsePostFile(file.text);
      return {
        slug: f.name.replace(/\.md$/, ''),
        sha: file.sha,
        ...meta,
        words: body.trim().split(/\s+/).filter(Boolean).length,
      };
    }),
  );
  return posts.filter(Boolean).sort((a, b) => (b!.date || '').localeCompare(a!.date || ''));
}

export default async function handler(req: Req, res: Res) {
  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === 'GET') {
      const slug = query(req, 'slug');
      if (!slug) return send(res, 200, { posts: await listPosts() });
      if (!isValidSlug(slug)) return send(res, 400, { error: 'Invalid post address.' });
      const file = await readFile(postPath(slug));
      if (!file) return send(res, 404, { error: 'That post no longer exists.' });
      const { meta, body } = parsePostFile(file.text);
      return send(res, 200, { post: { slug, sha: file.sha, meta, body } });
    }

    if (req.method === 'POST') {
      let input: { slug?: unknown; sha?: unknown; meta?: Partial<Record<keyof PostMeta, unknown>>; body?: unknown };
      try {
        input = await readJson(req, 1024 * 1024);
      } catch {
        return send(res, 400, { error: 'Invalid request' });
      }

      const meta = cleanMeta(input.meta);
      const body = typeof input.body === 'string' ? input.body : '';
      const errors = validatePost(meta, body);
      if (Object.keys(errors).length) return send(res, 422, { error: 'Please fix the highlighted fields.', fields: errors });

      const sha = typeof input.sha === 'string' && input.sha ? input.sha : undefined;
      const slug = sha ? String(input.slug ?? '') : slugify(String(input.slug || meta.title));
      if (!isValidSlug(slug)) return send(res, 422, { error: 'Choose a valid web address for the post.', fields: { slug: 'Use lowercase letters, numbers and dashes.' } });

      // New posts must not overwrite an existing one with the same address
      if (!sha && (await readFile(postPath(slug)))) {
        return send(res, 409, { error: `A post at /blog/${slug} already exists. Change the web address.`, fields: { slug: 'Already taken.' } });
      }

      const action = !sha ? (meta.draft ? 'draft' : 'publish') : meta.draft ? 'update draft' : 'update';
      const saved = await writeFile(
        postPath(slug),
        Buffer.from(serializePost(meta, body), 'utf8').toString('base64'),
        `blog: ${action} "${meta.title}"`,
        sha,
      );
      return send(res, 200, { ok: true, slug, sha: saved.sha, commit: saved.commit });
    }

    if (req.method === 'DELETE') {
      const slug = query(req, 'slug');
      const sha = query(req, 'sha');
      if (!isValidSlug(slug) || !sha) return send(res, 400, { error: 'Invalid request' });
      await deleteFile(postPath(slug), sha, `blog: delete "${slug}"`);
      return send(res, 200, { ok: true });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return send(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    if (e instanceof GitHubError) {
      if (e.status === 409) return send(res, 409, { error: 'This post was changed somewhere else. Reload it, then make your edits again.' });
      return send(res, e.status >= 500 ? e.status : 502, { error: e.message });
    }
    console.error(e);
    return send(res, 500, { error: 'Something went wrong. Please try again.' });
  }
}
