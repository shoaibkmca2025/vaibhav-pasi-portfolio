import { motion } from 'motion/react';
import { ArrowUpRight, Check } from 'lucide-react';
import { caseStudies, type CaseStudy } from '../content/caseStudies';
import { onLinkClick } from '../router';

// Real client case studies from content/caseStudies.ts (results backed by the screenshots in /public/wins).
// FeaturedProjects is the compact home-page version; the default export shows every case study in full on /work.

const enquireHref = (c: CaseStudy) => `/contact?service=${encodeURIComponent(c.cta.service)}#enquire`;

function Badge() {
  return (
    <span className="inline-flex items-center rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-3 py-1 text-xs font-semibold text-accent">
      Client work
    </span>
  );
}

function Outcomes({ outcome }: { outcome: CaseStudy['outcome'] }) {
  return (
    <dl className="grid grid-cols-3 gap-3">
      {outcome.map((o) => (
        <div key={o.label} className="flex flex-col-reverse justify-end rounded-xl border border-white/10 px-3 py-3">
          <dt className="mt-1 text-xs text-gray-400 leading-snug">{o.label}</dt>
          <dd className="text-xl md:text-2xl font-bold tracking-tight text-accent">{o.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Screenshot({ c, priority = false }: { c: CaseStudy; priority?: boolean }) {
  const shot = c.screenshots[0];
  if (!shot) return null;
  return (
    <a href={shot.src} target="_blank" rel="noopener" className="block rounded-2xl overflow-hidden border border-white/10 bg-brand-dark-gray group/shot">
      <img
        src={shot.src}
        alt={shot.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="w-full max-h-[420px] object-contain transition-transform duration-500 group-hover/shot:scale-[1.02]"
      />
      <span className="sr-only">Open the original screenshot</span>
    </a>
  );
}

export function FeaturedProjects() {
  return (
    <section className="section-padding bg-brand-black">
      <div className="max-w-7xl mx-auto">
        <div className="section-head flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="max-w-2xl">
            <span className="eyebrow mb-5">Featured projects</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-[1.08]">
              Real work, <span className="text-accent">real numbers.</span>
            </h2>
            <p className="mt-6 text-gray-400 md:text-lg leading-relaxed">
              Results from client accounts, each backed by the original screenshot. Client names are kept private.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {caseStudies.slice(0, 3).map((c, i) => (
            <motion.article
              key={c.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="flex flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-5 md:p-6"
            >
              <Screenshot c={c} />
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Badge />
                <span className="text-xs text-gray-500">{c.category}</span>
              </div>
              <h3 className="mt-3 text-xl font-bold tracking-tight leading-snug">{c.headline}</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">{c.challenge}</p>
              <div className="mt-5">
                <Outcomes outcome={c.outcome} />
              </div>
              <a
                href={`/work#${c.slug}`}
                onClick={onLinkClick}
                className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent link-underline self-start"
              >
                Read case study <ArrowUpRight className="w-4 h-4" aria-hidden />
              </a>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href="/work" onClick={onLinkClick} className="btn-secondary">
            View all work
          </a>
        </div>
      </div>
    </section>
  );
}

// Full case studies for /work
export default function CaseStudies() {
  return (
    <section className="section-padding bg-brand-black">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
        {caseStudies.map((c, i) => (
          <motion.article
            key={c.slug}
            id={c.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="scroll-mt-28 rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 sm:p-8 md:p-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge />
                  <span className="text-sm text-gray-500">
                    {c.client} · {c.category}
                  </span>
                </div>
                <h2 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight leading-snug">{c.headline}</h2>

                <h3 className="mt-6 text-xs font-bold tracking-[0.2em] uppercase text-gray-500">The challenge</h3>
                <p className="mt-2 text-gray-300 leading-relaxed">{c.challenge}</p>

                <h3 className="mt-6 text-xs font-bold tracking-[0.2em] uppercase text-gray-500">The solution</h3>
                <ul className="mt-2 space-y-2">
                  {c.approach.map((a) => (
                    <li key={a} className="flex gap-2.5 text-gray-300">
                      <Check className="w-4 h-4 mt-1 shrink-0 text-accent" aria-hidden /> {a}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-6 text-xs font-bold tracking-[0.2em] uppercase text-gray-500">My role & deliverables</h3>
                <p className="mt-2 text-gray-300 leading-relaxed">{c.built.join(' · ')}</p>

                <h3 className="mt-6 text-xs font-bold tracking-[0.2em] uppercase text-gray-500">Tools</h3>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {c.stack.map((t) => (
                    <li key={t} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-gray-400">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-5">
                <Screenshot c={c} priority={i === 0} />
                <Outcomes outcome={c.outcome} />
                <a href={enquireHref(c)} onClick={onLinkClick} className="btn-primary self-start">
                  {c.cta.label} <ArrowUpRight className="w-4 h-4" aria-hidden />
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
