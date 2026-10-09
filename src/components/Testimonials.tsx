import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { unsplashAt } from '../image';

const testimonials = [
  {
    quote: "Vaibhav's ability to bridge the gap between complex software architecture and aggressive marketing growth is rare. He didn't just build our platform; he engineered our success.",
    author: "Jameson Lock",
    title: "Founder, Elite Maison",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    quote: "The viral engineering strategies implemented by Vaibhav took our brand from obscurity to a household name in the tech space in less than six months.",
    author: "Sarah Chen",
    title: "Director of Growth, Nexa Systems",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop"
  },
  {
    quote: "Precision is the word that comes to mind. Every line of code and every ad campaign was optimized for performance. A true master of his craft.",
    author: "Marcus Thorne",
    title: "CTO, Alpha Stream",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop"
  }
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-brand-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow font-bold tracking-[0.4em] uppercase text-[0.6875rem] mb-5 block">Testimonials</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter italic uppercase leading-[0.9] mb-6">
              Trust by <span className="text-gray-500">Design.</span>
            </h2>
            <p className="text-gray-400 font-normal leading-relaxed md:text-lg">
              Collaborations with industry leaders, founders, and visionaries across the global digital landscape.
            </p>
          </div>
          <div className="section-marker self-start md:self-auto">
            04 — VOICES
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-6 md:p-10 rounded-3xl bg-brand-dark-gray/10 border border-white/5 flex flex-col justify-between group hover:border-accent/30 transition-all"
            >
              <div>
                <Quote className="w-8 h-8 text-accent/20 mb-6 md:mb-8 group-hover:text-accent/50 transition-colors" />
                <p className="text-base md:text-lg text-gray-300 font-normal leading-relaxed mb-8 md:mb-12 italic">
                  "{t.quote}"
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all">
                  <img
                    src={unsplashAt(t.avatar, 96)}
                    srcSet={`${unsplashAt(t.avatar, 96)} 1x, ${unsplashAt(t.avatar, 192)} 2x`}
                    width={48}
                    height={48}
                    alt={t.author}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold tracking-tight">{t.author}</div>
                  <div className="text-[0.6875rem] text-gray-500 font-bold uppercase tracking-widest">{t.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
