import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Bot,
  Check,
  ChevronRight,
  Code2,
  Compass,
  Database,
  Globe,
  Megaphone,
  Plus,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { getService, landingServices, services, type Service } from '../content/services';
import { Devices, cardStyle, sceneFor, type Variant } from '../components/ServiceShowcase';
import { hasWhatsApp, whatsappHref } from '../lib/whatsapp';
import { onLinkClick } from '../router';

const ICONS: Record<Service['icon'], LucideIcon> = {
  globe: Globe,
  megaphone: Megaphone,
  search: Search,
  bot: Bot,
  database: Database,
  code: Code2,
  compass: Compass,
};

const VARIANTS: Variant[] = ['graphite', 'yellow', 'olive'];

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

function SectionHeader({ label, title, accent, intro }: { label: string; title: string; accent: string; intro?: string }) {
  return (
    <div className="section-head flex flex-col items-center text-center mb-10 md:mb-14">
      <div className="max-w-2xl">
        <span className="eyebrow mb-5">{label}</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-[1.08]">
          {title} <span className="text-accent">{accent}</span>
        </h2>
        {intro && <p className="mt-6 text-gray-400 md:text-lg leading-relaxed">{intro}</p>}
      </div>
    </div>
  );
}

// Primary call to action: WhatsApp with the service's pre-written message, or the contact page
function ctaFor(service: Service) {
  return hasWhatsApp
    ? { href: whatsappHref(service.whatsapp), label: 'Discuss on WhatsApp', external: true }
    : { href: '/contact', label: 'Get a quote', external: false };
}

function CtaLink({ service, className }: { service: Service; className: string }) {
  const cta = ctaFor(service);
  return (
    <a
      href={cta.href}
      {...(cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : { onClick: onLinkClick })}
      className={className}
    >
      {cta.label} <ArrowUpRight className="w-4 h-4" aria-hidden />
    </a>
  );
}

function NotFound() {
  return (
    <main className="min-h-svh flex flex-col items-center justify-center text-center px-5 pt-24">
      <span className="eyebrow mb-5">Services</span>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">That service page doesn't exist.</h1>
      <a href="/services" onClick={onLinkClick} className="btn-primary">
        See all services <ArrowUpRight className="w-4 h-4" aria-hidden />
      </a>
    </main>
  );
}

