// Razorpay (https://razorpay.com) via its REST API, plus signed download links.
// Needs RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET. Without them checkout runs in "test mode"
// (no money moves; the buyer's details are captured as a lead so nothing is lost).
import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from './http';

export const paymentsConfigured = () => Boolean(env('RAZORPAY_KEY_ID') && env('RAZORPAY_KEY_SECRET'));

export async function createOrder(amount: number, receipt: string, notes: Record<string, string>) {
  const auth = Buffer.from(`${env('RAZORPAY_KEY_ID')}:${env('RAZORPAY_KEY_SECRET')}`).toString('base64');
  const r = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency: 'INR', receipt: receipt.slice(0, 40), notes }),
  });
  if (!r.ok) throw new Error(`Razorpay ${r.status}: ${await r.text()}`);
  return (await r.json()) as { id: string; amount: number; currency: string; notes: Record<string, string> };
}

export async function fetchOrder(orderId: string) {
  const auth = Buffer.from(`${env('RAZORPAY_KEY_ID')}:${env('RAZORPAY_KEY_SECRET')}`).toString('base64');
  const r = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!r.ok) throw new Error(`Razorpay ${r.status}`);
  return (await r.json()) as { id: string; amount: number; status: string; notes: Record<string, string> };
}

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

// Razorpay signs `${order_id}|${payment_id}` with the key secret
export function verifySignature(orderId: string, paymentId: string, signature: string) {
  const expected = createHmac('sha256', env('RAZORPAY_KEY_SECRET')).update(`${orderId}|${paymentId}`).digest('hex');
  return safeEqual(expected, signature);
}

/* ─── Signed, expiring download tokens ─── */
const signingSecret = () => env('DOWNLOAD_SIGNING_SECRET') || env('RAZORPAY_KEY_SECRET');

export function signDownload(itemId: string, paymentId: string, ttlHours = 72) {
  const payload = Buffer.from(JSON.stringify({ i: itemId, p: paymentId, e: Date.now() + ttlHours * 3_600_000 })).toString('base64url');
  const sig = createHmac('sha256', signingSecret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function readDownload(token: string) {
  const [payload, sig] = token.split('.');
  if (!payload || !sig || !signingSecret()) return null;
  const expected = createHmac('sha256', signingSecret()).update(payload).digest('base64url');
  if (!safeEqual(expected, sig)) return null;
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { i: string; p: string; e: number };
  return data.e > Date.now() ? data : null;
}
