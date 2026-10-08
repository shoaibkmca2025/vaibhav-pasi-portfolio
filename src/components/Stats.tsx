import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';

// Renders the final value (so it's in the prerendered HTML for crawlers),
// then counts up from zero the first time it scrolls into view
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion();
  const match = value.match(/^(\d+)(.*)$/);

  useEffect(() => {
    if (!inView || !match || reduceMotion || !ref.current) return;
    const [, digits, suffix] = match;
    const node = ref.current;
    const controls = animate(0, Number(digits), {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => {
        node.textContent = `${Math.round(n)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView]);

  return <span ref={ref}>{value}</span>;
}

const stats = [
  { label: 'ACTIVE CLIENTS', value: '30K+', marker: '01' },
  { label: 'TOTAL IMPRESSIONS', value: '20B+', marker: '02' },
  { label: 'CONVERSION INCREASE', value: '340%', marker: '03' },
  { label: 'GLOBAL REACH', value: '140+', marker: '04' },
];

export default function Stats() {
  return (
    <section className="bg-brand-black py-16 md:py-24 relative overflow-hidden">
      {/* Top divider */}
      <div className="section-divider mb-16 md:mb-24" />
      
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 lg:px-24 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20, 
                delay: idx * 0.1 
              }}
              className="flex flex-col items-center lg:items-start group relative"
            >
              {/* Editorial marker */}
              <span className="text-[0.6875rem] font-bold tracking-[0.4em] text-gray-500 mb-3 md:mb-4">{stat.marker}</span>
              
              <div className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-3 md:mb-4 group-hover:text-brand-yellow transition-all duration-500 italic uppercase">
                <CountUp value={stat.value} />
              </div>
              <div className="text-[0.6875rem] md:text-[0.6875rem] tracking-[0.2em] md:tracking-[0.4em] font-bold text-gray-500 uppercase border-l-2 border-brand-yellow pl-3 md:pl-4">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="section-divider mt-16 md:mt-24" />
    </section>
  );
}
