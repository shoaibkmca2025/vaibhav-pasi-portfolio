// POST /api/growth-score { url }: fetches the visitor's public homepage and runs basic, factual checks
// (HTTPS, title, meta description, mobile viewport, headings, social tags, structured data, contact paths).
// The browser combines these with the visitor's own answers into an indicative score.
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { clean } from '../shared/leads.js';
import type { SiteCheck } from '../shared/growth.js';
import { guard, rateLimited, readJson, send, type Req, type Res } from './_lib/http.js';


// Block requests to private / local networks (SSRF protection)
function isPrivateIp(ip: string) {
  if (ip.includes(':')) {
    const v6 = ip.toLowerCase();
    return v6 === '::1' || v6.startsWith('fc') || v6.startsWith('fd') || v6.startsWith('fe80') || v6.startsWith('::ffff:127.') || v6 === '::';
  }
  const [a, b] = ip.split('.').map(Number);
  return (
    a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224
  );
}

async function safeUrl(input: string) {
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
  } catch {
    return null;
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
  if (url.port && !['80', '443'].includes(url.port)) return null;
  const host = url.hostname;
  if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal')) return null;
  const ips = isIP(host) ? [host] : (await lookup(host, { all: true })).map((r) => r.address);
  if (!ips.length || ips.some(isPrivateIp)) return null;
  return url;
}

const count = (html: string, re: RegExp) => (html.match(re) || []).length;
const attr = (html: string, re: RegExp) => (html.match(re)?.[1] ?? '').trim();

