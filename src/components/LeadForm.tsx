import { useEffect, useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { BUDGETS, TIMELINES, type LeadSource } from '../../shared/leads';
import { services } from '../content/services';
import { contactEmail, contactHref } from '../contact';
import { track } from '../lib/analytics';
import { hasWhatsApp, whatsappHref } from '../lib/whatsapp';

// Enquiry form that posts to /api/leads (database, email and webhook, depending on
// what's configured in Vercel). Name plus an email or WhatsApp number are required;
// everything else is optional so the form stays quick to finish.
type Status = 'idle' | 'sending' | 'sent' | 'error';
type FieldName = 'name' | 'email' | 'whatsapp' | 'company' | 'service' | 'budget' | 'timeline' | 'message';
type Fields = Partial<Record<FieldName, string>>;

const NOT_SURE = 'Not sure yet';
const serviceOptions = [...services.map((s) => s.navTitle), NOT_SURE];

const input =
  'w-full min-h-12 rounded-xl bg-brand-black border border-white/15 px-4 py-3 text-base text-white placeholder:text-gray-600 outline-none transition-colors focus:border-accent aria-[invalid=true]:border-red-400';

export default function LeadForm({
  source,
  service: fixedService,
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
  const [service, setService] = useState(fixedService ?? '');

  // Links like /contact?service=SEO#enquire pre-select the service
  useEffect(() => {
    if (fixedService) return;
    const wanted = new URLSearchParams(window.location.search).get('service');
    const match = wanted && serviceOptions.find((o) => o.toLowerCase() === wanted.toLowerCase());
    if (match) setService(match);
  }, [fixedService]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;

    // Same rule as the server, checked first so people get instant feedback
    const local: Fields = {};
    if (!body.name?.trim()) local.name = 'Please enter your name';
    if (!body.email?.trim() && !body.whatsapp?.trim()) local.email = 'Enter an email or a WhatsApp number';
    if (Object.keys(local).length) {
      setFieldErrors(local);
      setError('Please check the highlighted fields.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setError('');
    setFieldErrors({});
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, service: service || undefined, source, page: window.location.pathname }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; fields?: Fields };
      if (!res.ok) {
        setFieldErrors(data.fields ?? {});
        throw new Error(data.error ?? 'Something went wrong. Please try again.');
      }
      // Only counted once the server has accepted the enquiry
      track('generate_lead', { source, service: service || NOT_SURE, budget: body.budget || undefined });
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
        <p className="mt-2 text-gray-400">I'll reply by email or WhatsApp, usually within one working day.</p>
      </div>
    );
  }

  const field = (name: FieldName) => ({
    id: `lead-${name}`,
    name,
    'aria-invalid': Boolean(fieldErrors[name]) || undefined,
    'aria-describedby': fieldErrors[name] ? `lead-${name}-error` : undefined,
  });
  const err = (name: FieldName) =>
    fieldErrors[name] && (
      <p id={`lead-${name}-error`} className="mt-1.5 text-sm text-red-400">
        {fieldErrors[name]}
      </p>
    );
  const label = 'block text-sm font-semibold text-gray-300 mb-1.5';
  const select = `${input} [color-scheme:inherit]`;

  return (
    <form onSubmit={submit} noValidate className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8 md:p-10">
      <p className="mb-6 text-sm text-gray-400">
        Fields marked * are required. Add an email <em>or</em> a WhatsApp number so I can reply.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        <div className="sm:col-span-2">
          <label htmlFor="lead-name" className={label}>Name *</label>
          <input {...field('name')} required autoComplete="name" className={input} />
          {err('name')}
        </div>
        <div>
          <label htmlFor="lead-email" className={label}>Business email</label>
          <input {...field('email')} type="email" autoComplete="email" className={input} />
          {err('email')}
        </div>
        <div>
          <label htmlFor="lead-whatsapp" className={label}>Phone / WhatsApp</label>
          <input {...field('whatsapp')} type="tel" autoComplete="tel" placeholder="+91 …" className={input} />
          {err('whatsapp')}
        </div>
        <div>
          <label htmlFor="lead-company" className={label}>Company or project</label>
          <input {...field('company')} autoComplete="organization" className={input} />
          {err('company')}
        </div>
        <div>
          <label htmlFor="lead-service" className={label}>Service needed</label>
          {fixedService ? (
            <input {...field('service')} value={fixedService} readOnly className={`${input} text-gray-400`} />
          ) : (
            <select {...field('service')} value={service} onChange={(e) => setService(e.currentTarget.value)} className={select}>
              <option value="">Choose a service</option>
              {serviceOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label htmlFor="lead-budget" className={label}>Approximate budget</label>
          <select {...field('budget')} defaultValue="" className={select}>
            <option value="">Choose a range</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="lead-timeline" className={label}>Expected timeline</label>
          <select {...field('timeline')} defaultValue="" className={select}>
            <option value="">Choose a timeline</option>
            {TIMELINES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="lead-message" className={label}>Your requirements</label>
          <textarea
            {...field('message')}
            rows={4}
            placeholder="What are you trying to achieve, and what's in place today?"
            className={`${input} resize-y`}
          />
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
