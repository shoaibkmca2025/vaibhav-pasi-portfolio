import { motion } from 'motion/react';
import { Cpu, Zap, Globe, MessageSquare, PieChart, ShieldCheck } from 'lucide-react';

const skillCategories = [
  {
    title: 'Strategy & Marketing',
    icon: PieChart,
    skills: ['Social Media Growth', 'Content Strategy', 'Paid Media (Ads)', 'Brand Identity', 'Viral Engineering', 'CRO']
  },
  {
    title: 'Development & Tech',
    icon: Cpu,
    skills: ['React / Next.js', 'TypeScript', 'Node.js', 'iOS Development', 'Android Development', 'Cloud Infrastructure']
  },
  {
    title: 'Marketing Tech',
    icon: Zap,
    skills: ['Advanced Analytics', 'CRM Automation', 'SEO Ecosystems', 'A/B Testing', 'Funnel Optimization', 'API Integrations']
  },
  {
    title: 'Global Solutions',
    icon: Globe,
    skills: ['Scalable Systems', 'Micro-frontends', 'E-commerce Architecture', 'Web Performance', 'Multi-tenant Apps', 'Cloud Security']
  },
  {
    title: 'Communication',
    icon: MessageSquare,
    skills: ['Executive Presence', 'Client Consulting', 'Narrative Design', 'Team Leadership', 'Stakeholder Management', 'Public Speaking']
  },
  {
    title: 'Security & Trust',
    icon: ShieldCheck,
    skills: ['Data Privacy', 'Secure Auth', 'System Resilience', 'Infrastructure Auditing', 'Zero-Trust Policy', 'Compliance']
  }
];

export default function Skills() {
  return (
    <section className="section-padding bg-brand-dark-gray/10 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#D6B675 1px, transparent 1px), linear-gradient(90deg, #D6B675 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="section-head flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow font-bold tracking-[0.4em] uppercase text-[0.6875rem] mb-5 block">Toolkit</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-6">
              Marketing <span className="text-accent">Arsenal.</span>
            </h2>
            <p className="text-gray-400 font-normal leading-relaxed md:text-lg">
              A comprehensive stack of digital expertise, spanning from creative social growth to high-performance software engineering.
            </p>
          </div>
          <div className="section-marker self-start md:self-auto">
            02 — EXPERTISE
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 md:p-10 rounded-3xl bg-brand-dark-gray/20 border border-white/5 hover:border-accent/20 transition-all group"
            >
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 rounded-xl bg-brand-yellow/5 border border-accent/20 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20,
                      delay: idx * 0.1 + 0.4
                    }}
                  >
                    <category.icon className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                  </motion.div>
                </div>
                <h3 className="text-lg font-bold tracking-tight">{category.title}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[0.6875rem] font-bold tracking-wider text-gray-500 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full hover:bg-brand-yellow/10 hover:text-accent hover:border-accent/20 transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