export function analyse(html: string, finalUrl: URL, ms: number, bytes: number): SiteCheck[] {
  const title = attr(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description =
    attr(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
    attr(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const imgs = count(html, /<img\b/gi);
  const imgsWithAlt = count(html, /<img\b[^>]*\balt=["'][^"']+["']/gi);
  const h1 = count(html, /<h1\b/gi);
  const kb = Math.round(bytes / 1024);

  return [
    { id: 'https', area: 'trust', label: 'Secure connection (HTTPS)', pass: finalUrl.protocol === 'https:', detail: finalUrl.protocol === 'https:' ? 'Served over HTTPS.' : 'Not served over HTTPS; browsers warn visitors.' },
    { id: 'speed', area: 'website', label: 'Server response', pass: ms < 1500, detail: `Homepage HTML returned in ${(ms / 1000).toFixed(1)}s${ms < 1500 ? '.' : ', which is slow; aim for under 1.5s.'}` },
    { id: 'weight', area: 'website', label: 'Page size', pass: kb < 600, detail: `Homepage HTML is ${kb} KB${kb < 600 ? '.' : '; heavy pages load slowly on mobile data.'}` },
    { id: 'viewport', area: 'ux', label: 'Mobile-friendly viewport', pass: /<meta[^>]+name=["']viewport["']/i.test(html), detail: /<meta[^>]+name=["']viewport["']/i.test(html) ? 'Viewport tag present.' : 'No viewport tag; the page may not fit phones.' },
    { id: 'title', area: 'seo', label: 'Page title', pass: title.length >= 15 && title.length <= 65, detail: title ? `“${title.slice(0, 80)}” (${title.length} characters; 15–65 is ideal).` : 'No <title> tag found.' },
    { id: 'description', area: 'seo', label: 'Meta description', pass: description.length >= 70 && description.length <= 170, detail: description ? `${description.length} characters (70–170 is ideal).` : 'No meta description; Google will pick random text.' },
    { id: 'h1', area: 'seo', label: 'Main heading (H1)', pass: h1 === 1, detail: h1 === 1 ? 'Exactly one H1.' : `${h1} H1 headings found; use exactly one.` },
    { id: 'alt', area: 'content', label: 'Image alt text', pass: imgs === 0 || imgsWithAlt / imgs >= 0.8, detail: imgs ? `${imgsWithAlt} of ${imgs} images have alt text.` : 'No images in the initial HTML.' },
    { id: 'og', area: 'social', label: 'Social share preview', pass: /property=["']og:image["']/i.test(html) && /property=["']og:title["']/i.test(html), detail: /property=["']og:image["']/i.test(html) ? 'Open Graph title and image set.' : 'Missing Open Graph tags; links shared on WhatsApp/LinkedIn show no preview.' },
    { id: 'schema', area: 'seo', label: 'Structured data', pass: /application\/ld\+json/i.test(html), detail: /application\/ld\+json/i.test(html) ? 'JSON-LD structured data found.' : 'No structured data; harder for Google to understand the business.' },
    { id: 'canonical', area: 'seo', label: 'Canonical URL', pass: /rel=["']canonical["']/i.test(html), detail: /rel=["']canonical["']/i.test(html) ? 'Canonical tag present.' : 'No canonical tag.' },
    { id: 'contact', area: 'conversion', label: 'Direct contact path', pass: /(wa\.me|api\.whatsapp\.com|tel:|mailto:)/i.test(html), detail: /(wa\.me|api\.whatsapp\.com|tel:|mailto:)/i.test(html) ? 'WhatsApp, phone or email link found.' : 'No WhatsApp, phone or email link on the homepage.' },
    { id: 'form', area: 'conversion', label: 'Enquiry form', pass: /<form\b/i.test(html), detail: /<form\b/i.test(html) ? 'A form is present on the homepage.' : 'No form in the homepage HTML.' },
    { id: 'favicon', area: 'branding', label: 'Site icon', pass: /rel=["'][^"']*icon[^"']*["']/i.test(html), detail: /rel=["'][^"']*icon[^"']*["']/i.test(html) ? 'Favicon declared.' : 'No favicon; the site looks unfinished in tabs and search.' },
    { id: 'social_links', area: 'social', label: 'Links to social profiles', pass: /(instagram\.com|linkedin\.com|facebook\.com|youtube\.com|x\.com|twitter\.com)/i.test(html), detail: /(instagram\.com|linkedin\.com|facebook\.com|youtube\.com|x\.com|twitter\.com)/i.test(html) ? 'Social profiles linked.' : 'No social profile links found.' },
    { id: 'lang', area: 'ux', label: 'Language declared', pass: /<html[^>]+lang=/i.test(html), detail: /<html[^>]+lang=/i.test(html) ? 'Page language declared.' : 'No lang attribute on <html>.' },
  ];
}

export default async function handler(req: Req, res: Res) {
  if (!guard(req, res)) return;
  if (rateLimited(req, 6)) return send(res, 429, { error: 'Too many checks. Please try again in a minute.' });

  let body: { url?: string };
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { error: 'Invalid request' });
  }
  const input = clean(body.url, 200);
  if (!input) return send(res, 422, { error: 'Enter a website address.' });

  let url: URL | null = null;
  try {
    url = await safeUrl(input);
  } catch {
    url = null;
  }
  if (!url) return send(res, 422, { error: "That address can't be checked. Use a public website like example.com." });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  const started = Date.now();
  try {
    const r = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'VaibhavPasi-GrowthScore/1.0 (+https://vaibhavpasi.online/growth-score)', Accept: 'text/html' },
    });
    const ms = Date.now() - started;
    const finalUrl = new URL(r.url || url.href);
    // A redirect must not land us on a private network either
    if (!(await safeUrl(finalUrl.href))) return send(res, 422, { error: "That address can't be checked." });
    const buf = Buffer.from(await r.arrayBuffer());
    const html = buf.subarray(0, 1_500_000).toString('utf8');
    if (!r.ok) return send(res, 200, { ok: false, reachable: false, status: r.status, checks: [] });
    return send(res, 200, { ok: true, reachable: true, finalUrl: finalUrl.href, checks: analyse(html, finalUrl, ms, buf.length) });
  } catch {
    return send(res, 200, { ok: false, reachable: false, checks: [] });
  } finally {
    clearTimeout(timer);
  }
}
