import { motion } from 'motion/react';
import { FileCheck2, PhoneCall, Rocket, TrendingUp } from 'lucide-react';

// How an engagement runs, whichever service it is
const steps = [
  {
    icon: PhoneCall,
    title: 'Discovery call',
    description: 'A focused conversation about your business, goals, audience and what has or hasn\'t worked so far.',
  },
  {
    icon: FileCheck2,
    title: 'Proposal & fixed scope',
    description: 'A written plan with deliverables, timeline and price, so you know exactly what you\'re getting before we start.',
  },
  {
    icon: Rocket,
    title: 'Build & launch',
    description: 'The work gets done in short, visible milestones with your feedback at each step, then goes live.',
  },
  {
    icon: TrendingUp,
    title: 'Measure & improve',
    description: 'Tracking is in place from day one, so we review real numbers and keep improving what moves results.',
  },
];

export default function HowItWorks() {
  return (
    <section className="section-padding bg-brand-black border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="section-head text-center mb-12 md:mb-16">
          <span className="eyebrow mb-5">Process</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-[1.08]">
            How we <span className="text-accent">work together.</span>
          </h2>
          <p className="mt-6 text-gray-400 md:text-lg max-w-xl mx-auto leading-relaxed">
            The same clear four steps for every project, from a one-page website to a full automation system.
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
