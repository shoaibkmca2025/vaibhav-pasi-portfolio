import { motion } from 'motion/react';
import { MousePointer2, Settings, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: MousePointer2,
    title: 'CHOOSE YOUR PLAN',
    description: 'Select the growth framework that aligns with your current scale and future ambitions.'
  },
  {
    icon: Settings,
    title: 'WE HANDLE SETUP',
    description: 'Our team of engineers and strategists integrate our proprietary systems into your brand.'
  },
  {
    icon: TrendingUp,
    title: 'WATCH US GROW',
    description: 'The ecosystem takes over. 24/7 optimization ensures your brand never stops scaling.'
  }
];

export default function HowItWorks() {
  return (
    <section className="section-padding bg-brand-black border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter italic uppercase mb-6">How It Works</h2>
          <p className="text-gray-400 font-light max-w-xl mx-auto">
            A streamlined onboarding process designed for speed. We move as fast as the algorithms do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="text-center group"
            >
              <div className="w-20 h-20 rounded-full bg-brand-yellow/5 border border-brand-yellow/20 flex items-center justify-center mx-auto mb-10 group-hover:bg-brand-yellow/10 transition-all">
                <step.icon className="w-8 h-8 text-brand-yellow" />
              </div>
              <h3 className="text-xl font-bold tracking-widest mb-4 italic uppercase">{step.title}</h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed px-4">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
