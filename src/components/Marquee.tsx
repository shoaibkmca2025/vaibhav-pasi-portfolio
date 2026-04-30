import { motion } from 'motion/react';

const words = [
  'VIRAL ENGINEERING',
  'ALGORITHMIC DOMINANCE',
  'GLOBAL IDENTITY',
  'MARKETING ECOSYSTEM',
  'EXOTIC STRATEGIES',
  'DIGITAL EMPIRE',
];

export default function Marquee() {
  return (
    <div className="py-20 bg-brand-yellow overflow-hidden whitespace-nowrap flex flex-col gap-6 border-y border-black -rotate-1 scale-105">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex gap-20 items-center min-w-full"
      >
        {[...words, ...words].map((word, idx) => (
          <span 
            key={idx} 
            className="text-black text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-none"
          >
            {word}
          </span>
        ))}
      </motion.div>
      <motion.div
        animate={{ x: ['-50%', '0%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="flex gap-20 items-center min-w-full opacity-50"
      >
        {[...words, ...words].map((word, idx) => (
          <span 
            key={idx} 
            className="text-black text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none outline-text"
            style={{ WebkitTextStroke: '1px black', color: 'transparent' }}
          >
            {word}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
