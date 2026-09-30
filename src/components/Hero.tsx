import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { onLinkClick } from '../router';

export default function Hero() {
  return (
    <section className="relative min-h-svh flex flex-col items-center justify-center text-center pt-28 md:pt-32 pb-20 md:pb-28 px-5 sm:px-6 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.08, 0.15, 0.08]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] max-w-[800px] max-h-[800px] border border-brand-yellow/10 rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.04, 0.08, 0.04]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-brand-yellow/5 rounded-full hidden md:block"
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(245,255,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,255,0,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Editorial section marker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 z-10"
      >
        <span className="inline-flex items-center gap-2.5 text-[9px] sm:text-[10px] md:text-xs font-extrabold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-brand-yellow px-5 sm:px-6 py-2.5 border border-brand-yellow/20 bg-brand-yellow/5 rounded-full backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
          The Ecosystem That Never Sleeps
        </span>
      </motion.div>

      {/* Main headline */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl min-[400px]:text-6xl sm:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.85] sm:leading-[0.8] max-w-6xl z-10 uppercase"
      >
        Scale Your <br />
        <span className="text-brand-yellow glow-yellow">Digital Empire.</span>
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-8 md:mt-12 text-gray-400 text-base md:text-xl max-w-2xl font-light leading-relaxed z-10 sm:px-4"
      >
        Vaibhav Pasi orchestrates the marketing ecosystem that never sleeps. 
        From viral engineering to global identity. We deliver <span className="text-white font-medium">results, not promises.</span>
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12 md:mt-16 flex flex-col sm:flex-row gap-4 sm:gap-5 z-10 w-full sm:w-auto"
      >
        <motion.a 
          href="/services"
          onClick={onLinkClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-brand-yellow text-black px-10 sm:px-12 py-5 font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(245,255,0,0.3)] transition-all rounded-full"
        >
          EXPLORE THE ECOSYSTEM
          <ArrowUpRight className="w-5 h-5" />
        </motion.a>
        <motion.a 
          href="/work"
          onClick={onLinkClick}
          whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.05)' }}
          whileTap={{ scale: 0.97 }}
          className="border border-white/20 text-white px-10 sm:px-12 py-5 font-black uppercase tracking-[0.2em] text-[11px] text-center hover:border-white/40 transition-all rounded-full"
        >
          WATCH OUR WORK
        </motion.a>
      </motion.div>

      {/* Bottom editorial elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-5 sm:left-8 md:left-12 lg:left-24 hidden md:flex items-center gap-6 z-10"
      >
        <div className="text-[9px] font-bold tracking-[0.4em] text-gray-600 uppercase">VP © 2026</div>
        <div className="w-12 h-[1px] bg-white/10" />
        <div className="text-[9px] font-bold tracking-[0.4em] text-gray-600 uppercase">India</div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 right-5 sm:right-8 md:right-12 lg:right-24 hidden md:flex flex-col items-center gap-4 z-10"
      >
        <div className="text-[9px] font-bold tracking-[0.5em] text-gray-500 uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll</div>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[1px] h-16 bg-gradient-to-b from-brand-yellow to-transparent"
        />
      </motion.div>

      {/* Decorative elements */}
      {/* Large blurs are costly to paint on phone GPUs, so they're smaller and softer below md */}
      <div className="absolute top-1/4 -left-20 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-brand-yellow/5 rounded-full blur-[80px] md:blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-brand-yellow/8 rounded-full blur-[80px] md:blur-[150px] pointer-events-none" />
    </section>
  );
}
