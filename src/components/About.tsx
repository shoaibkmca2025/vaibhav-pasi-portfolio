import { motion, useInView } from 'motion/react';
import { Shield, Zap, Globe, Cpu, ArrowUpRight, Award, TrendingUp } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

/* ─── Animated Counter Hook ─── */
function useCounter(target: number, duration = 2000, inView = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, inView]);
  return count;
}

/* ─── Data ─── */
const pillars = [
  {
    icon: Shield,
    title: 'Identity Architecture',
    text: 'Building brands that don\'t just exist, but dominate their category through psychological resonance.',
    gradient: 'from-yellow-400/20 to-amber-600/5',
  },
  {
    icon: Zap,
    title: 'Viral Engineering',
    text: 'Proprietary algorithmic loops designed to trigger mass distribution and organic attention.',
    gradient: 'from-lime-400/20 to-green-600/5',
  },
  {
    icon: Globe,
    title: 'Global Scale',
    text: 'Integrating localized strategies into global frameworks for seamless cross-border expansion.',
    gradient: 'from-cyan-400/20 to-blue-600/5',
  },
  {
    icon: Cpu,
    title: 'System Integration',
    text: 'Automating the growth process through high-fidelity technology and proprietary software.',
    gradient: 'from-purple-400/20 to-violet-600/5',
  },
];

const journey = [
  { year: '2019', label: 'Started digital marketing journey' },
  { year: '2021', label: 'Scaled first brand to 1M+ reach' },
  { year: '2023', label: 'Built full-stack marketing ecosystem' },
  { year: '2025', label: 'Serving 100+ brands globally' },
];

/* ─── Component ─── */
export default function About() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' });

  const brandsCount = useCounter(100, 2000, statsInView);
  const reachCount = useCounter(30, 2000, statsInView);
  const projectsCount = useCounter(200, 2000, statsInView);

  return (
    <section className="relative overflow-hidden bg-brand-black">
      {/* ── Ambient background effects ── */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-yellow/5 blur-[160px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-yellow/3 blur-[140px] rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      {/* ─────────────── PART 1 — Hero About ─────────────── */}
      <div className="section-padding relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 md:mb-14"
          >
            <span className="text-brand-yellow font-bold tracking-[0.4em] uppercase text-[10px] border border-brand-yellow/20 px-4 py-2 rounded-full bg-brand-yellow/5 backdrop-blur-sm inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
              The Architect
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* ── Left Column: Photo + Bio ── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter italic uppercase leading-[0.9] mb-3">
                Vaibhav Pasi
              </h2>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tighter text-gray-500 italic uppercase mb-10">
                Beyond the Code.
              </h3>

              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                {/* Portrait */}
                <div className="relative group shrink-0">
                  <div className="absolute -inset-2 bg-gradient-to-br from-brand-yellow/30 via-brand-yellow/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-brand-yellow/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <img
                    src="/vaibhav_pasi_portrait.png"
                    alt="Vaibhav Pasi"
                    className="relative w-36 h-36 md:w-52 md:h-52 object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 border border-white/10"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  {/* Live badge */}
                  <div className="absolute -bottom-3 -right-3 bg-brand-black border border-brand-yellow/30 rounded-full px-3 py-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[9px] font-bold tracking-widest uppercase text-gray-300">Available</span>
                  </div>
                </div>

                {/* Bio text */}
                <div className="space-y-5 text-gray-400 font-light text-base md:text-lg leading-relaxed max-w-xl">
                  <p>
                    Vaibhav Pasi is the strategic force behind the marketing ecosystem that never sleeps. He doesn't just build websites — he architects <span className="text-white font-medium">digital empires</span> that operate at the edge of algorithms.
                  </p>
                  <p>
                    With a deep background in engineering and strategic marketing, Vaibhav bridges the gap between high-fidelity tech and mass-market attention. His mission is singular: <span className="text-brand-yellow font-medium">total digital dominance</span> for every client.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['Marketing Strategist', 'Full-Stack Developer', 'Brand Architect', 'Growth Hacker'].map(tag => (
                      <span key={tag} className="text-[10px] font-bold tracking-widest uppercase text-gray-500 border border-white/10 rounded-full px-3 py-1.5 bg-white/[0.02]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Right Column: Stats + Philosophy ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex flex-col gap-6"
            >
              {/* Stats grid */}
              <div ref={statsRef} className="grid grid-cols-3 gap-3">
                {[
                  { value: brandsCount, suffix: '+', label: 'Brands Scaled', icon: Award },
                  { value: reachCount, suffix: 'M+', label: 'Reach Generated', icon: TrendingUp },
                  { value: projectsCount, suffix: '+', label: 'Projects Delivered', icon: ArrowUpRight },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                    className="p-4 md:p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-center hover:border-brand-yellow/20 transition-all group"
                  >
                    <stat.icon className="w-4 h-4 text-brand-yellow mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="text-2xl md:text-3xl font-black italic tracking-tighter text-brand-yellow">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-[8px] md:text-[9px] font-bold tracking-widest text-gray-500 uppercase mt-1">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Philosophy quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative p-6 md:p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden"
              >
                <div className="absolute top-4 left-6 text-6xl md:text-8xl font-black italic text-brand-yellow/10 leading-none select-none">"</div>
                <p className="relative text-base md:text-lg font-light italic text-gray-300 leading-relaxed mt-6 md:mt-8">
                  I don't chase trends. I engineer systems that <span className="text-white font-medium not-italic">create</span> them. Every pixel, every algorithm, every campaign — designed for dominance.
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-brand-yellow/40" />
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-yellow/60">Vaibhav Pasi</span>
                </div>
              </motion.div>

              {/* Journey timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="p-6 md:p-8 rounded-2xl border border-white/5 bg-white/[0.02]"
              >
                <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500 mb-5">The Journey</h4>
                <div className="space-y-4">
                  {journey.map((item, idx) => (
                    <motion.div
                      key={item.year}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                      className="flex items-start gap-4 group"
                    >
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-brand-yellow/60 group-hover:bg-brand-yellow group-hover:shadow-[0_0_8px_rgba(245,255,0,0.5)] transition-all" />
                        {idx < journey.length - 1 && <div className="w-[1px] h-5 bg-white/10" />}
                      </div>
                      <div className="-mt-1">
                        <span className="text-brand-yellow font-bold text-xs tracking-wider">{item.year}</span>
                        <p className="text-gray-400 text-sm font-light mt-0.5">{item.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Divider line ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 lg:px-24">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ─────────────── PART 2 — Pillar Cards ─────────────── */}
      <div className="section-padding relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16"
          >
            <span className="text-brand-yellow font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Core Pillars</span>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter italic uppercase leading-[0.9]">
              The Framework <br />
              <span className="text-gray-500">Behind the Results.</span>
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative group"
              >
                {/* Gradient border on hover */}
                <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-br from-brand-yellow/30 via-brand-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                <div className={`relative p-7 md:p-9 bg-gradient-to-br ${pillar.gradient} border border-white/5 rounded-[2rem] transition-all duration-500 h-full`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand-yellow/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-yellow/20 transition-all duration-500">
                      <pillar.icon className="w-6 h-6 text-brand-yellow" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-700 group-hover:text-brand-yellow group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight italic uppercase group-hover:text-brand-yellow transition-colors duration-300">
                    {pillar.title}
                  </h3>
                  <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed group-hover:text-gray-400 transition-colors duration-300">
                    {pillar.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
