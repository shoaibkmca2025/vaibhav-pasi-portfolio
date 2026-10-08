// Integration layer. Every integration is optional and switches on when its env vars are set:
//
//   FORM → /api/leads → Supabase (lead database) → n8n webhook (CRM / Sheets / WhatsApp) → email to owner
//
// With nothing configured (local development) leads are logged to the server console instead,
// so the whole funnel can be tested end to end without any accounts.
import { randomUUID } from 'node:crypto';
import type { Lead, LeadInput } from '../../shared/leads';
import { env } from './http';

export function buildLead(input: LeadInput, context: { page?: string; utm?: Record<string, string> } = {}): Lead {
  const { company_url: _honeypot, ...rest } = input;
  return {
    ...rest,
    id: randomUUID(),
    stage: 'NEW',
    createdAt: new Date().toISOString(),
    notes: '',
    page: context.page,
    utm: context.utm,
  };
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Supabase table schema: see docs/LEADS.md
async function saveToSupabase(lead: Lead) {
  const url = env('SUPABASE_URL');
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return 'skipped';
  const r = await fetch(`${url}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      whatsapp: lead.whatsapp || null,
      company: lead.company || null,
      website: lead.website || null,
      industry: lead.industry || null,
      service: lead.service || null,
      budget: lead.budget || null,
      timeline: lead.timeline || null,
      message: lead.message || null,
      source: lead.source,
      stage: lead.stage,
      notes: lead.notes,
      meta: lead.meta ?? {},
      page: lead.page || null,
      utm: lead.utm ?? {},
      created_at: lead.createdAt,
    }),
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  return 'saved';
}

// n8n / Make / Zapier / Google Apps Script: receives the full lead as JSON
async function sendToWebhook(event: string, payload: object) {
  const url = env('LEAD_WEBHOOK_URL');
  if (!url) return 'skipped';
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const secret = env('LEAD_WEBHOOK_SECRET');
  if (secret) headers['X-Webhook-Secret'] = secret;
  const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ event, ...payload }) });
  if (!r.ok) throw new Error(`Webhook ${r.status}`);
  return 'sent';
}

// Resend (https://resend.com): plain REST, no SDK needed
export async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  const key = env('RESEND_API_KEY');
  const from = env('EMAIL_FROM');
  if (!key || !from || !to) return 'skipped';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
  return 'sent';
}

function ownerEmailHtml(lead: Lead) {
  const rows = (
    [
      ['Source', lead.source],
      ['Name', lead.name],
      ['Email', lead.email],
      ['WhatsApp', lead.whatsapp],
      ['Company', lead.company],
      ['Website', lead.website],
      ['Industry', lead.industry],
      ['Service', lead.service],
      ['Budget', lead.budget],
      ['Timeline', lead.timeline],
      ['Message', lead.message],
      ...Object.entries(lead.meta ?? {}).map(([k, v]) => [k, String(v)]),
    ] as [string, string | undefined][]
  )
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${escapeHtml(k)}</td><td>${escapeHtml(v!)}</td></tr>`)
    .join('');
  return `<h2 style="font-family:sans-serif">New lead: ${escapeHtml(lead.name)}</h2><table style="font-family:sans-serif;font-size:14px">${rows}</table><p style="font-family:sans-serif;color:#666">Lead ID ${lead.id} · ${lead.createdAt}</p>`;
}

function confirmationHtml(lead: Lead) {
  return `<div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#111">
<p>Hi ${escapeHtml(lead.name.split(' ')[0])},</p>
<p>Thanks for reaching out. I've received your details and will reply to you personally.</p>
<p>If it's urgent, reply to this email or message me on WhatsApp.</p>
<p>— Vaibhav Pasi<br/>vaibhavpasi.online</p></div>`;
}

// Runs every step; one failing integration never loses the lead or blocks the others
export async function processLead(lead: Lead) {
  const results: Record<string, string> = {};
  const step = async (name: string, fn: () => Promise<string>) => {
    try {
      results[name] = await fn();
    } catch (e) {
      results[name] = 'error';
      console.error(`[lead ${lead.id}] ${name} failed:`, (e as Error).message);
    }
  };

  await step('database', () => saveToSupabase(lead));
  await step('webhook', () => sendToWebhook('lead.created', { lead }));
  await step('owner_email', () =>
    sendEmail(env('LEAD_NOTIFY_EMAIL'), `New ${lead.source.replace('_', ' ')} lead: ${lead.name}`, ownerEmailHtml(lead), lead.email),
  );
  await step('confirmation_email', () => sendEmail(lead.email, 'Thanks, I have your message', confirmationHtml(lead)));

  if (Object.values(results).every((r) => r === 'skipped')) {
    // Development / not-yet-configured mode: keep the lead visible in the server logs
    console.info('[lead] integrations not configured, lead captured locally:', JSON.stringify(lead));
    results.mode = 'development';
  }
  return results;
}

export async function recordPayment(event: string, payload: object) {
  try {
    await sendToWebhook(event, payload);
  } catch (e) {
    console.error(`[payment] webhook failed:`, (e as Error).message);
  }
}
