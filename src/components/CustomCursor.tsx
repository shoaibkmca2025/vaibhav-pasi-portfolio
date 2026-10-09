import { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

// Only show the custom cursor on devices with a real mouse (not phones or touch tablets)
const hasFinePointer = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  // Decided after mount so the prerendered HTML and first client render match
  const [enabled, setEnabled] = useState(false);
  useEffect(() => setEnabled(hasFinePointer()), []);
  
  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });
  const dotX = useSpring(0, { stiffness: 1000, damping: 50 });
  const dotY = useSpring(0, { stiffness: 1000, damping: 50 });

  useEffect(() => {
    if (!enabled) return;
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      dotX.set(e.clientX - 3);
      dotY.set(e.clientY - 3);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
    };
  }, [enabled, cursorX, cursorY, dotX, dotY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-accent rounded-full pointer-events-none z-[10000] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          scale: isHovering ? 2 : 1,
          backgroundColor: isHovering ? 'rgba(232, 200, 136, 0.1)' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-accent rounded-full pointer-events-none z-[10001] hidden md:block"
        style={{
          x: dotX,
          y: dotY,
        }}
        transition={{ type: 'spring', stiffness: 1000, damping: 50 }}
      />
    </>
  );
}
