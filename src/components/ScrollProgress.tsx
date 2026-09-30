import { motion, useScroll, useSpring } from 'motion/react';

// Thin yellow bar across the top of the viewport showing how far down the page you are
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-brand-yellow origin-left z-[1001] shadow-[0_0_12px_rgba(245,255,0,0.6)]"
    />
  );
}
