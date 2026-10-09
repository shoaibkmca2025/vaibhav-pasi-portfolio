import { motion } from 'motion/react';
import { trustFacts } from '../content/proof';
import LogoStrip from './LogoStrip';
import ToolLogos from './ToolLogos';

// Section 3 of the home page: verified facts only (see content/proof.ts), then the press strip and the tools used
export default function Credibility() {
  return (
    <section aria-label="Credentials" className="bg-brand-black">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 lg:px-24 py-12 md:py-16">
        <dl className="grid grid-cols-2 md:grid-cols-5 gap-px rounded-[1.75rem] overflow-hidden border border-white/10 bg-white/10">
          {trustFacts.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`flex flex-col-reverse justify-end bg-brand-black px-5 py-6 md:py-8 text-center ${i === trustFacts.length - 1 ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <dt className="mt-2 text-sm text-gray-400 leading-snug">{f.label}</dt>
              <dd className="text-3xl md:text-4xl font-bold tracking-tight text-accent">{f.value}</dd>
            </motion.div>
          ))}
        </dl>
      </div>
      <LogoStrip />
      <ToolLogos />
    </section>
  );
}
