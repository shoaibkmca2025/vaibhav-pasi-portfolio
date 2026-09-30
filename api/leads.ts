// POST /api/leads: every form on the site (hire me, contact, consulting, growth score, tools) posts here
import { validateLead, type LeadInput } from '../shared/leads';
import { buildLead, processLead } from './_lib/integrations';
import { guard, rateLimited, readJson, send, type Req, type Res } from './_lib/http';

export default async function handler(req: Req, res: Res) {
  if (!guard(req, res)) return;
  if (rateLimited(req)) return send(res, 429, { error: 'Too many requests. Please try again in a minute.' });

  let body: Partial<LeadInput> & { page?: string; utm?: Record<string, string> };
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { error: 'Invalid request' });
  }

  // Bots fill every field, including this invisible one: pretend success, store nothing
  if (body.company_url) return send(res, 200, { ok: true });

  const { data, errors, ok } = validateLead(body);
  if (!ok) return send(res, 422, { error: 'Please check the highlighted fields.', fields: errors });

  const utm: Record<string, string> = {};
  for (const [k, v] of Object.entries(body.utm ?? {}).slice(0, 6)) {
    if (/^utm_[a-z]+$/.test(k) && typeof v === 'string') utm[k] = v.slice(0, 100);
  }
  const page = typeof body.page === 'string' ? body.page.slice(0, 200) : undefined;

  const lead = buildLead(data, { page, utm });
  const integrations = await processLead(lead);
  return send(res, 200, { ok: true, id: lead.id, integrations });
}
