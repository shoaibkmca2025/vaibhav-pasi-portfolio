import { motion } from 'motion/react';

const stats = [
  { label: 'ACTIVE CLIENTS', value: '30K+' },
  { label: 'TOTAL IMPRESSIONS', value: '20B+' },
  { label: 'CONVERSION INCREASE', value: '340%' },
  { label: 'GLOBAL REACH', value: '140+' },
];

export default function Stats() {
  return (
    <section className="bg-brand-black py-20 border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20, 
                delay: idx * 0.1 
              }}
              className="flex flex-col items-center lg:items-start group"
            >
              <div className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-2 md:mb-4 group-hover:text-brand-yellow transition-all duration-500 italic uppercase">
                {stat.value}
              </div>
              <div className="text-[8px] md:text-[11px] tracking-[0.4em] font-bold text-gray-500 uppercase border-l-2 border-brand-yellow pl-4">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
