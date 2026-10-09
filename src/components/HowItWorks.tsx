import { motion } from 'motion/react';
import { Map as MapIcon, Rocket, Search, TrendingUp } from 'lucide-react';

// How an engagement runs, whichever service it is
const steps = [
  { icon: Search, title: 'Discover', description: 'Understand goals, audience, and challenges.' },
  { icon: MapIcon, title: 'Strategize', description: 'Define the scope, priorities, and execution plan.' },
  { icon: Rocket, title: 'Execute', description: 'Deliver the agreed marketing, development, or automation work.' },
  { icon: TrendingUp, title: 'Optimize', description: 'Measure performance and improve based on real data.' },
];

export default function HowItWorks() {
  return (
    <section className="section-padding bg-brand-black border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="section-head text-center mb-12 md:mb-16">
          <span className="eyebrow mb-5">Process</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-[1.08]">
            How I <span className="text-accent">work.</span>
          </h2>
          <p className="mt-6 text-gray-400 md:text-lg max-w-xl mx-auto leading-relaxed">
            The same four stages for every engagement, from a one-page website to a full automation system.
          </p>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {steps.map((step, idx) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="relative p-6 md:p-7 rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <div className="flex items-center justify-between">
                <span className="grid w-12 h-12 place-items-center rounded-2xl bg-brand-yellow text-black">
                  <step.icon className="w-5 h-5" aria-hidden />
                </span>
                <span className="text-sm font-bold tracking-[0.2em] text-gray-500">{String(idx + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-gray-400 leading-relaxed">{step.description}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
