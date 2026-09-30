import { motion } from 'motion/react';
import { heroBadges, roles } from './data';

const ease = [0.16, 1, 0.3, 1] as const;

export default function NotebookHero() {
  return (
    <section id="home" className="relative min-h-svh bg-paper bg-blueprint overflow-hidden pt-28 md:pt-36 pb-28 md:pb-16 px-4 sm:px-6 md:px-10">
      {/* Corner registration marks */}
      {['top-24 left-4', 'top-24 right-4', 'bottom-6 left-4', 'bottom-6 right-4'].map((pos) => (
        <span key={pos} aria-hidden className={`absolute ${pos} hidden md:block w-5 h-5 border-ink/40 ${pos.includes('left') ? 'border-l-2' : 'border-r-2'} ${pos.includes('top') ? 'border-t-2' : 'border-b-2'}`} />
      ))}

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-end">
        {/* Name */}
        <div className="lg:col-span-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink mb-4"
          >
            File 00 // The person behind the systems
          </motion.p>
          <h1 className="sr-only">Vaibhav Pasi: digital marketing strategist, software developer and AI consultant</h1>
          <div aria-hidden className="font-black tracking-[-0.07em] leading-[0.78] lowercase select-none">
            <motion.span
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease }}
              className="block text-[22vw] lg:text-[12.5rem] text-navy"
            >
              vaibhav
            </motion.span>
            <motion.span
              initial={{ y: '100%', opacity: 0, rotate: 0 }}
              animate={{ y: 0, opacity: 1, rotate: -3 }}
              transition={{ duration: 1, delay: 0.12, ease }}
              className="inline-block text-[22vw] lg:text-[12.5rem] text-ink origin-left"
            >
              pasi<span className="text-navy">.</span>
            </motion.span>
          </div>
        </div>

        {/* Quote + roles */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:pb-6">
          <motion.div
            initial={{ opacity: 0, rotate: 0, y: 20 }}
            animate={{ opacity: 1, rotate: 2, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="relative bg-paper brutal p-5 md:p-6"
          >
            <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" />
            <p className="text-2xl md:text-3xl font-black tracking-tight leading-[1.05]">
              Strategist by day,
              <br />
              <span className="text-ink">more strategic</span>
              <br />
              <span className="font-hand font-normal text-xl">by</span> <span className="marker-swipe">4AM.</span>
            </p>
            <div className="mt-4 flex gap-2 font-mono text-xs">
              <span className="brutal-sm px-2 py-0.5 bg-paper">09:00</span>
              <span className="brutal-sm px-2 py-0.5 bg-navy text-paper">04:00</span>
            </div>
          </motion.div>

          <motion.ol
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative border-l-2 border-dashed border-ink/50 pl-5 space-y-3"
          >
            {roles.map((r, i) => (
              <li key={r.stage} className="relative">
                <span className={`absolute -left-[27px] top-1.5 w-3 h-3 border-2 border-navy ${i === roles.length - 1 ? 'bg-ink' : 'bg-paper'}`} />
                <span className="block font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">{r.stage}</span>
                <span className={`block text-lg md:text-xl font-extrabold tracking-tight ${i === roles.length - 1 ? 'text-ink' : ''}`}>
                  {r.title}
                </span>
              </li>
            ))}
          </motion.ol>
        </div>
      </div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative max-w-7xl mx-auto mt-10 md:mt-14 flex flex-wrap items-center gap-3"
      >
        {heroBadges.map((b, i) => (
          <span
            key={b}
            className="brutal-sm bg-paper px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em]"
            style={{ transform: `rotate(${[-2, 1.5, -1][i % 3]}deg)` }}
          >
            {b}
          </span>
        ))}
        <span className="ml-auto font-hand text-lg text-ink animate-float">go on, scroll down ↓</span>
      </motion.div>
    </section>
  );
}
