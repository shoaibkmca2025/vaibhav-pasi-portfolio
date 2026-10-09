import { useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { BUDGETS, type LeadSource } from '../../shared/leads';
import { contactEmail, contactHref } from '../contact';
import { hasWhatsApp, whatsappHref } from '../lib/whatsapp';

// Enquiry form that posts to /api/leads (the same pipeline as the rest of the site:
// database, email and webhook, depending on what's configured in Vercel).
type Status = 'idle' | 'sending' | 'sent' | 'error';
type Fields = Partial<Record<'name' | 'email' | 'whatsapp' | 'company' | 'budget' | 'message', string>>;

const input =
  'w-full min-h-12 rounded-xl bg-brand-black border border-white/15 px-4 py-3 text-base text-white placeholder:text-gray-600 outline-none transition-colors focus:border-accent aria-[invalid=true]:border-red-400';

export default function LeadForm({
  source,
  service,
  whatsappMessage,
  submitLabel = 'Send enquiry',
}: {
  source: LeadSource;
  service?: string;
  whatsappMessage?: string;
  submitLabel?: string;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Fields>({});

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries()) as Record<string, string>;
    setStatus('sending');
    setError('');
    setFieldErrors({});
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, source, service, page: window.location.pathname }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; fields?: Fields };
      if (!res.ok) {
        setFieldErrors(data.fields ?? {});
        throw new Error(data.error ?? 'Something went wrong. Please try again.');
      }
      setStatus('sent');
    } catch (err) {
      setError(err instanceof TypeError ? 'You appear to be offline. Please try again.' : (err as Error).message);
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-8 md:p-10 text-center">
        <CheckCircle2 className="w-10 h-10 text-accent mx-auto" aria-hidden />
        <p className="mt-4 text-2xl font-bold tracking-tight">Thanks, your enquiry is in.</p>
        <p className="mt-2 text-gray-400">You'll get a reply by email{hasWhatsApp ? ' or WhatsApp' : ''} soon.</p>
      </div>
    );
  }

  const field = (name: keyof Fields) => ({
    id: `lead-${name}`,
    name,
    'aria-invalid': Boolean(fieldErrors[name]) || undefined,
    'aria-describedby': fieldErrors[name] ? `lead-${name}-error` : undefined,
  });
  const err = (name: keyof Fields) =>
    fieldErrors[name] && (
      <p id={`lead-${name}-error`} className="mt-1.5 text-sm text-red-400">
        {fieldErrors[name]}
      </p>
    );
  const label = 'block text-sm font-semibold text-gray-300 mb-1.5';

  return (
    <form onSubmit={submit} noValidate className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8 md:p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        <div>
          <label htmlFor="lead-name" className={label}>Name *</label>
          <input {...field('name')} required autoComplete="name" className={input} />
          {err('name')}
        </div>
        <div>
          <label htmlFor="lead-email" className={label}>Email *</label>
          <input {...field('email')} type="email" required autoComplete="email" className={input} />
          {err('email')}
        </div>
        <div>
          <label htmlFor="lead-whatsapp" className={label}>WhatsApp number</label>
          <input {...field('whatsapp')} type="tel" autoComplete="tel" placeholder="+91 …" className={input} />
          {err('whatsapp')}
        </div>
        <div>
          <label htmlFor="lead-company" className={label}>Company</label>
          <input {...field('company')} autoComplete="organization" className={input} />
          {err('company')}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="lead-budget" className={label}>Budget</label>
          <select {...field('budget')} defaultValue="" className={`${input} [color-scheme:inherit]`}>
            <option value="" disabled>
              Choose a range
            </option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="lead-message" className={label}>What would you like to achieve?</label>
          <textarea {...field('message')} rows={4} className={`${input} resize-y`} />
          {err('message')}
        </div>
        {/* Honeypot: hidden from people, filled in by bots */}
        <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
          <label htmlFor="lead-company-url">Company website</label>
          <input id="lead-company-url" name="company_url" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-5 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:opacity-70">
          {status === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : null}
          {status === 'sending' ? 'Sending…' : submitLabel}
          {status !== 'sending' && <ArrowUpRight className="w-4 h-4" aria-hidden />}
        </button>
        {hasWhatsApp ? (
          <a href={whatsappHref(whatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Chat on WhatsApp
          </a>
        ) : (
          <a href={contactHref} className="inline-flex items-center gap-2 min-h-11 px-3 text-sm font-semibold text-gray-300 hover:text-white">
            <Mail className="w-4 h-4" aria-hidden /> or email {contactEmail}
          </a>
        )}
      </div>
    </form>
  );
}
