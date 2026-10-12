import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';

// Small floating control that appears once the visitor is a screen and a half down the page.
// Sits above the WhatsApp button; returns focus to the top of the page for keyboard users.
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setShow(window.scrollY > window.innerHeight * 1.5));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
    };
  }, []);

  const toTop = () => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
    document.getElementById('main')?.focus({ preventScroll: true });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
          className="fixed z-[900] right-[1.375rem] sm:right-[1.875rem] bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.25rem)] sm:bottom-[6.25rem] grid w-11 h-11 place-items-center rounded-full border border-white/15 bg-brand-dark-gray/90 backdrop-blur text-white shadow-lg shadow-black/30 hover:border-brand-yellow/50 hover:text-accent active:scale-95 transition-colors"
        >
          <ArrowUp className="w-4 h-4" aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
