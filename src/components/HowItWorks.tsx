import { motion } from 'motion/react';
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

        <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {/* Connector running through the step numbers on wide screens */}
          <div aria-hidden className="hidden lg:block absolute left-[12%] right-[12%] top-36 h-px bg-gradient-to-r from-transparent via-brand-yellow/40 to-transparent" />
          {steps.map((step, idx) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5, delay: idx * 0.06 }}
              className="group relative flex flex-col rounded-2xl border border-white/10 bg-brand-dark-gray overflow-hidden hover:border-brand-yellow/40 transition-colors"
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
                  <span className="grid w-12 h-12 place-items-center rounded-2xl bg-brand-yellow text-black shadow-lg shadow-black/30">
                    <step.icon className="w-5 h-5" aria-hidden />
                  </span>
                  <span className="grid w-9 h-9 place-items-center rounded-full border border-brand-yellow/30 bg-brand-dark-gray text-xs font-bold text-accent">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
