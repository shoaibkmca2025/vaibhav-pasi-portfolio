import { useRef, useState, type PointerEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { galleryImages, visualTags } from './data';

interface Drop {
  id: number;
  x: number;
  y: number;
  src: string;
  rotate: number;
}

const SPACING = 90;
const MAX_DROPS = 7;

// "Insomniac work": moving the pointer across the section leaves a trail of work images
export default function Visuals() {
  const areaRef = useRef<HTMLDivElement>(null);
  const [drops, setDrops] = useState<Drop[]>([]);
  const last = useRef({ x: -999, y: -999 });
  const counter = useRef(0);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (Math.hypot(x - last.current.x, y - last.current.y) < SPACING) return;
    last.current = { x, y };
    const n = counter.current++;
    const drop = { id: n, x, y, src: galleryImages[n % galleryImages.length], rotate: (Math.random() - 0.5) * 16 };
    setDrops((d) => [...d.slice(-(MAX_DROPS - 1)), drop]);
  };

  return (
    <section id="visuals" className="relative bg-paper overflow-hidden">
      <div
        ref={areaRef}
        onPointerMove={onMove}
        onPointerDown={(e) => {
          last.current = { x: -999, y: -999 };
          onMove(e);
        }}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setDrops([])}
        className="relative min-h-[90svh] bg-blueprint flex flex-col items-center justify-center text-center px-4 py-28 cursor-crosshair touch-pan-y"
      >
        <AnimatePresence>
          {drops.map((d) => (
            <motion.img
              key={d.id}
              src={d.src}
              alt=""
              referrerPolicy="no-referrer"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.4 } }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute w-36 md:w-52 aspect-[4/5] object-cover brutal-sm z-0"
              style={{ left: d.x, top: d.y, x: '-50%', y: '-50%', rotate: d.rotate }}
            />
          ))}
        </AnimatePresence>

        <div className="relative z-10 pointer-events-none">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink mb-4">Section 05 // Visuals</p>
          <h2 className="text-[18vw] md:text-[10rem] font-black tracking-[-0.07em] leading-[0.8] lowercase mix-blend-multiply">
            insomniac
            <br />
            <span className="text-ink">work</span>
          </h2>
          <ul className="mt-10 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {visualTags.map((t, i) => (
              <li
                key={t}
                className="bg-paper brutal-sm px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em]"
                style={{ transform: `rotate(${((i % 5) - 2) * 1.2}deg)` }}
              >
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-10 font-hand text-lg text-ink">
            <span className="pointer-coarse:hidden">hover around to see the magic</span>
            <span className="hidden pointer-coarse:inline">tap around to see the magic</span>
          </p>
        </div>
      </div>
    </section>
  );
}
