import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, Newspaper } from 'lucide-react';
import { bookingExternal, bookingHref } from '../lib/booking';
import { onLinkClick } from '../router';
import { publications } from './Press';

// Verified press count: publications with a logo (the same 11 counted in content/proof.ts)
const pressCount = publications.filter((p) => 'logo' in p && p.logo).length;

// Entrance is pure CSS (.reveal in index.css), so the prerendered hero is visible
// before any JavaScript runs; --d staggers each line
const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

// Headline words rise out of a mask one after another (.hero-word in index.css).
// `n` is the word's position in the whole headline, which sets its delay.
function Words({ text, start, className }: { text: string; start: number; className?: string }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={word} className="hero-word">
          <span className={className} style={{ '--w': start + i } as CSSProperties}>
            {word}
          </span>{' '}
        </span>
      ))}
    </>
  );
}

// Scroll parallax only where it helps: wide screens, no Reduce Motion, capable devices
function useParallaxEnabled() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () =>
      setEnabled(wide.matches && !calm.matches && !document.documentElement.classList.contains('motion-lite'));
    update();
    wide.addEventListener('change', update);
    calm.addEventListener('change', update);
    return () => {
      wide.removeEventListener('change', update);
      calm.removeEventListener('change', update);
    };
  }, []);
  return enabled;
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const parallax = useParallaxEnabled();
  // 0 → 1 while the hero scrolls out of view; background layers drift slower than the page
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, parallax ? 160 : 0]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, parallax ? 70 : 0]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, parallax ? -40 : 0]);

  return (
    <section ref={ref} className="theme-dark bg-brand-black text-white relative overflow-hidden pt-32 md:pt-40 pb-20 md:pb-28 px-5 sm:px-6 md:px-12 lg:px-24">
      {/* Subtle background: fine grid fading out, and a soft warm glow behind the portrait */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{
            y: gridY,
            backgroundImage:
              'linear-gradient(rgba(214,182,117,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(214,182,117,0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
          className="absolute inset-0 opacity-[0.05] [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]"
        />
        <motion.div style={{ y: glowY }} className="absolute inset-0">
          <div className="absolute top-1/4 right-[8%] w-[320px] h-[320px] md:w-[520px] md:h-[520px] rounded-full bg-brand-yellow/10 blur-[90px] md:blur-[130px]" />
          <div className="absolute -bottom-24 -left-24 w-[280px] h-[280px] md:w-[440px] md:h-[440px] rounded-full bg-coral/10 blur-[90px] md:blur-[130px]" />
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-16 items-center">
        <div>
          <span className="eyebrow mb-7 reveal" style={delay(0)}>
            Technology × Marketing × AI
          </span>

          <h1 className="text-[2.75rem] leading-[1.02] sm:text-6xl md:text-7xl xl:text-[5.5rem] font-bold tracking-tighter">
            <Words text="Build Better." start={0} />
            <br className="hidden sm:block" />
            <Words text="Market Smarter." start={2} />
            <br />
            <Words text="Grow Faster." start={4} className="text-gradient" />
          </h1>

          <p className="mt-7 max-w-xl text-lg md:text-xl text-gray-400 leading-relaxed reveal" style={delay(380)}>
            I help ambitious businesses grow through performance-focused digital marketing, high-converting websites, custom
            software, and practical AI-powered automation.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <a
              href={bookingHref}
              data-cta="book"
              {...(bookingExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="btn-primary reveal"
              style={delay(460)}
            >
              Book a Strategy Call <ArrowUpRight className="w-4 h-4" aria-hidden />
            </a>
            <a href="/work" onClick={onLinkClick} className="btn-secondary reveal" style={delay(540)}>
              Explore My Work
            </a>
          </div>

          {/* Verifiable facts only */}
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 reveal" style={delay(620)}>
            <li>Co-Founder, 4AM Global Media</li>
            <li aria-hidden className="hidden sm:block text-gray-600">·</li>
            <li>MCA, software developer</li>
            <li aria-hidden className="hidden sm:block text-gray-600">·</li>
            <li>Digital marketing since 2019</li>
          </ul>
        </div>

        {/* Founder portrait */}
        <figure className="relative mx-auto w-full max-w-[420px] lg:max-w-none reveal" style={delay(200)}>
          <motion.div style={{ y: portraitY }} className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-brand-yellow/25 bg-brand-dark-gray">
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
          </motion.div>
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
        </figure>
      </div>
    </section>
  );
}
