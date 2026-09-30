import { motion } from 'motion/react';
import { Shield, Zap, Globe, Cpu } from 'lucide-react';

const pillars = [
  {
    icon: Shield,
    title: 'Identity Architecture',
    text: 'Building brands that don\'t just exist, but dominate their category through psychological resonance.'
  },
  {
    icon: Zap,
    title: 'Viral Engineering',
    text: 'Proprietary algorithmic loops designed to trigger mass distribution and organic attention.'
  },
  {
    icon: Globe,
    title: 'Global Scale',
    text: 'Integrating localized strategies into global frameworks for seamless cross-border expansion.'
  },
  {
    icon: Cpu,
    title: 'System Integration',
    text: 'Automating the growth process through high-fidelity technology and proprietary software.'
  }
];

export default function About() {
  return (
    <section className="section-padding bg-brand-black relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-yellow/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-yellow font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">The Architect</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter italic uppercase mb-8 md:mb-10 leading-[0.9]">
              Vaibhav Pasi <br />
              <span className="text-gray-500">Beyond the Code.</span>
            </h2>

            <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start mb-10">
              <div className="relative group shrink-0">
                <div className="absolute inset-0 bg-brand-yellow/20 rounded-2xl blur-xl group-hover:bg-brand-yellow/40 transition-all duration-500" />
                <img 
                  src="/vaibhav_pasi_portrait.png" 
                  alt="Vaibhav Pasi" 
                  className="relative w-32 h-32 md:w-48 md:h-48 object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 border border-white/10"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="space-y-6 text-gray-400 font-light text-base md:text-lg leading-relaxed max-w-xl">
                <p>
                  Vaibhav Pasi is the strategic force behind the marketing ecosystem that never sleeps. He doesn't just build websites; he builds digital empires that operate on the edge of the algorithms.
                </p>
                <p>
                  With a deep background in engineering and strategic marketing, Vaibhav bridges the gap between high-fidelity tech and mass-market attention. His goal is simple: total digital dominance for his clients.
                </p>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-6 sm:gap-10">
               <div>
                  <div className="text-4xl font-bold italic tracking-tighter text-brand-yellow">100+</div>
                  <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mt-1">Brands Scaled</div>
               </div>
               <div className="w-[1px] h-10 bg-white/10" />
               <div>
                  <div className="text-4xl font-bold italic tracking-tighter text-brand-yellow">30M+</div>
                  <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mt-1">Reach Generated</div>
               </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-6 md:p-8 bg-brand-dark-gray/20 border border-white/5 rounded-[2rem] hover:border-brand-yellow/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-yellow/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <pillar.icon className="w-6 h-6 text-brand-yellow" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight italic uppercase">{pillar.title}</h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  {pillar.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