export default function ServiceDetailPage({ slug }: { slug: string }) {
  const service = getService(slug);
  if (!service) return <NotFound />;

  const index = services.findIndex((s) => s.slug === service.slug);
  const variant = VARIANTS[index % VARIANTS.length];
  const Icon = ICONS[service.icon];
  const related = landingServices.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <main>
      {/* ── Hero ── */}
      <header className="relative overflow-hidden pt-28 md:pt-36 pb-14 md:pb-20 px-5 sm:px-6 md:px-12 lg:px-24 border-b border-white/5">
        <div className="absolute -top-24 -right-24 w-[360px] h-[360px] md:w-[600px] md:h-[600px] bg-brand-yellow/10 blur-[90px] md:blur-[150px] rounded-full pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8 md:mb-12">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <li>
                <a href="/" onClick={onLinkClick} className="hover:text-accent transition-colors">Home</a>
              </li>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden />
              <li>
                <a href="/services" onClick={onLinkClick} className="hover:text-accent transition-colors">Services</a>
              </li>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden />
              <li aria-current="page" className="text-accent font-medium">{service.navTitle}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-14 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="eyebrow mb-6">
                <Icon className="w-3.5 h-3.5" aria-hidden /> {service.navTitle}
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.02]">{service.title}</h1>
              <p className="mt-6 text-lg md:text-xl text-gray-400 leading-relaxed max-w-xl">{service.intro}</p>

              <div className="mt-8 inline-flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">Pricing</span>
                <span className="text-2xl md:text-3xl font-bold tracking-tight">{service.price}</span>
                <span className="text-sm text-gray-400">{service.priceNote}</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <CtaLink service={service} className="btn-primary" />
                <a href="#included" className="btn-secondary">
                  What's included
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className={`rounded-[2rem] md:rounded-[2.5rem] border ${variant === 'yellow' ? 'border-black/10' : 'border-white/10'} p-8 sm:p-12 ${cardStyle[variant]}`}
            >
              <Devices scene={sceneFor(service.icon)} v={variant} />
            </motion.div>
          </div>
        </div>
      </header>

      {/* ── What's included ── */}
      <section id="included" className="section-padding bg-brand-black scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="What's included"
            title="Everything you"
            accent="get."
            intro={`A clear scope from day one, so you know exactly what ${service.navTitle.toLowerCase()} delivers.`}
          />
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {service.deliverables.map((d, i) => (
              <motion.li
                key={d}
                {...reveal}
                transition={{ ...reveal.transition, delay: (i % 3) * 0.06 }}
                className="flex gap-4 p-6 rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <span className="grid w-10 h-10 shrink-0 place-items-center rounded-xl bg-brand-yellow text-black">
                  <Check className="w-5 h-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-xs font-bold tracking-[0.2em] text-gray-500 mb-1">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-semibold leading-snug">{d}</span>
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Who it's for ── */}
      {service.useCases.length > 0 && (
        <section className="section-padding bg-brand-dark-gray border-y border-white/5">
          <div className="max-w-5xl mx-auto">
            <SectionHeader label="Who it's for" title="A good fit" accent="if you need…" />
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {service.useCases.map((u) => (
                <motion.li
                  key={u}
                  {...reveal}
                  className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-brand-black border border-white/10 font-medium"
                >
                  <ChevronRight className="w-5 h-5 text-accent shrink-0" aria-hidden />
                  {u}
                </motion.li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Process ── */}
      {service.process.length > 0 && (
        <section className="section-padding bg-brand-black">
          <div className="max-w-7xl mx-auto">
            <SectionHeader label="How it works" title="From first call to" accent="results." />
            <ol className={`grid grid-cols-1 sm:grid-cols-2 ${service.process.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 md:gap-5`}>
              {service.process.map((step, i) => (
                <motion.li
                  key={step.title}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: i * 0.08 }}
                  className="relative p-6 md:p-7 rounded-2xl border border-white/10 bg-white/[0.03]"
                >
                  <span className="text-5xl font-black tracking-tighter text-accent/90 leading-none">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-5 text-xl font-bold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-gray-400 leading-relaxed">{step.text}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ── Pricing ── */}
      <section className="px-5 sm:px-6 md:px-12 lg:px-24 pb-20 md:pb-32 bg-brand-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 md:gap-6">
          <motion.div
            {...reveal}
            className="rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 border border-black/10 text-black bg-[radial-gradient(120%_120%_at_100%_0%,rgba(255,255,255,0.55),transparent_45%),linear-gradient(135deg,#f5ff00,#dde800)]"
          >
            <p className="text-sm font-semibold text-black/60">Pricing · {service.navTitle}</p>
            <p className="mt-3 text-4xl md:text-6xl font-bold tracking-tighter">{service.price}</p>
            <p className="mt-3 text-black/70 max-w-lg">{service.priceNote}</p>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {service.deliverables.slice(0, 4).map((d) => (
                <li key={d} className="flex gap-2 text-sm">
                  <Check className="w-4 h-4 mt-0.5 shrink-0" aria-hidden /> {d}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <CtaLink
                service={service}
                className="inline-flex items-center gap-2 min-h-11 px-6 rounded-full bg-black text-brand-yellow text-sm font-semibold hover:bg-black/85 transition-colors"
              />
            </div>
          </motion.div>

          <motion.div {...reveal} className="theme-dark rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 border border-white/10 bg-[linear-gradient(135deg,#1c1c1c,#060606)] text-white flex flex-col">
            <Compass className="w-8 h-8 text-accent" aria-hidden />
            <h2 className="mt-5 text-2xl md:text-3xl font-bold tracking-tight">Not sure what you need yet?</h2>
            <p className="mt-3 text-gray-400 leading-relaxed">
              Book a 60-minute strategy call and leave with a prioritised plan, whether or not we work together.
            </p>
            <a
              href="/contact"
              onClick={onLinkClick}
              className="mt-auto pt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:gap-3 transition-all"
            >
              Book a strategy call <ArrowUpRight className="w-4 h-4" aria-hidden />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FAQs (native details/summary: answers stay in the page for search engines) ── */}
      {service.faqs.length > 0 && (
        <section className="section-padding bg-brand-dark-gray border-y border-white/5">
          <div className="max-w-3xl mx-auto">
            <SectionHeader label="FAQ" title="Questions," accent="answered." />
            <div className="space-y-3">
              {service.faqs.map((f, i) => (
                <details key={f.question} open={i === 0} className="group rounded-2xl border border-white/10 bg-brand-black open:border-accent/30">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 md:p-6 font-semibold md:text-lg [&::-webkit-details-marker]:hidden">
                    <h3>{f.question}</h3>
                    <Plus className="w-5 h-5 shrink-0 text-gray-500 transition-transform group-open:rotate-45 group-open:text-accent" aria-hidden />
                  </summary>
                  <p className="px-5 pb-5 md:px-6 md:pb-6 -mt-1 text-gray-400 leading-relaxed">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related services ── */}
      <section className="section-padding bg-brand-black">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="More services" title="Often paired" accent="with this." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {related.map((r) => {
              const RIcon = ICONS[r.icon];
              return (
                <motion.a
                  key={r.slug}
                  href={r.href}
                  onClick={onLinkClick}
                  {...reveal}
                  className="group flex flex-col p-7 rounded-[1.75rem] border border-white/10 bg-white/[0.03] hover:border-accent/40 transition-colors"
                >
                  <span className="grid w-12 h-12 place-items-center rounded-2xl bg-brand-yellow/15 text-accent">
                    <RIcon className="w-6 h-6" aria-hidden />
                  </span>
                  <h3 className="mt-6 text-xl font-bold tracking-tight group-hover:text-accent transition-colors">{r.title}</h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">{r.short}</p>
                  <span className="mt-auto pt-6 flex items-center justify-between text-sm font-semibold">
                    <span className="text-gray-300">{r.price}</span>
                    <ArrowUpRight className="w-4 h-4 text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden />
                  </span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
