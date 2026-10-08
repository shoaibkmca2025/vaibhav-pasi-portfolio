import { motion } from 'motion/react';
import { Users, Play, Radio, ArrowUpRight } from 'lucide-react';
import { onLinkClick } from '../router';

const sections = [
  {
    title: "Community & Strategy",
    description: "Direct access to high-net-worth networks and specialized digital growth strategies. We build the room so you can be in it.",
    icon: Users,
    color: "bg-blue-500/10",
    textColor: "text-blue-400"
  },
  {
    title: "Watch Us Work",
    description: "Experience the process behind the virality. Our production house operates 24/7 to maintain algorithmic dominance.",
    icon: Play,
    color: "bg-brand-yellow/10",
    textColor: "text-brand-yellow"
  },
  {
    title: "Creator Ecosystem",
    description: "Where creators blow up. We identify talent and engineer the frameworks required for explosive market entry.",
    icon: Radio,
    color: "bg-purple-500/10",
    textColor: "text-purple-400"
  }
];

export default function Scaling() {
  return (
    <section id="scaling" className="section-padding bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter italic uppercase mb-8">
            Everything You Need <br />
            <span className="text-gray-500">To Scale.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative p-6 md:p-10 border border-white/5 bg-brand-dark-gray/10 hover:bg-brand-dark-gray/20 hover:border-brand-yellow/20 transition-all rounded-[2rem] overflow-hidden"
            >
              <div className={`w-16 h-16 ${section.color} rounded-2xl flex items-center justify-center mb-8 md:mb-10 group-hover:rotate-[10deg] transition-transform duration-500`}>
                <section.icon className={`w-8 h-8 ${section.textColor}`} />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 tracking-tight uppercase italic">{section.title}</h3>
              <p className="text-gray-400 font-normal leading-relaxed mb-8 md:mb-10">
                {section.description}
              </p>

              <a href="/contact" onClick={onLinkClick} className="py-2 -my-2 flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-brand-yellow hover:gap-4 transition-all">
                LEARN MORE <ArrowUpRight className="w-3 h-3" />
              </a>
              
              {/* Decorative background element */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-yellow/5 blur-[100px] group-hover:bg-brand-yellow/10 transition-all" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
