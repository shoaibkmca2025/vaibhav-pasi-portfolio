// /api/admin-gallery: the dashboard's Gallery tab (requires sign-in)
//   GET  -> { uploads, sha, instagram: { configured, ok, error?, items } }
//   POST { uploads, sha } -> saves src/content/gallery.json (a Git commit; live in about a minute)
import {
  GALLERY_FILE,
  MAX_UPLOADS,
  validateUpload,
  type GalleryUpload,
} from '../shared/gallery.js';
import { requireAdmin } from './_lib/admin.js';
import { GitHubError, readFile, writeFile } from './_lib/github.js';
import { readJson, send, type Req, type Res } from './_lib/http.js';
import { getInstagramPosts } from './_lib/instagram.js';

function clean(input: unknown): GalleryUpload | null {
  if (!input || typeof input !== 'object') return null;
  const i = input as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  return {
    id: str(i.id, 40) || Math.random().toString(36).slice(2, 10),
    image: str(i.image, 200),
    caption: str(i.caption, 300),
    link: str(i.link, 300),
    pinned: i.pinned === true,
    date: str(i.date, 10),
  };
}

export default async function handler(req: Req, res: Res) {
  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === 'GET') {
      const [file, instagram] = await Promise.all([readFile(GALLERY_FILE), getInstagramPosts(12)]);
      let uploads: GalleryUpload[] = [];
      try {
        uploads = file ? JSON.parse(file.text) : [];
      } catch {
        uploads = [];
      }
      return send(res, 200, {
        uploads,
        sha: file?.sha ?? null,
        instagram: { ...instagram.status, items: instagram.items },
      });
    }

    if (req.method === 'POST') {
      let body: { uploads?: unknown; sha?: unknown };
      try {
        body = await readJson(req, 256 * 1024);
      } catch {
        return send(res, 400, { error: 'Invalid request' });
      }
      if (!Array.isArray(body.uploads)) return send(res, 400, { error: 'Invalid request' });
      if (body.uploads.length > MAX_UPLOADS) return send(res, 422, { error: `The gallery holds up to ${MAX_UPLOADS} photos.` });

      const uploads = body.uploads.map(clean).filter((u): u is GalleryUpload => u !== null);
      const errors = [...new Set(uploads.flatMap(validateUpload))];
      if (errors.length) return send(res, 422, { error: errors.join(' ') });

      const sha = typeof body.sha === 'string' && body.sha ? body.sha : undefined;
      const saved = await writeFile(
        GALLERY_FILE,
        Buffer.from(`${JSON.stringify(uploads, null, 2)}\n`, 'utf8').toString('base64'),
        `gallery: update (${uploads.length} photo${uploads.length === 1 ? '' : 's'})`,
        sha,
      );
      return send(res, 200, { ok: true, sha: saved.sha });
    }

    res.setHeader('Allow', 'GET, POST');
    return send(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    if (e instanceof GitHubError) {
      if (e.status === 409) return send(res, 409, { error: 'The gallery was changed somewhere else. Reload, then make your changes again.' });
      return send(res, e.status >= 500 ? e.status : 502, { error: e.message });
    }
    console.error(e);
    return send(res, 500, { error: 'Something went wrong. Please try again.' });
  }
}
