import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Target, 
  Video, 
  BarChart4, 
  Globe, 
  Music, 
  Megaphone, 
  Zap,
  ShieldCheck,
  Clapperboard,
  PieChart,
  ArrowUpRight
} from 'lucide-react';

const services = [
  {
    icon: TrendingUp,
    title: 'Marketing & Growth',
    description: 'The foundation of local and global expansion. We design frameworks that scale alongside your ambition.',
    marker: '01'
  },
  {
    icon: Megaphone,
    title: 'Paid Advertising',
    description: 'Precision-targeted ad campaigns engineered for maximum ROI through psychological triggers and data.',
    marker: '02'
  },
  {
    icon: Globe,
    title: 'Public Relations',
    description: 'Managing your digital authority and image. We position you as a leader in your respective ecosystem.',
    marker: '03'
  },
  {
    icon: Clapperboard,
    title: 'Content Production',
    description: 'High-fidelity visual storytelling. From short-form viral loops to cinematic brand narratives.',
    marker: '04'
  },
  {
    icon: Music,
    title: 'Music Marketing',
    description: 'Specialized strategies for artists to cut through the noise and dominate streaming platforms.',
    marker: '05'
  },
  {
    icon: ShieldCheck,
    title: 'Account Management',
    description: 'Daily operational excellence. We handle the minutiae so you can focus on the vision.',
    marker: '06'
  },
  {
    icon: Zap,
    title: 'Viral Engineering',
    description: 'Proprietary loops designed to trigger algorithmic spikes and mass distribution.',
    marker: '07'
  },
  {
    icon: PieChart,
    title: 'Strategy & Consulting',
    description: 'Direct high-level access to the minds behind some of the internet\'s biggest growths.',
    marker: '08'
  }
];

export default function Services() {
  return (
    <section id="services" className="section-padding relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(214,182,117,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(214,182,117,0.4) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="section-head flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-20 gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow font-bold tracking-[0.4em] uppercase text-[0.6875rem] mb-5 block">Services</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-[0.85]">
              The Full <br className="hidden sm:block" />
              <span className="text-accent">Spectrum.</span>
            </h2>
            <p className="text-gray-400 font-normal leading-relaxed text-base md:text-lg max-w-xl">
              One ecosystem. Every solution. We provide the technical and creative infrastructure required for total digital dominance.
            </p>
          </div>
          <div className="section-marker self-start md:self-auto">
            01 — ECOSYSTEM
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="group relative p-6 md:p-8 bg-brand-muted/30 hover:bg-brand-muted/60 border border-white/5 hover:border-accent/20 transition-all duration-500 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-yellow/0 group-hover:bg-brand-yellow/5 blur-[60px] transition-all duration-700 pointer-events-none" />

              {/* Marker */}
              <span className="text-[0.6875rem] font-bold tracking-[0.4em] text-gray-500 group-hover:text-accent/40 transition-colors mb-6 block">{service.marker}</span>

              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20, 
                  delay: index * 0.1 + 0.2 
                }}
                className="w-12 h-12 bg-brand-yellow/5 rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-white/5 group-hover:border-accent/40 group-hover:bg-brand-yellow transition-all duration-500 group-hover:shadow-[0_0_40px_-15px_rgba(214,182,117,0.6)]"
              >
                <service.icon className="w-5 h-5 text-accent group-hover:text-brand-black transition-colors duration-500" />
              </motion.div>

              <h3 className="text-lg font-bold mb-4 tracking-tight uppercase group-hover:text-accent transition-colors duration-300">{service.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-normal group-hover:text-gray-300 transition-colors duration-300">
                {service.description}
              </p>

              <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-[0.6875rem] font-bold tracking-[0.3em] uppercase text-accent">Learn more</span>
                <ArrowUpRight className="w-3 h-3 text-accent" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
