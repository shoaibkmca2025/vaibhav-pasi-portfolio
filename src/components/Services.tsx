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
  PieChart
} from 'lucide-react';

const services = [
  {
    icon: TrendingUp,
    title: 'Marketing & Growth',
    description: 'The foundation of local and global expansion. We design frameworks that scale alongside your ambition.'
  },
  {
    icon: Megaphone,
    title: 'Paid Advertising',
    description: 'Precision-targeted ad campaigns engineered for maximum ROI through psychological triggers and data.'
  },
  {
    icon: Globe,
    title: 'Public Relations',
    description: 'Managing your digital authority and image. We position you as a leader in your respective ecosystem.'
  },
  {
    icon: Clapperboard,
    title: 'Content Production',
    description: 'High-fidelity visual storytelling. From short-form viral loops to cinematic brand narratives.'
  },
  {
    icon: Music,
    title: 'Music Marketing',
    description: 'Specialized strategies for artists to cut through the noise and dominate streaming platforms.'
  },
  {
    icon: ShieldCheck,
    title: 'Account Management',
    description: 'Daily operational excellence. We handle the minutiae so you can focus on the vision.'
  },
  {
    icon: Zap,
    title: 'Viral Engineering',
    description: 'Proprietary loops designed to trigger algorithmic spikes and mass distribution.'
  },
  {
    icon: PieChart,
    title: 'Strategy & Consulting',
    description: 'Direct high-level access to the minds behind some of the internet\'s biggest growths.'
  }
];

export default function Services() {
  return (
    <section id="services" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 uppercase italic">The Full Spectrum</h2>
            <p className="text-gray-400 font-light leading-relaxed">
              One ecosystem. Every solution. We provide the technical and creative infrastructure required for total digital dominance.
            </p>
          </div>
          <div className="text-[10px] tracking-[0.4em] font-bold text-gray-600 border-b border-gray-800 pb-2">
            01 — ECOSYSTEM
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="p-6 md:p-8 bg-brand-dark-gray/20 hover:bg-brand-dark-gray/40 border border-white/5 hover:border-brand-yellow/30 transition-all group rounded-[2rem]"
            >
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
                className="w-14 h-14 bg-brand-yellow/5 rounded-3xl flex items-center justify-center mb-6 md:mb-8 border border-white/5 group-hover:border-brand-yellow/50 group-hover:bg-brand-yellow transition-all duration-500 group-hover:shadow-[0_0_40px_-15px_rgba(245,255,0,0.6)]"
              >
                <service.icon className="w-6 h-6 text-brand-yellow group-hover:text-brand-black transition-colors duration-500" />
              </motion.div>
              <h3 className="text-lg font-bold mb-4 tracking-tight">{service.title}</h3>
              <p className="text-sm md:text-[11px] text-gray-500 leading-relaxed font-light">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
