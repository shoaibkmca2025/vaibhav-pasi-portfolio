import { useRef, type CSSProperties } from 'react';
import { motion, useReducedMotion, useScroll } from 'motion/react';
import { onLinkClick } from '../router';
import { publications } from './Press';

// Verified press count: publications with a logo (the same count used in the hero)
const pressCount = publications.filter((p) => 'logo' in p && p.logo).length;

// Career milestones, facts only (the same facts used across the site). Add a year to an entry
// only once it is confirmed; entries without one show a label instead.
const milestones: { when: string; title: string; body: string; link?: { href: string; label: string } }[] = [
  {
    when: 'Background',
    title: 'MCA graduate and software developer',
    body: 'A Master of Computer Applications and hands-on development work: websites, web apps, integrations and automation.',
  },
  {
    when: '2019',
    title: 'Started in digital marketing',
    body: 'Content, social media, paid campaigns and analytics, alongside development work.',
    link: { href: '/client-wins', label: 'See client results' },
  },
  {
    when: 'Co-Founder',
    title: '4AM Global Media',
    body: 'Co-founded 4AM Global Media, bringing strategy, technology, marketing and 3D motion together in one team.',
    link: { href: '/team', label: 'Meet the team' },
  },
  {
    when: 'May 2026',
    title: `Featured in ${pressCount} publications`,
    body: 'Profiled by online news publications for work in digital marketing through 4AM Global Media.',
    link: { href: '#press', label: 'Read the coverage' },
  },
];

// A vertical timeline whose gold line fills as it scrolls through the viewport; each milestone
// rises in as it arrives. With Reduce Motion the line is simply full.
export default function AboutTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });

  return (
    <section className="section-padding bg-brand-black border-b border-white/5" aria-labelledby="timeline-heading">
      <div className="max-w-3xl mx-auto">
        <div className="section-head mb-12 md:mb-16">
          <span className="eyebrow mb-5">Path so far</span>
          <h2 id="timeline-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-[1.08]">
            From code to <span className="text-accent">growth.</span>
          </h2>
        </div>

        <ol ref={ref} className="relative pl-10 md:pl-14">
          <div aria-hidden className="absolute left-[11px] md:left-[15px] top-2 bottom-2 w-px bg-white/10">
            <motion.div
              style={{ scaleY: reduce ? 1 : scrollYProgress }}
              className="absolute inset-0 origin-top bg-gradient-to-b from-brand-yellow via-brand-yellow/80 to-brand-yellow/40"
            />
          </div>
          {milestones.map((m, i) => (
            <li
              key={m.title}
              data-reveal="up"
              style={{ '--i': 0 } as CSSProperties}
              className={`relative ${i < milestones.length - 1 ? 'pb-12 md:pb-14' : ''}`}
            >
              <span
                aria-hidden
                className="absolute -left-10 md:-left-14 top-1 grid h-6 w-6 md:h-8 md:w-8 place-items-center rounded-full border border-brand-yellow/40 bg-brand-black"
              >
                <span className="h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="block text-xs font-bold uppercase tracking-[0.2em] text-accent">{m.when}</span>
              <h3 className="mt-2 text-xl md:text-2xl font-bold tracking-tight">{m.title}</h3>
              <p className="mt-2 text-gray-400 leading-relaxed">{m.body}</p>
              {m.link && (
                <a
                  href={m.link.href}
                  onClick={m.link.href.startsWith('/') ? onLinkClick : undefined}
                  className="mt-3 inline-flex text-sm font-semibold text-accent link-underline"
                >
                  {m.link.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
