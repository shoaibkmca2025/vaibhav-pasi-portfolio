import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { contactHref } from '../contact';

export default function CTASection() {
  return (
    <section className="py-20 md:py-40 px-5 sm:px-6 overflow-hidden">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto bg-brand-yellow rounded-[2rem] md:rounded-[3rem] p-10 sm:p-14 md:p-28 text-black relative overflow-hidden"
      >
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 relative z-10">
          <div className="max-w-2xl">
            <span className="text-[0.6875rem] font-bold tracking-[0.4em] uppercase text-black/50 mb-6 block">Ready to Scale?</span>
            <h2 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8">
              Your Growth <br />
              Shouldn't Sleep.
            </h2>
            <p className="text-black/60 font-medium text-base sm:text-lg md:text-xl max-w-xl leading-relaxed">
              Neither do we. Join the 30,000+ brands and creators who have integrated our ecosystem to achieve total digital dominance.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <a href={contactHref} className="w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 bg-black text-brand-yellow rounded-full flex flex-col items-center justify-center font-black tracking-[0.2em] text-[0.6875rem] gap-3 hover:scale-105 transition-all group relative overflow-hidden">
              {/* Rotating border */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-1 rounded-full border border-dashed border-brand-yellow/20"
              />
              <span className="uppercase relative z-10">Scale Now</span>
              <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
