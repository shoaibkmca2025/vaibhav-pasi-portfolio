// Lead model shared by the website forms (src/) and the serverless API (api/).
// Keep this file dependency-free so it runs in the browser, in Vite dev and on Vercel.

export const LEAD_STAGES = [
  'NEW',
  'QUALIFIED',
  'CONTACTED',
  'CALL_BOOKED',
  'PROPOSAL_SENT',
  'NEGOTIATION',
  'WON',
  'LOST',
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];

// Where a lead came from. Used for attribution in the CRM and in analytics
export const LEAD_SOURCES = [
  'hire_me',
  'contact',
  'consulting',
  'growth_score',
  'service_page',
  'tool',
  'product_checkout',
  'offer_checkout',
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const BUDGETS = [
  'Under ₹15,000',
  '₹15,000 – ₹50,000',
  '₹50,000 – ₹1,50,000',
  '₹1,50,000+',
  'Monthly retainer (₹20,000 – ₹50,000)',
  'Not sure yet',
] as const;

export const TIMELINES = ['As soon as possible', 'Within 2 weeks', 'Within a month', '1–3 months', 'Just exploring'] as const;

export interface LeadInput {
  name: string;
  email: string;
  whatsapp?: string;
  company?: string;
  website?: string;
  industry?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  source: LeadSource;
  // Free-form context, e.g. the growth score result or the product being bought
  meta?: Record<string, string | number | boolean>;
  // Honeypot: real visitors never fill this hidden field
  company_url?: string;
}

export interface Lead extends Omit<LeadInput, 'company_url'> {
  id: string;
  stage: LeadStage;
  createdAt: string;
  notes: string;
  page?: string;
  utm?: Record<string, string>;
}

const LIMITS: Record<string, number> = {
  name: 80,
  email: 120,
  whatsapp: 20,
  company: 120,
  website: 200,
  industry: 80,
  service: 80,
  budget: 60,
  timeline: 60,
  message: 3000,
};

// Strip control characters and angle brackets, collapse whitespace, cap length
export function clean(value: unknown, max = 200): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, max);
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
// Accepts +91 98765 43210, 9876543210, +1-555-123-4567, etc.
export const isPhone = (v: string) => /^\+?[\d\s-]{8,18}$/.test(v) && v.replace(/\D/g, '').length >= 8;
export const isUrlish = (v: string) => /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#].*)?$/i.test(v);

export type FieldErrors = Partial<Record<keyof LeadInput, string>>;

// Same rules run in the browser (instant feedback) and on the server (the real gate)
export function validateLead(raw: Partial<LeadInput>, required: (keyof LeadInput)[] = ['name', 'email']) {
  const data: LeadInput = {
    name: clean(raw.name, LIMITS.name),
    email: clean(raw.email, LIMITS.email).toLowerCase(),
    whatsapp: clean(raw.whatsapp, LIMITS.whatsapp),
    company: clean(raw.company, LIMITS.company),
    website: clean(raw.website, LIMITS.website),
    industry: clean(raw.industry, LIMITS.industry),
    service: clean(raw.service, LIMITS.service),
    budget: clean(raw.budget, LIMITS.budget),
    timeline: clean(raw.timeline, LIMITS.timeline),
    message: clean(raw.message, LIMITS.message),
    source: (LEAD_SOURCES as readonly string[]).includes(raw.source as string) ? (raw.source as LeadSource) : 'contact',
    meta: {},
  };

  if (raw.meta && typeof raw.meta === 'object') {
    for (const [k, v] of Object.entries(raw.meta).slice(0, 30)) {
      const key = clean(k, 40);
      if (!key) continue;
      data.meta![key] = typeof v === 'number' || typeof v === 'boolean' ? v : clean(String(v), 300);
    }
  }

  const errors: FieldErrors = {};
  for (const field of required) {
    if (!data[field]) errors[field] = 'Required';
  }
  if (data.email && !isEmail(data.email)) errors.email = 'Enter a valid email address';
  if (data.whatsapp && !isPhone(data.whatsapp)) errors.whatsapp = 'Enter a valid phone number with country code';
  if (data.website && !isUrlish(data.website)) errors.website = 'Enter a valid website address';

  return { data, errors, ok: Object.keys(errors).length === 0 };
}
