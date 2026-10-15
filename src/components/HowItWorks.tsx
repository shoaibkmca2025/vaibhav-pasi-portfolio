import { useRef, useState, type CSSProperties } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { Map as MapIcon, Rocket, Search, TrendingUp } from 'lucide-react';
import { responsiveImage } from '../image';

// How an engagement runs, whichever service it is. Photos are decorative stock (Unsplash), not client work.
const photo = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75&w=800`;
const steps = [
  {
    icon: Search,
    title: 'Discover',
    description: 'Understand goals, audience, and challenges.',
    image: photo('1557804506-669a67965ba0'),
    alt: 'Team discussing goals around a table',
  },
  {
    icon: MapIcon,
    title: 'Strategize',
    description: 'Define the scope, priorities, and execution plan.',
    image: photo('1586717791821-3f44a563fa4c'),
    alt: 'Sketching a plan on a tablet',
  },
  {
    icon: Rocket,
    title: 'Execute',
    description: 'Deliver the agreed marketing, development, or automation work.',
    image: photo('1522071820081-009f0129c71c'),
    alt: 'Team working together on laptops',
  },
  {
    icon: TrendingUp,
    title: 'Optimize',
    description: 'Measure performance and improve based on real data.',
    image: photo('1460925895917-afdab827c52f'),
    alt: 'Laptop showing an analytics dashboard',
  },
];

export default function HowItWorks() {
  // Large screens: as the row of steps scrolls through the viewport, a gold line fills from
  // Discover to Optimize and the step it has reached is highlighted. Nothing is pinned, so
  // scrolling is never held up. Phones and tablets keep the plain stacked cards.
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 80%', 'end 45%'] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (p) => setActive(Math.min(steps.length - 1, Math.floor(p * steps.length))));

  return (
    <section className="section-padding bg-brand-black border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="section-head text-center mb-12 md:mb-16">
          <span className="eyebrow mb-5">Process</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-[1.08]">
            How I <span className="text-gradient">work.</span>
          </h2>
          <p className="mt-6 text-gray-400 md:text-lg max-w-xl mx-auto leading-relaxed">
            The same four stages for every engagement, from a one-page website to a full automation system.
          </p>
        </div>

        <ol ref={listRef} className="process-steps relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {/* Connector through the step numbers on wide screens: a faint track and a gold fill tied to scroll */}
          <div aria-hidden className="hidden lg:block absolute left-[12%] right-[12%] top-36 h-px bg-white/10">
            <motion.div
              style={{ scaleX: reduce ? 1 : scrollYProgress }}
              className="absolute inset-0 origin-left bg-gradient-to-r from-brand-yellow/30 via-brand-yellow to-brand-yellow/60"
            />
          </div>
          {steps.map((step, idx) => (
            <li
              data-reveal="up"
              data-active={idx === active || undefined}
              style={{ '--i': idx } as CSSProperties}
              key={step.title}
              className="process-step group relative flex flex-col rounded-2xl border border-white/10 bg-brand-dark-gray overflow-hidden hover:border-brand-yellow/40 transition-colors"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  {...responsiveImage(step.image, '(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw')}
                  alt={step.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-dark-gray via-brand-dark-gray/40 to-transparent" />
              </div>
              <div className="relative px-6 pb-6 md:px-7 md:pb-7 -mt-6">
                <div className="flex items-center justify-between">
                  <span className="icon-nudge grid w-12 h-12 place-items-center rounded-2xl bg-brand-yellow text-black shadow-lg shadow-black/30">
                    <step.icon className="w-5 h-5" aria-hidden />
                  </span>
                  <span className="step-number grid w-9 h-9 place-items-center rounded-full border border-brand-yellow/30 bg-brand-dark-gray text-xs font-bold text-accent">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
