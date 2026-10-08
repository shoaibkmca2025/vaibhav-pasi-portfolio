import { motion } from 'motion/react';
import { unsplashAt, unsplashSrcSet } from '../image';

const frameworkImage = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop';

export default function Framework() {
  return (
    <section className="section-padding bg-brand-dark-gray/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-12">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 italic uppercase">
                Everything You Need. <br />
                <span className="text-brand-yellow">One Place.</span>
              </h2>
              <p className="text-gray-400 font-normal max-w-xl text-base md:text-lg">
                The Marketing Ecosystem that never sleeps. We provide the complete infrastructure required to scale from zero to global authority.
              </p>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden border border-white/10 group"
        >
          <img
            src={unsplashAt(frameworkImage, 1200)}
            srcSet={unsplashSrcSet(frameworkImage)}
            sizes="(min-width: 1280px) 1232px, 100vw"
            alt="Data Analytics Framework"
            className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 pointer-coarse:grayscale-0 pointer-coarse:opacity-80 transition-all duration-700"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-60" />
          
          {/* Dashboard overlay simulation */}
          <div className="absolute top-4 right-4 md:top-8 md:right-8 flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 md:w-32 h-1 bg-brand-yellow/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  whileInView={{ x: '0%' }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                  className="w-full h-full bg-brand-yellow"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
