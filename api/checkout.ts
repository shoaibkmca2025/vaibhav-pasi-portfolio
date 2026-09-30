// POST /api/checkout { itemId, name, email, whatsapp? } → Razorpay order (or test-mode response)
// The price always comes from shared/catalog.ts, never from the browser.
import { getCatalogItem } from '../shared/catalog';
import { validateLead } from '../shared/leads';
import { buildLead, processLead } from './_lib/integrations';
import { env, guard, rateLimited, readJson, send, type Req, type Res } from './_lib/http';
import { createOrder, paymentsConfigured } from './_lib/payments';

export default async function handler(req: Req, res: Res) {
  if (!guard(req, res)) return;
  if (rateLimited(req, 10)) return send(res, 429, { error: 'Too many requests. Please try again in a minute.' });

  let body: { itemId?: string; name?: string; email?: string; whatsapp?: string; company_url?: string };
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { error: 'Invalid request' });
  }
  if (body.company_url) return send(res, 200, { ok: true, mode: 'test' });

  const item = getCatalogItem(String(body.itemId ?? ''));
  if (!item) return send(res, 404, { error: 'Unknown item' });

  const source = item.kind === 'product' ? 'product_checkout' : 'offer_checkout';
  const { data, errors, ok } = validateLead({ name: body.name, email: body.email, whatsapp: body.whatsapp, source, service: item.name });
  if (!ok) return send(res, 422, { error: 'Please check the highlighted fields.', fields: errors });

  if (!paymentsConfigured()) {
    // Test mode: record intent as a lead so the owner can follow up manually
    const lead = buildLead({ ...data, meta: { item: item.id, amount_inr: item.amount / 100, payment: 'not_configured' } });
    await processLead(lead);
    return send(res, 200, { ok: true, mode: 'test', item: { id: item.id, name: item.name, amount: item.amount } });
  }

  try {
    const order = await createOrder(item.amount, `${item.id}-${Date.now()}`, {
      item: item.id,
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp ?? '',
    });
    return send(res, 200, {
      ok: true,
      mode: 'live',
      keyId: env('RAZORPAY_KEY_ID'),
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      item: { id: item.id, name: item.name, amount: item.amount },
      prefill: { name: data.name, email: data.email, contact: data.whatsapp ?? '' },
    });
  } catch (e) {
    console.error('[checkout] order failed:', (e as Error).message);
    return send(res, 502, { error: 'Checkout is temporarily unavailable. Please try again or contact me directly.' });
  }
}
