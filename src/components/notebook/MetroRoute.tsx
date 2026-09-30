import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { caseFiles, type CaseFile } from './data';

const stations = caseFiles;
const last = stations.length - 1;

function Train({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-rumble ${className}`}>
      <div className="flex items-center gap-0.5">
        {[0, 1].map((car) => (
          <div key={car} className={`relative h-9 w-16 bg-paper border-2 border-navy ${car === 1 ? 'rounded-r-2xl' : 'rounded-l-md'}`}>
            <div className="absolute top-1.5 left-1.5 right-1.5 flex gap-1">
              {[0, 1, 2].map((w) => (
                <span key={w} className="h-2.5 flex-1 bg-ink/80 rounded-[2px]" />
              ))}
            </div>
            <span className="absolute bottom-1.5 left-0 right-0 h-1 bg-ink" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Desktop ride: the sticky route whose train position follows scroll progress
function MetroRide({ onOpen }: { onOpen: (f: CaseFile) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const trainLeft = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%'], { clamp: true });
  const [current, setCurrent] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const p = Math.min(1, Math.max(0, (v - 0.05) / 0.9));
    setCurrent(Math.round(p * last));
  });

  const next = stations[Math.min(current + 1, last)];

  return (
      <div ref={trackRef} className="relative hidden md:block" style={{ height: `${stations.length * 70}vh` }}>
        <div className="sticky top-0 h-svh flex flex-col justify-center px-10 max-w-7xl mx-auto">
          {/* LED route board */}
          <div className="flex items-center justify-between gap-6 bg-black border-2 border-paper/20 px-5 py-3 font-mono uppercase">
            <span className="text-[#ff8a3a] text-xs tracking-[0.25em]">Blue line // 4AM</span>
            <span className="text-[#ff8a3a] text-sm tracking-[0.15em] truncate">
              {current === last ? 'Terminal station' : 'Next station'}: <span className="text-[#ffd23a]">{current === last ? stations[last].station : next.station}</span>
            </span>
          </div>

          {/* Route */}
          <div className="relative mt-24 mb-16 mx-8">
            <div className="h-3 bg-ink rounded-full" />
            <motion.div className="absolute -top-12" style={{ left: trainLeft, x: '-50%' }}>
              <Train />
            </motion.div>
            {stations.map((s, i) => {
              const pct = (i / last) * 100;
              const reached = i <= current;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onOpen(s)}
                  className="group absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${pct}%` }}
                >
                  <span className={`w-7 h-7 rounded-full border-4 transition-colors duration-300 ${reached ? 'bg-paper border-ink' : 'bg-void border-paper/40'} group-hover:scale-125 transition-transform`} />
                  <span className={`absolute top-10 w-36 text-center text-sm font-extrabold leading-tight transition-colors ${i === current ? 'text-paper' : 'text-paper/50'}`}>
                    {s.station}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Current station card */}
          <AnimatePresence mode="wait">
            <motion.button
              key={stations[current].id}
              type="button"
              onClick={() => onOpen(stations[current])}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-10 self-center text-left bg-paper text-navy brutal brutal-press p-5 max-w-xl"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink">
                Station {String(current + 1).padStart(2, '0')} / {stations[current].category}
              </span>
              <span className="block mt-1 text-2xl font-black tracking-tight">{stations[current].title}</span>
              <span className="block mt-1 font-medium opacity-75">{stations[current].summary}</span>
              <span className="block mt-3 font-hand text-ink">tap to open the case file →</span>
            </motion.button>
          </AnimatePresence>

          <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">
            Built in India /// powered by caffeine /// caution: runs after 4AM
          </p>
        </div>
      </div>
  );
}

// Section 04: "4AM Line". Doors open onto a route map; scrolling drives the train between project stations
export default function MetroRoute({ onOpen }: { onOpen: (f: CaseFile) => void }) {
  const [entered, setEntered] = useState(false);

  return (
    <section id="bestwork" className="relative bg-void text-paper">
      {/* Title */}
      <div className="px-4 sm:px-6 md:px-10 pt-24 md:pt-36 pb-12 max-w-7xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-marker mb-4">Section 04</p>
        <div className="inline-block -rotate-2 bg-ink px-5 py-3 brutal border-paper shadow-[8px_8px_0_#f4efe6]">
          <h2 className="text-6xl md:text-9xl font-black tracking-[-0.06em] leading-[0.85] lowercase">
            best <span className="text-paper/60">work</span>
          </h2>
        </div>
      </div>

      {/* Doors */}
      <div className="relative px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
        <AnimatePresence>
          {!entered && (
            <motion.div
              key="doors"
              exit={{ opacity: 0, transition: { delay: 0.7, duration: 0.3 } }}
              className="relative h-[60svh] min-h-[380px] overflow-hidden border-4 border-paper/80 rounded-t-[40px] bg-navy"
            >
              {(['left', 'right'] as const).map((side) => (
                <motion.div
                  key={side}
                  exit={{ x: side === 'left' ? '-100%' : '100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                  className={`absolute top-0 bottom-0 w-1/2 ${side === 'left' ? 'left-0 border-r-2' : 'right-0 border-l-2'} border-navy bg-gradient-to-b from-[#c9ccd3] to-[#9aa0ab]`}
                >
                  <div className={`absolute top-[10%] ${side === 'left' ? 'right-6' : 'left-6'} w-[55%] h-[30%] bg-navy/70 rounded-lg border-2 border-navy`} />
                  <div className="absolute bottom-[22%] inset-x-0 h-3 bg-[#fff25c]" />
                </motion.div>
              ))}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-5 p-6 z-10">
                <div className="bg-navy text-paper border-2 border-paper/70 px-5 py-4 md:px-8 md:py-5 shadow-2xl">
                  <p className="text-xl md:text-3xl font-black">4AM लाइन में आपका स्वागत है</p>
                  <p className="mt-1 font-mono text-[10px] md:text-sm uppercase tracking-[0.3em] text-[#ffd23a]">Welcome aboard the 4AM Line</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEntered(true)}
                  className="mt-2 bg-ink text-paper brutal brutal-press px-6 py-3 font-extrabold uppercase tracking-[0.2em] text-sm"
                >
                  Enter metro →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {entered && (
        <>
          <MetroRide onOpen={onOpen} />

          {/* Phones: vertical line */}
          <ol className="md:hidden relative mx-6 my-12 border-l-4 border-ink pl-6 space-y-8">
            {stations.map((s, i) => (
              <li key={s.id} className="relative">
                <span className="absolute -left-[39px] top-1 w-6 h-6 rounded-full bg-paper border-4 border-ink" />
                <button type="button" onClick={() => onOpen(s)} className="text-left w-full bg-paper text-navy brutal-sm p-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink">Station {String(i + 1).padStart(2, '0')}</span>
                  <span className="block text-lg font-black tracking-tight">{s.title}</span>
                  <span className="block mt-1 text-sm font-medium opacity-75">{s.summary}</span>
                </button>
              </li>
            ))}
          </ol>
        </>
      )}
      <div className="h-16 md:h-24" />
    </section>
  );
}
