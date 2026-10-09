import { motion } from 'motion/react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { hasDetailPage, services, type Service } from '../content/services';
import { onLinkClick } from '../router';
import { hasWhatsApp, whatsappHref } from '../lib/whatsapp';

// Big rounded showcase cards, one per service: what it is, three deliverables, two actions,
// and an illustrated laptop + phone. Card styles rotate through the brand: graphite, yellow, olive-black.
export type Variant = 'graphite' | 'yellow' | 'olive';
const VARIANTS: Variant[] = ['graphite', 'yellow', 'olive'];

export const cardStyle: Record<Variant, string> = {
  graphite: 'theme-dark bg-[radial-gradient(120%_120%_at_100%_0%,rgba(245,255,0,0.14),transparent_45%),linear-gradient(135deg,#1c1c1c,#060606)] text-white',
  yellow: 'bg-[radial-gradient(120%_120%_at_100%_0%,rgba(255,255,255,0.55),transparent_45%),linear-gradient(135deg,#f5ff00,#dde800)] text-black',
  olive: 'theme-dark bg-[radial-gradient(120%_120%_at_0%_100%,rgba(245,255,0,0.16),transparent_50%),linear-gradient(135deg,#232700,#070800)] text-white',
};

// Screen colours for the illustration on each card style
const screen: Record<Variant, { bg: string; ink: string; soft: string; accent: string }> = {
  graphite: { bg: '#101010', ink: 'rgba(255,255,255,0.85)', soft: 'rgba(255,255,255,0.12)', accent: '#f5ff00' },
  yellow: { bg: '#ffffff', ink: '#111111', soft: 'rgba(0,0,0,0.08)', accent: '#111111' },
  olive: { bg: '#0d0f00', ink: 'rgba(255,255,255,0.85)', soft: 'rgba(255,255,255,0.12)', accent: '#f5ff00' },
};

type Scene = 'site' | 'dashboard' | 'chat';
export const sceneFor = (icon: Service['icon']): Scene =>
  icon === 'bot' ? 'chat' : icon === 'megaphone' || icon === 'search' || icon === 'database' || icon === 'linkedin' ? 'dashboard' : 'site';

function Bar({ w, h = 6, c }: { w: string; h?: number; c: string }) {
  return <div style={{ width: w, height: h, background: c, borderRadius: 999 }} />;
}

// Abstract screen contents (not real screenshots), drawn with plain shapes
function Screen({ scene, v, compact = false }: { scene: Scene; v: Variant; compact?: boolean }) {
  const c = screen[v];
  if (scene === 'chat') {
    const bubbles = compact ? [0, 1, 2] : [0, 1, 2, 3];
    return (
      <div className="flex flex-col gap-2 p-3 h-full" style={{ background: c.bg }}>
        {bubbles.map((i) => (
          <div
            key={i}
            className={`rounded-xl px-2.5 py-2 space-y-1 ${i % 2 ? 'self-end' : 'self-start'}`}
            style={{ background: i % 2 ? c.accent : c.soft, width: i % 2 ? '55%' : '68%' }}
          >
            <Bar w="90%" h={4} c={i % 2 ? c.bg : c.ink} />
            <Bar w="60%" h={4} c={i % 2 ? c.bg : c.ink} />
          </div>
        ))}
      </div>
    );
  }
  if (scene === 'dashboard') {
    const bars = compact ? [40, 70, 55, 90] : [35, 55, 45, 70, 60, 85, 75, 95];
    return (
      <div className="flex flex-col gap-2.5 p-3 h-full" style={{ background: c.bg }}>
        {!compact && (
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg p-2 space-y-1.5" style={{ background: c.soft }}>
                <Bar w="50%" h={4} c={c.ink} />
                <Bar w="75%" h={7} c={i === 0 ? c.accent : c.ink} />
              </div>
            ))}
          </div>
        )}
        <div className="flex-1 flex items-end gap-1.5 rounded-lg p-2" style={{ background: c.soft }}>
          {bars.map((h, i) => (
            <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i === bars.length - 1 ? c.accent : c.ink, opacity: i === bars.length - 1 ? 1 : 0.35 }} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2.5 p-3 h-full" style={{ background: c.bg }}>
      <div className="flex items-center justify-between">
        <Bar w="22%" h={5} c={c.ink} />
        <div className="flex gap-1.5">
          <Bar w="18px" h={4} c={c.soft} />
          <Bar w="18px" h={4} c={c.soft} />
          <Bar w="18px" h={4} c={c.accent} />
        </div>
      </div>
      <div className="space-y-1.5 pt-1">
        <Bar w="70%" h={compact ? 7 : 9} c={c.ink} />
        <Bar w="45%" h={compact ? 7 : 9} c={c.accent} />
        <Bar w="60%" h={4} c={c.soft} />
      </div>
      <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-3'} gap-2 mt-auto`}>
        {(compact ? [0, 1] : [0, 1, 2]).map((i) => (
          <div key={i} className="rounded-md" style={{ background: c.soft, height: compact ? 22 : 34 }} />
        ))}
      </div>
    </div>
  );
}

