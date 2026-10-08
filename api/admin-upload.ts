// POST /api/admin-upload { filename, contentType, data (base64) } -> { url: "/blog/<file>" }
// Saves an image into public/blog via a Git commit. The dashboard shrinks images before
// uploading, so files are normally a few hundred KB. Live on the site after the next deploy.
import { MEDIA_DIR, slugify } from '../shared/blog.js';
import { requireAdmin } from './_lib/admin.js';
import { GitHubError, writeFile } from './_lib/github.js';
import { readJson, send, type Req, type Res } from './_lib/http.js';

const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};
const MAX_BYTES = 3 * 1024 * 1024; // Vercel caps request bodies at 4.5 MB; base64 adds a third

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'Method not allowed' });
  }
  if (!requireAdmin(req, res)) return;

  let input: { filename?: unknown; contentType?: unknown; data?: unknown };
  try {
    input = await readJson(req, 4.5 * 1024 * 1024);
  } catch {
    return send(res, 413, { error: 'That image is too large. Use one under 3 MB.' });
  }

  const ext = TYPES[String(input.contentType)];
  if (!ext) return send(res, 415, { error: 'Upload a JPG, PNG, WebP, GIF or AVIF image.' });
  if (typeof input.data !== 'string' || !input.data) return send(res, 400, { error: 'No image received.' });

  const bytes = Buffer.from(input.data, 'base64');
  if (bytes.length > MAX_BYTES) return send(res, 413, { error: 'That image is too large. Use one under 3 MB.' });

  const base = slugify(String(input.filename ?? '').replace(/\.[a-z0-9]+$/i, '')) || 'image';
  const name = `${base.slice(0, 50)}-${Date.now().toString(36)}.${ext}`;

  try {
    await writeFile(`${MEDIA_DIR}/${name}`, bytes.toString('base64'), `blog: upload image ${name}`);
    return send(res, 200, { ok: true, url: `/blog/${name}` });
  } catch (e) {
    if (e instanceof GitHubError) return send(res, e.status >= 500 ? e.status : 502, { error: e.message });
    console.error(e);
    return send(res, 500, { error: 'Upload failed. Please try again.' });
  }
}
