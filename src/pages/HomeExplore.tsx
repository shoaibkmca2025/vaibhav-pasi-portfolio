import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { onLinkClick } from '../router';

// Home-page directory of the standalone pages, each with a one-line pitch and a headline number
const cards = [
  { path: '/about', label: 'About', blurb: 'The story, the journey from 2019 to 4AM Global Media, and the skills behind it.', stat: '100+', statLabel: 'Brands scaled' },
  { path: '/services', label: 'Services', blurb: 'Growth marketing, ads, content, websites, AI automation and marketplace onboarding.', stat: '10', statLabel: 'Areas of expertise' },
  { path: '/work', label: 'Work', blurb: 'Selected projects and in-depth case studies with goals, plans and results.', stat: '+42%', statLabel: 'Checkout conversion' },
  { path: '/client-wins', label: 'Client Wins', blurb: 'Before-and-after numbers from real client accounts, with the screenshots.', stat: '3.1M', statLabel: 'Best reel views' },
  { path: '/contact', label: 'Contact', blurb: 'Tell me about your brand and goal. No forms, no friction.', stat: '→', statLabel: 'Start a project' },
];

export default function HomeExplore() {
  return (
    <section className="section-padding bg-brand-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow font-bold tracking-[0.4em] uppercase text-[0.6875rem] mb-5 block">Explore</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter italic uppercase leading-[0.9]">
              Go Deeper, <span className="text-gray-500">Page by Page.</span>
            </h2>
          </div>
          <div className="section-marker self-start md:self-auto">{cards.length} pages</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {cards.map((c, i) => (
            <motion.a
              key={c.path}
              href={c.path}
              onClick={onLinkClick}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className={`group p-6 md:p-8 rounded-3xl border border-white/5 bg-brand-dark-gray/20 hover:border-brand-yellow/40 transition-all flex flex-col justify-between gap-10 min-h-[260px] ${
                i === cards.length - 1 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-[0.6875rem] font-bold tracking-[0.4em] uppercase text-gray-500">{String(i + 1).padStart(2, '0')}</span>
                <span className="w-10 h-10 rounded-full border border-white/10 group-hover:bg-brand-yellow group-hover:border-brand-yellow group-hover:text-black flex items-center justify-center transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <div>
                <div className={`font-black italic tracking-tighter text-brand-yellow leading-none text-5xl`}>{c.stat}</div>
                <div className="mt-2 text-[0.6875rem] font-bold tracking-widest uppercase text-gray-500">{c.statLabel}</div>
                <h3 className="mt-8 text-3xl md:text-4xl font-black italic uppercase tracking-tighter group-hover:text-brand-yellow transition-colors">
                  {c.label}
                </h3>
                <p className="mt-2 text-sm text-gray-400 font-normal leading-relaxed">{c.blurb}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
