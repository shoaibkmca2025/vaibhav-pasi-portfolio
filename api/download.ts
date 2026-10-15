// GET /api/download?token=… → redirects to the private file for a paid product.
// File locations live only in server env vars (FILE_<PRODUCT>), e.g. a private S3/R2/Drive link.
import { getCatalogItem } from '../shared/catalog.js';
import { env, guard, send, type Req, type Res } from './_lib/http.js';
import { readDownload } from './_lib/payments.js';

export default async function handler(req: Req, res: Res) {
  if (!guard(req, res, 'GET')) return;
  const url = new URL(req.url ?? '', 'http://x');
  const token = url.searchParams.get('token') ?? '';
  const data = token ? readDownload(token) : null;
  if (!data) return send(res, 403, { error: 'This download link is invalid or has expired.' });

  const item = getCatalogItem(data.i);
  const fileUrl = item?.fileEnv ? env(item.fileEnv) : '';
  if (!fileUrl) return send(res, 404, { error: 'File not available yet. Please reply to your receipt email.' });

  res.statusCode = 302;
  res.setHeader('Location', fileUrl);
  res.setHeader('Cache-Control', 'no-store');
  res.end();
}
