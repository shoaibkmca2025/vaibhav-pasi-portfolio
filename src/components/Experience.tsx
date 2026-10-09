import { motion } from 'motion/react';
import { Zap, TrendingUp } from 'lucide-react';
import { unsplashAt, unsplashSrcSet } from '../image';

const experiences = [
  {
    company: '4amglobalmedia',
    role: 'FOUNDING ENGINEER & STRATEGIST',
    period: '2022 — PRESENT',
    description: 'Pioneering the intersection of technical architecture and brand growth. Engineered high-performance digital ecosystems that scale with user demand.',
    achievement: '400%',
    metric: 'USER GROWTH ARCHITECTURE',
    icon: TrendingUp,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
    active: true
  },
  {
    company: 'NextGen Systems',
    role: 'SENIOR FULL STACK LEAD',
    period: '2020 — 2022',
    description: 'Spearheaded the migration of legacy infrastructure to a modular, micro-frontend architecture, reducing deployment latency by 60%.',
    achievement: '0.8s',
    metric: 'LCP OPTIMIZATION LEAD',
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop',
    active: false
  }
];

export default function Experience() {
  return (
    <div className="pt-4 md:pt-32 md:min-h-screen">
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-[0.6875rem] tracking-widest mb-8 uppercase font-bold">CHRONOLOGY OF IMPACT</div>
          <h2 className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tighter mb-12 md:mb-20 leading-[0.9]">
            Engineering Growth <br />
            Through <span className="text-accent glow-yellow">Precision.</span>
          </h2>

          <div className="relative border-l border-white/5 ml-1 md:ml-0 md:pl-0 pl-6 space-y-16 md:space-y-32">
            {experiences.map((exp, index) => (
              <div key={exp.company} className="relative">
                {/* Node */}
                <div className={`absolute left-[-31px] md:left-[-5px] top-4 w-3 h-3 rounded-full ${
                  exp.active ? 'bg-accent shadow-[0_0_15px_rgba(214,182,117,0.45)]' : 'bg-gray-800'
                }`} />

                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-6 md:p-10 rounded-3xl bg-brand-dark-gray/20 border border-white/5"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-8 md:mb-10">
                      <div>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 tracking-tighter break-words">{exp.company}</h3>
                        <div className="text-[0.6875rem] tracking-widest text-accent font-bold uppercase">{exp.role}</div>
                      </div>
                      <div className="shrink-0 text-xs font-bold text-gray-500 tracking-widest">{exp.period}</div>
                    </div>
                    
                    <p className="text-gray-400 font-normal text-sm mb-8 md:mb-12 leading-relaxed">
                      {exp.description}
                    </p>

                    <div className="pt-8 border-t border-white/5">
                      <div className="text-[0.6875rem] tracking-widest text-gray-500 font-bold mb-4 uppercase">KEY ACHIEVEMENTS</div>
                      <div className="flex items-center gap-4">
                        <exp.icon className="w-6 h-6 text-accent" />
                        <div>
                          <div className="text-3xl font-bold text-white">{exp.achievement}</div>
                          <div className="text-[0.6875rem] tracking-wider text-gray-500 font-bold uppercase">{exp.metric}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="aspect-video lg:aspect-square rounded-3xl overflow-hidden grayscale border border-white/10"
                  >
                    <img
                      src={unsplashAt(exp.image, 1200)}
                      srcSet={unsplashSrcSet(exp.image)}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      alt={exp.company}
                      className="w-full h-full object-cover opacity-60"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
