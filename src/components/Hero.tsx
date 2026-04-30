import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-brand-yellow/10 rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] border border-brand-yellow/5 rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 z-10"
      >
        <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-brand-yellow px-6 py-2 border border-brand-yellow/30 bg-brand-yellow/5 rounded-full backdrop-blur-sm">
          The Ecosystem That Never Sleeps
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-[4rem] sm:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.8] max-w-5xl z-10"
      >
        Scale Your <br />
        <span className="text-brand-yellow glow-yellow">Digital Empire.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-10 text-gray-400 text-base md:text-lg max-w-2xl font-light leading-relaxed z-10 px-4"
      >
        Vaibhav Pasi orchestrates the marketing ecosystem that never sleeps. 
        From viral engineering to global identity. We deliver results, not promises.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-14 flex flex-col sm:flex-row gap-6 z-10"
      >
        <motion.a 
          href="#about"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-brand-yellow text-black px-10 py-5 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(245,255,0,0.3)] transition-all"
        >
          EXPLORE THE ECOSYSTEM
          <ArrowUpRight className="w-5 h-5" />
        </motion.a>
        <motion.a 
          href="#projects"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
          whileTap={{ scale: 0.95 }}
          className="border border-white/20 text-white px-10 py-5 font-black uppercase tracking-widest text-[11px] hover:border-white/40 transition-all"
        >
          WATCH OUR WORK
        </motion.a>
      </motion.div>

      {/* Floating social proof indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10"
      >
        <div className="text-[9px] font-bold tracking-[0.5em] text-gray-500 uppercase">Scroll to explore</div>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[1px] h-12 bg-gradient-to-b from-brand-yellow to-transparent"
        />
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-yellow/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
