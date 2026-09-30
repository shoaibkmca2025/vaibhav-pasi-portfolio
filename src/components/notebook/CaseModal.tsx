import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { unsplashAt } from '../../image';
import type { CaseFile } from './data';

interface Props {
  file: CaseFile | null;
  onClose: () => void;
}

// Full-screen "case file" dialog shared by the project deck and the metro route
export default function CaseModal({ file, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!file) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [file, onClose]);

  return (
    <AnimatePresence>
      {file && (
        <motion.div
          key={file.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[5000] bg-void/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`case-${file.id}`}
        >
          <motion.article
            initial={{ y: 60, rotate: -2, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="nb-root relative w-full max-w-3xl max-h-[88svh] overflow-y-auto bg-paper brutal"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-navy text-paper px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em]">
              <span>
                <span className="text-[#ff5b3a]">●</span> Action Req. // Case {file.id}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 hover:text-marker"
              >
                Close case <X className="w-3.5 h-3.5" />
              </button>
            </header>

            <img
              src={unsplashAt(file.image, 1200)}
              alt=""
              className="w-full aspect-[21/9] object-cover grayscale contrast-110 border-b-2 border-navy"
              referrerPolicy="no-referrer"
            />

            <div className="p-5 sm:p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink">{file.category}</span>
              <h3 id={`case-${file.id}`} className="mt-2 text-3xl md:text-4xl font-black tracking-tight leading-[1]">
                {file.title}
              </h3>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <section>
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60 mb-2">The goal</h4>
                  <p className="font-medium leading-relaxed">{file.goals}</p>
                </section>
                <section>
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60 mb-2">The play</h4>
                  <ul className="space-y-2">
                    {file.strategy.map((s) => (
                      <li key={s} className="flex gap-2 font-medium leading-relaxed">
                        <span className="text-ink">→</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {file.results.map((r) => (
                  <div key={r.label} className="brutal-sm bg-paper p-3">
                    <span className="block text-xl sm:text-2xl font-black text-ink tracking-tight">{r.value}</span>
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.12em]">{r.label}</span>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-center font-hand text-sm opacity-60">press anywhere outside to close</p>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
