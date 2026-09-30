import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { unsplashAt } from '../../image';
import { caseFiles, type CaseFile } from './data';

// Section 03: a stacked deck of case cards that fans out when it scrolls into view
export default function ProjectDeck({ onOpen }: { onOpen: (f: CaseFile) => void }) {
  const deckRef = useRef<HTMLDivElement>(null);
  const spread = useInView(deckRef, { once: true, margin: '-25% 0px' });
  // The overlapping fan only makes sense side by side; phones get a plain stack
  const [wide, setWide] = useState(false);
  // Overlap needed so the fanned-out cards still fit the container width
  const [gap, setGap] = useState(-16);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => {
      setWide(mq.matches);
      const deck = deckRef.current;
      const card = deck?.firstElementChild as HTMLElement | null;
      if (!deck || !card) return;
      const n = caseFiles.length;
      setGap(Math.min(-16, (deck.clientWidth - n * card.offsetWidth) / (n - 1)));
    };
    sync();
    mq.addEventListener('change', sync);
    window.addEventListener('resize', sync);
    return () => {
      mq.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  return (
    <section id="projects" className="relative bg-paper bg-blueprint overflow-hidden py-24 md:py-36 px-4 sm:px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-ink border-b-2 border-ink pb-2">
          <span>Section 03 / Alpha</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-marker rounded-full animate-pulse" /> System_Active
          </span>
        </div>

        <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h2 className="text-[20vw] md:text-[11rem] font-black tracking-[-0.07em] leading-[0.8] lowercase">
            pro<span className="text-ink">jects</span>
          </h2>
          <div className="relative bg-[#fff25c] -rotate-3 px-5 py-4 shadow-md max-w-xs self-start md:self-auto">
            <span className="tape -top-3 left-6 -rotate-6" />
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] mb-1">A quick note</p>
            <p className="font-hand leading-snug">
              Worth a look. But if you're short on time, jump straight to the next section (Best Work).
            </p>
          </div>
        </div>

        <div
          ref={deckRef}
          className="mt-16 flex flex-col md:flex-row md:justify-center gap-6 md:gap-0"
        >
          {caseFiles.map((f, i) => {
            const mid = (caseFiles.length - 1) / 2;
            const rotate = (i - mid) * 4;
            return (
              <motion.button
                key={f.id}
                type="button"
                onClick={() => onOpen(f)}
                initial={false}
                animate={
                  wide
                    ? {
                        marginLeft: i === 0 ? 0 : spread ? gap : gap - 110,
                        rotate: spread ? rotate : rotate / 3,
                        y: spread ? Math.abs(i - mid) * 14 : 0,
                      }
                    : { marginLeft: 0, rotate: i % 2 ? 1 : -1, y: 0 }
                }
                transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.25 }}
                whileHover={wide ? { y: -24, rotate: 0, zIndex: 50, transition: { duration: 0.25 } } : undefined}
                style={{ zIndex: i }}
                className="group relative w-full md:w-64 lg:w-72 shrink-0 text-left bg-paper brutal cursor-pointer"
              >
                <div className="flex items-center justify-between px-3 py-2 border-b-2 border-navy font-mono text-[10px] uppercase tracking-[0.2em]">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-ink">{f.category}</span>
                </div>
                <img
                  src={unsplashAt(f.image, 600)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border-b-2 border-navy"
                />
                <div className="p-4">
                  <h3 className="text-lg font-black tracking-tight leading-tight">{f.title}</h3>
                  <p className="mt-2 text-sm font-medium opacity-75 leading-snug">{f.summary}</p>
                  <span className="mt-4 inline-block font-hand text-ink">click to expand →</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
