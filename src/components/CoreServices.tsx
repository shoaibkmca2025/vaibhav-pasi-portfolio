import { motion } from 'motion/react';
import { ArrowUpRight, Check } from 'lucide-react';
import { getService, type Service } from '../content/services';
import { responsiveImage } from '../image';
import { SERVICE_ICONS } from '../lib/serviceIcons';
import { onLinkClick } from '../router';
import { ToolChips } from './ToolLogos';

// Section 4 of the home page. The three main commercial offers get large cards;
// the rest are compact. Order and emphasis are set here.
const FEATURED = ['digital-marketing', 'website-development', 'ai-automation'];
const MORE = ['seo', 'software-development', 'linkedin-marketing', 'personal-branding', 'ai-workshops'];

const pick = (slugs: string[]) => slugs.map(getService).filter((s): s is Service => Boolean(s));

// The enquiry form on /contact pre-selects the service from ?service=
const enquireHref = (s: Service) => `/contact?service=${encodeURIComponent(s.navTitle)}#enquire`;

// Photo with a fade into the card below it, so the image and text read as one surface
function CardImage({ s, sizes, className }: { s: Service; sizes: string; className: string }) {
  if (!s.image) return null;
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        {...responsiveImage(s.image.src, sizes)}
        alt={s.image.alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/30 to-transparent" />
    </div>
  );
}

export default function CoreServices() {
  const featured = pick(FEATURED);
  const more = pick(MORE);

  return (
    <section className="section-padding bg-brand-dark-gray border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="section-head flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="max-w-2xl">
            <span className="eyebrow mb-5">Services</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-[1.08]">
              How I can <span className="text-gradient">help you grow.</span>
            </h2>
            <p className="mt-6 text-gray-400 md:text-lg leading-relaxed">
              Marketing, websites, software and AI, planned together so each part supports the others.
            </p>
          </div>
        </div>

        {/* The three main offers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
          {featured.map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon];
            return (
              <motion.article
                key={s.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col rounded-[1.75rem] border border-white/10 bg-brand-black overflow-hidden hover:border-brand-yellow/40 transition-colors"
              >
                <CardImage s={s} sizes="(min-width: 1024px) 400px, 100vw" className="aspect-[16/9]" />
                <div className="relative flex flex-1 flex-col px-7 pb-7 md:px-8 md:pb-8 -mt-7">
                  <span className="grid w-12 h-12 place-items-center rounded-2xl bg-brand-yellow text-black shadow-lg shadow-black/30">
                    <Icon className="w-5 h-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-2xl font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-gray-400 leading-relaxed">{s.short}</p>
                  <ul className="mt-5 space-y-2">
                    {s.deliverables.slice(0, 3).map((d) => (
                      <li key={d} className="flex gap-2.5 text-sm text-gray-300">
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-accent" aria-hidden /> {d}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <ToolChips tools={s.tools} />
                  </div>
                  <div className="mt-auto pt-7 flex items-center justify-between gap-3">
                    <a
                      href={s.href}
                      onClick={onLinkClick}
                      data-track={`service_${s.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent link-underline"
                    >
                      Explore {s.navTitle} <ArrowUpRight className="w-4 h-4" aria-hidden />
                    </a>
                    <span className="text-sm text-gray-500 whitespace-nowrap">{s.price}</span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Everything else, compact */}
        <div className="mt-5 md:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {more.map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon];
            return (
              <motion.article
                key={s.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group flex flex-col rounded-2xl border border-white/10 bg-brand-black overflow-hidden hover:border-brand-yellow/40 transition-colors"
              >
                <CardImage s={s} sizes="(min-width: 1024px) 240px, (min-width: 640px) 50vw, 100vw" className="aspect-[16/10]" />
                <div className="relative flex flex-1 flex-col px-5 pb-5 -mt-5">
                  <span className="grid w-10 h-10 place-items-center rounded-xl bg-brand-yellow text-black shadow-lg shadow-black/30">
                    <Icon className="w-4 h-4" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-bold leading-snug">{s.title}</h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed line-clamp-3">{s.short}</p>
                  <div className="mt-auto pt-5 flex flex-col gap-1.5">
                    <a href={s.href} onClick={onLinkClick} data-track={`service_${s.slug}`} className="text-sm font-semibold text-accent link-underline self-start">
                      View service
                    </a>
                    <a href={enquireHref(s)} onClick={onLinkClick} className="text-sm text-gray-400 hover:text-white self-start">
                      Enquire →
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a href="/services" onClick={onLinkClick} className="btn-secondary">
            Compare all services and pricing
          </a>
        </div>
      </div>
    </section>
  );
}
