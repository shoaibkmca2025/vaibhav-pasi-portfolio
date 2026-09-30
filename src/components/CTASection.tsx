import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { contactHref } from '../contact';

export default function CTASection() {
  return (
    <section className="py-16 md:py-32 px-5 sm:px-6 overflow-hidden">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto bg-brand-yellow rounded-[2rem] md:rounded-[3rem] p-8 sm:p-12 md:p-24 text-black relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tighter leading-[0.85] italic uppercase mb-8">
              Your Growth <br />
              Shouldn't Sleep.
            </h2>
            <p className="text-black/70 font-medium text-base sm:text-lg md:text-xl max-w-xl">
              Neither do we. Join the 30,000+ brands and creators who have integrated our ecosystem to achieve total digital dominance.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <a href={contactHref} className="w-36 h-36 sm:w-40 sm:h-40 md:w-56 md:h-56 bg-black text-brand-yellow rounded-full flex flex-col items-center justify-center font-bold tracking-widest text-xs gap-3 hover:scale-105 transition-all group">
              <span className="uppercase">Scale Now</span>
              <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
