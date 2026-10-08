import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { contactHref } from '../contact';
import { unsplashAt, unsplashSrcSet } from '../image';

const workshopImage = 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop';

const projects = [
  {
    title: '4amglobalmedia Brand Growth',
    description: 'Scaled a boutique digital brand from zero to 100k+ followers through consistent narrative design and algorithmic precision.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
    tags: ['STRATEGY', 'GROWTH'],
    featured: true
  },
  {
    title: 'Viral Social Campaign',
    description: 'A 30-day intensive content sprint resulting in 2.5M impressions and high-intent conversions.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    tags: ['VIRAL', 'SOCIAL'],
    featured: false
  },
  {
    title: 'E-commerce Optimization',
    description: 'Re-engineering the customer journey for a premium lifestyle brand, increasing checkout conversion by 42%.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
    tags: ['CRO', 'E-COMMERCE'],
    featured: false
  },
  {
    title: 'Influencer Marketing Strategy',
    description: 'Bridging the gap between high-fashion brands and digital creators through curated, high-impact partnership frameworks.',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop',
    tags: ['INFLUENCER', 'BRAND'],
    featured: false
  }
];

export default function Projects() {
  return (
    <div className="pt-4 md:pt-32 md:min-h-screen">
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-[0.6875rem] tracking-widest mb-8 uppercase font-bold">SELECTED WORK</div>
          <h2 className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
            Marketing & Brand <br />
            <span className="text-brand-yellow glow-yellow">Excellence.</span>
          </h2>
          <p className="max-w-xl text-gray-400 font-normal mb-12 md:mb-20">
            Crafting digital narratives that convert. Explore my recent work in brand growth, influencer strategies, and e-commerce optimization.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-brand-dark-gray/20 ${
                  project.featured ? 'aspect-[4/5] sm:aspect-video md:col-span-2 md:aspect-[21/10]' : 'aspect-[4/5] sm:aspect-square md:aspect-[4/3]'
                }`}
              >
                <img
                  src={unsplashAt(project.image, 1200)}
                  srcSet={unsplashSrcSet(project.image)}
                  sizes={project.featured ? '(min-width: 1280px) 1232px, 100vw' : '(min-width: 1280px) 608px, (min-width: 768px) 50vw, 100vw'}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 pointer-coarse:grayscale-0 pointer-coarse:opacity-70 transition-all duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[0.6875rem] font-bold tracking-widest text-brand-yellow border border-brand-yellow/20 px-2 py-0.5 rounded bg-brand-yellow/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-end gap-4">
                    <div className="max-w-md">
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{project.title}</h3>
                      <p className="text-xs text-gray-400 font-normal line-clamp-2">{project.description}</p>
                    </div>
                    <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full bg-brand-yellow flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Branding Workshop section */}
      <section className="section-padding bg-black/50 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
           <div className="w-full md:w-auto flex-1 relative aspect-video rounded-3xl overflow-hidden border border-white/10">
              <img
                src={unsplashAt(workshopImage, 1200)}
                srcSet={unsplashSrcSet(workshopImage)}
                sizes="(min-width: 768px) 50vw, 100vw"
                alt="Workshop"
                className="w-full h-full object-cover grayscale brightness-50"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                  <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white]" />
                </div>
              </div>
           </div>
           
           <div className="flex-1">
              <div className="eyebrow text-[0.6875rem] tracking-widest mb-4 uppercase font-bold">EDUCATIONAL SERIES</div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">Personal Branding Workshop</h2>
              <p className="text-gray-400 font-normal mb-8 max-w-md">
                An exclusive masterclass series designed for executives to master their digital footprint and authority in the tech sector.
              </p>
              <a href={contactHref} className="btn-secondary inline-block border-brand-yellow/20 text-brand-yellow hover:bg-brand-yellow hover:text-black">
                Join Next Cohort
              </a>
           </div>
        </div>
      </section>
    </div>
  );
}
