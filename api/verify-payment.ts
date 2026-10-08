// POST /api/verify-payment { orderId, paymentId, signature }
// Verifies Razorpay's signature server-side, re-reads the order to know what was bought,
// then returns the next step: a signed download link, the booking link, or onboarding info.
import { getCatalogItem } from '../shared/catalog.js';
import { validateLead } from '../shared/leads.js';
import { buildLead, processLead, recordPayment, sendEmail } from './_lib/integrations.js';
import { env, guard, readJson, send, siteUrl, type Req, type Res } from './_lib/http.js';
import { fetchOrder, paymentsConfigured, signDownload, verifySignature } from './_lib/payments.js';

export default async function handler(req: Req, res: Res) {
  if (!guard(req, res)) return;
  if (!paymentsConfigured()) return send(res, 400, { error: 'Payments are not configured.' });

  let body: { orderId?: string; paymentId?: string; signature?: string };
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { error: 'Invalid request' });
  }
  const orderId = String(body.orderId ?? '');
  const paymentId = String(body.paymentId ?? '');
  const signature = String(body.signature ?? '');
  if (!orderId || !paymentId || !signature || !verifySignature(orderId, paymentId, signature)) {
    return send(res, 400, { error: 'Payment could not be verified.' });
  }

  const order = await fetchOrder(orderId);
  const item = getCatalogItem(order.notes.item);
  if (!item || order.amount !== item.amount) return send(res, 400, { error: 'Order does not match the catalog.' });

  const { data } = validateLead({
    name: order.notes.name,
    email: order.notes.email,
    whatsapp: order.notes.whatsapp,
    source: item.kind === 'product' ? 'product_checkout' : 'offer_checkout',
    service: item.name,
  });
  const lead = buildLead({ ...data, meta: { item: item.id, amount_inr: item.amount / 100, payment_id: paymentId, order_id: orderId, paid: true } });
  lead.stage = item.kind === 'offer' && item.id === 'strategy-call' ? 'CALL_BOOKED' : 'WON';
  await processLead(lead);
  await recordPayment('payment.captured', { item: item.id, amount: item.amount, orderId, paymentId, email: data.email });

  let next: Record<string, string> = {};
  if (item.fulfilment === 'download') {
    const url = `${siteUrl()}/api/download?token=${signDownload(item.id, paymentId)}`;
    next = { type: 'download', url };
    await sendEmail(
      data.email,
      `Your download: ${item.name}`,
      `<div style="font-family:sans-serif;font-size:15px;line-height:1.6"><p>Thanks for buying <b>${item.name}</b>.</p><p><a href="${url}">Download your files</a> (link valid for 72 hours).</p><p>Payment ID: ${paymentId}</p><p>— Vaibhav Pasi</p></div>`,
    ).catch(() => undefined);
  } else if (item.fulfilment === 'booking') {
    next = { type: 'booking', url: env('BOOKING_URL') || '' };
  } else {
    next = { type: 'onboarding' };
  }
  return send(res, 200, { ok: true, item: { id: item.id, name: item.name }, next });
}
