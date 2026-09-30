import { motion } from 'motion/react';
import { Target, Lightbulb, BarChart3, ChevronRight } from 'lucide-react';
import { unsplashAt, unsplashSrcSet } from '../image';

const caseStudies = [
  {
    id: 'growth-01',
    title: '4amglobalmedia: Scaling to 100K+',
    client: 'Internal Brand',
    category: 'Viral Growth',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    goals: 'Establish a dominant digital presence and reach 100,000 active followers within 12 months without paid acquisitions.',
    strategy: [
      'Iterative algorithmic testing for short-form video optimization.',
      'Narrative-driven content pillars focused on "Digital Sovereignty".',
      'High-frequency distribution across Twitter and Instagram ecosystems.'
    ],
    results: [
      { label: 'Followers', value: '112,400' },
      { label: 'Avg Monthly Reach', value: '1.2M' },
      { label: 'Conversion Rate', value: '8.4%' }
    ]
  },
  {
    id: 'tech-01',
    title: 'Luxury E-commerce Re-architecture',
    client: 'Elite Maison',
    category: 'Software Solutions',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1964&auto=format&fit=crop',
    goals: 'Reduce cart abandonment and improve mobile site performance for a high-ticket lifestyle brand.',
    strategy: [
      'Migration to a headless commerce architecture using Next.js.',
      'Implementation of one-click checkout and AI-driven product recommendations.',
      'Precision LCP (Largest Contentful Paint) optimization for global users.'
    ],
    results: [
      { label: 'Page Load', value: '0.9s' },
      { label: 'Checkout Conv.', value: '+42%' },
      { label: 'Mobile Sales', value: '+65%' }
    ]
  }
];

export default function CaseStudies() {
  return (
    <section className="section-padding bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6">
          <div className="max-w-2xl">
            <span className="text-brand-yellow font-bold tracking-[0.4em] uppercase text-[10px] mb-5 block">Proof</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter italic uppercase leading-[0.9] mb-6">
              Case <span className="text-gray-500">Studies.</span>
            </h2>
            <p className="text-gray-400 font-light leading-relaxed md:text-lg">
              Deep dives into the strategies that drive exponential growth. No fluff—just data, precision, and architectural mastery.
            </p>
          </div>
          <div className="section-marker self-start md:self-auto">
            03 — IMPACT
          </div>
        </div>

        <div className="space-y-20 md:space-y-32">
          {caseStudies.map((study, idx) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 md:gap-12 lg:gap-24`}
            >
              {/* Visual Side */}
              <div className="flex-1 lg:w-1/2 relative group">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/5 bg-brand-dark-gray/20">
                  <img
                    src={unsplashAt(study.image, 1200)}
                    srcSet={unsplashSrcSet(study.image)}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    alt={study.title}
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 pointer-coarse:grayscale-0 pointer-coarse:opacity-90 transition-all duration-1000"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute top-4 left-4 md:top-6 md:left-6">
                     <span className="bg-brand-yellow/10 backdrop-blur-md text-brand-yellow border border-brand-yellow/20 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                        {study.category}
                     </span>
                  </div>
                </div>

                {/* Secondary Floating Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: idx % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className={`absolute -bottom-10 ${idx % 2 === 0 ? '-right-10' : '-left-10'} w-2/3 aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-20 hidden md:block`}
                >
                  <img
                    src={unsplashAt(study.secondaryImage, 800)}
                    srcSet={unsplashSrcSet(study.secondaryImage, [480, 800, 1200])}
                    sizes="(min-width: 1024px) 33vw, 66vw"
                    alt={`${study.title} detail`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </motion.div>
              </div>

              {/* Content Side */}
              <div className="flex-1 lg:w-1/2 flex flex-col justify-center">
                <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">CLIENT: {study.client}</div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-tight md:leading-none">{study.title}</h3>
                
                <div className="space-y-10">
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-brand-yellow">
                      <Target className="w-4 h-4" />
                      <span className="text-[10px] font-bold tracking-widest uppercase">Project Goal</span>
                    </div>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                      {study.goals}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4 text-brand-yellow">
                      <Lightbulb className="w-4 h-4" />
                      <span className="text-[10px] font-bold tracking-widest uppercase">Implemented Strategy</span>
                    </div>
                    <ul className="space-y-3">
                      {study.strategy.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-300 font-light">
                          <ChevronRight className="w-4 h-4 text-brand-yellow flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-6 text-brand-yellow">
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-[10px] font-bold tracking-widest uppercase">Measurable Results</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      {study.results.map((res) => (
                        <div key={res.label}>
                          <div className="text-lg min-[400px]:text-xl sm:text-2xl font-bold tracking-tighter">{res.value}</div>
                          <div className="text-[9px] text-gray-600 font-bold uppercase tracking-wider">{res.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
