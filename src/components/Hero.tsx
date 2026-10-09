import { motion } from 'motion/react';
import { ArrowUpRight, Newspaper } from 'lucide-react';
import { bookingExternal, bookingHref } from '../lib/booking';
import { onLinkClick } from '../router';
import { publications } from './Press';

// Verified press count: publications with a logo (the same 11 counted in content/proof.ts)
const pressCount = publications.filter((p) => 'logo' in p && p.logo).length;

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section className="theme-dark bg-brand-black text-white relative overflow-hidden pt-32 md:pt-40 pb-20 md:pb-28 px-5 sm:px-6 md:px-12 lg:px-24">
      {/* Subtle background: fine grid fading out, and a soft warm glow behind the portrait */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.05] [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(232,200,136,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232,200,136,0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="absolute top-1/4 right-[8%] w-[320px] h-[320px] md:w-[520px] md:h-[520px] rounded-full bg-brand-yellow/10 blur-[90px] md:blur-[130px]" />
      </div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-16 items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="eyebrow mb-7"
          >
            Technology × Marketing × AI
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="text-[2.75rem] leading-[1.02] sm:text-6xl md:text-7xl xl:text-[5.5rem] font-bold tracking-tighter"
          >
            Build Better. <br className="hidden sm:block" />
            Market Smarter. <br />
            <span className="text-accent">Grow Faster.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease }}
            className="mt-7 max-w-xl text-lg md:text-xl text-gray-400 leading-relaxed"
          >
            I help ambitious businesses grow through performance-focused digital marketing, high-converting websites, custom
            software, and practical AI-powered automation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.26, ease }}
            className="mt-9 flex flex-col sm:flex-row gap-3"
          >
            <a
              href={bookingHref}
              data-cta="book"
              {...(bookingExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="btn-primary"
            >
              Book a Strategy Call <ArrowUpRight className="w-4 h-4" aria-hidden />
            </a>
            <a href="/work" onClick={onLinkClick} className="btn-secondary">
              Explore My Work
            </a>
          </motion.div>

          {/* Verifiable facts only */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400"
          >
            <li>Co-Founder, 4AM Global Media</li>
            <li aria-hidden className="text-gray-600">·</li>
            <li>MCA, software developer</li>
            <li aria-hidden className="text-gray-600">·</li>
            <li>Digital marketing since 2019</li>
          </motion.ul>
        </div>

        {/* Founder portrait */}
        <motion.figure
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="relative mx-auto w-full max-w-[420px] lg:max-w-none"
        >
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-brand-yellow/25 bg-brand-dark-gray">
            <img
              src="/vaibhav-pasi.jpg"
              alt="Vaibhav Pasi, digital marketer, software developer and Co-Founder of 4AM Global Media"
              width={640}
              height={800}
              fetchPriority="high"
              className="w-full h-full object-cover object-top"
            />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
            <figcaption className="absolute left-5 right-5 bottom-5">
              <span className="block text-lg font-semibold text-white">Vaibhav Pasi</span>
              <span className="block text-sm text-gray-300">Technology & growth partner</span>
            </figcaption>
          </div>
          <a
            href="/about"
            onClick={onLinkClick}
            className="absolute -left-3 sm:-left-8 top-8 inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-brand-black/90 backdrop-blur px-4 py-3 text-sm shadow-xl hover:border-brand-yellow/40 transition-colors"
          >
            <Newspaper className="w-4 h-4 text-accent" aria-hidden />
            <span>
              Featured in <strong className="text-white">{pressCount} publications</strong>
            </span>
          </a>
        </motion.figure>
      </div>
    </section>
  );
}