export function Devices({ scene, v }: { scene: Scene; v: Variant }) {
  const frame = v === 'yellow' ? '#111111' : '#2a2a2a';
  return (
    <div className="relative w-full max-w-[460px] mx-auto pr-[14%] pb-[6%]" aria-hidden>
      {/* Laptop */}
      <div className="rounded-t-xl overflow-hidden aspect-[16/10] shadow-2xl" style={{ border: `7px solid ${frame}`, borderBottomWidth: 9 }}>
        <div className="flex gap-1 px-2 py-1.5" style={{ background: frame }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.35)' }} />
          ))}
        </div>
        <div className="h-[calc(100%-18px)]">
          <Screen scene={scene} v={v} />
        </div>
      </div>
      <div className="mx-[-6%] h-3 rounded-b-xl" style={{ background: frame }} />
      {/* Phone */}
      <div
        className="absolute right-0 bottom-0 w-[30%] aspect-[9/18] rounded-[1.1rem] overflow-hidden shadow-2xl"
        style={{ border: `5px solid ${frame}` }}
      >
        <Screen scene={scene} v={v} compact />
      </div>
    </div>
  );
}

export default function ServiceShowcase({ limit = services.length }: { limit?: number }) {
  return (
    <section className="section-padding bg-brand-black">
      <div className="max-w-7xl mx-auto">
        <div className="section-head flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="max-w-2xl">
            <span className="eyebrow mb-5">Services</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-[1.05]">
              How can I <span className="text-accent">help you?</span>
            </h2>
            <p className="mt-6 text-gray-400 md:text-lg leading-relaxed">
              From high-converting websites to AI that runs the busywork: one partner for the whole growth system.
            </p>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          {services.slice(0, limit).map((service, i) => {
            const v = VARIANTS[i % VARIANTS.length];
            const onYellow = v === 'yellow';
            const cta = hasWhatsApp
              ? { href: whatsappHref(service.whatsapp), label: 'Discuss on WhatsApp', external: true }
              : { href: '/contact', label: 'Get a quote', external: false };
            return (
              <motion.article
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border ${onYellow ? 'border-black/10' : 'border-white/10'} ${cardStyle[v]}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-6 items-center p-7 sm:p-10 md:p-14">
                  <div>
                    <p className={`text-xs sm:text-sm font-semibold ${onYellow ? 'text-black/60' : 'text-accent'}`}>
                      {String(i + 1).padStart(2, '0')} · {service.navTitle}
                    </p>
                    <h3 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">{service.title}</h3>
                    <p className={`mt-4 max-w-lg leading-relaxed ${onYellow ? 'text-black/70' : 'text-gray-300'}`}>{service.short}</p>
                    <ul className="mt-6 space-y-2.5">
                      {service.deliverables.slice(0, 3).map((d) => (
                        <li key={d} className={`flex gap-2.5 text-sm sm:text-[0.95rem] ${onYellow ? 'text-black/85' : 'text-gray-200'}`}>
                          <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${onYellow ? 'text-black' : 'text-accent'}`} aria-hidden />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href={cta.href}
                        {...(cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : { onClick: onLinkClick })}
                        className={`inline-flex items-center gap-2 min-h-11 px-6 rounded-full text-sm font-semibold transition-all ${
                          onYellow ? 'bg-black text-brand-yellow hover:bg-black/85' : 'bg-brand-yellow text-black hover:brightness-105'
                        }`}
                      >
                        {cta.label} <ArrowUpRight className="w-4 h-4" aria-hidden />
                      </a>
                      <a
                        href={hasDetailPage(service) ? service.href : '/contact'}
                        onClick={onLinkClick}
                        className={`inline-flex items-center gap-2 min-h-11 px-6 rounded-full text-sm font-semibold border transition-colors ${
                          onYellow ? 'border-black/25 hover:bg-black/5' : 'border-white/25 hover:bg-white/10'
                        }`}
                      >
                        {hasDetailPage(service) ? 'Details & pricing' : 'Book a call'}
                      </a>
                    </div>
                  </div>
                  <Devices scene={sceneFor(service.icon)} v={v} />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
