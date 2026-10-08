import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { onLinkClick, sitePages, type PageKey } from '../router';

interface PageHeroProps {
  page: PageKey;
  title: ReactNode;
  intro: ReactNode;
  // Optional quick facts shown under the intro
  facts?: { value: string; label: string }[];
}

// Opening block shared by every standalone page: breadcrumb, numbered eyebrow, headline, intro
export function PageHero({ page, title, intro, facts }: PageHeroProps) {
  const index = sitePages.findIndex((p) => p.key === page);
  const label = sitePages[index].label;

  return (
    <header className="relative overflow-hidden pt-32 md:pt-44 pb-16 md:pb-24 px-5 sm:px-6 md:px-12 lg:px-24 border-b border-white/5">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(245,255,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,255,0,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute -top-20 -right-20 w-[320px] h-[320px] md:w-[560px] md:h-[560px] bg-brand-yellow/5 blur-[80px] md:blur-[150px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-10 md:mb-14">
          <ol className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-widest uppercase text-gray-500">
            <li>
              <a href="/" onClick={onLinkClick} className="hover:text-brand-yellow transition-colors">
                Home
              </a>
            </li>
            <ChevronRight className="w-3 h-3" aria-hidden />
            <li aria-current="page" className="text-brand-yellow">
              {label}
            </li>
          </ol>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2.5 text-[0.6875rem] font-extrabold tracking-[0.4em] uppercase text-gray-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
            {String(index + 1).padStart(2, '0')} / {label}
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[8.5rem] font-black tracking-tighter italic uppercase leading-[0.85] max-w-6xl">
            {title}
          </h1>
          <div className="mt-8 md:mt-10 max-w-2xl text-gray-400 text-base md:text-xl font-normal leading-relaxed">{intro}</div>
        </motion.div>

        {facts && (
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 max-w-4xl"
          >
            {facts.map((f) => (
              <div key={f.label} className="border-l-2 border-brand-yellow pl-4">
                <dt className="sr-only">{f.label}</dt>
                <dd className="text-3xl md:text-4xl font-black italic tracking-tighter">{f.value}</dd>
                <dd className="mt-1 text-[0.6875rem] font-bold tracking-widest uppercase text-gray-500">{f.label}</dd>
              </div>
            ))}
          </motion.dl>
        )}
      </div>
    </header>
  );
}

// Large link to the following page, so visitors can walk the site page by page
export function NextPage({ page }: { page: PageKey }) {
  const index = sitePages.findIndex((p) => p.key === page);
  const next = sitePages[(index + 1) % sitePages.length];

  return (
    <section className="px-5 sm:px-6 md:px-12 lg:px-24 pb-20 md:pb-32">
      <a
        href={next.path}
        onClick={onLinkClick}
        className="group max-w-7xl mx-auto flex items-center justify-between gap-6 border-t border-white/10 pt-10 md:pt-14"
      >
        <span>
          <span className="block text-[0.6875rem] font-bold tracking-[0.4em] uppercase text-gray-500 mb-3">Next page</span>
          <span className="block text-4xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none group-hover:text-brand-yellow transition-colors">
            {next.label}
          </span>
        </span>
        <span className="shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-full border border-white/15 group-hover:bg-brand-yellow group-hover:border-brand-yellow group-hover:text-black flex items-center justify-center transition-all">
          <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
        </span>
      </a>
    </section>
  );
}
