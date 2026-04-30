import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 italic">Trust by Design</h2>
            <p className="text-gray-400 font-light leading-relaxed">
              Collaborations with industry leaders, founders, and visionaries across the global digital landscape.
            </p>
          </div>
          <div className="text-[10px] tracking-[0.4em] font-bold text-gray-600 border-b border-gray-800 pb-2 uppercase">
            05 — VOICES
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-10 rounded-3xl bg-brand-dark-gray/10 border border-white/5 flex flex-col justify-between group hover:border-brand-yellow/30 transition-all"
            >
              <div>
                <Quote className="w-8 h-8 text-brand-yellow/20 mb-8 group-hover:text-brand-yellow/50 transition-colors" />
                <p className="text-lg text-gray-300 font-light leading-relaxed mb-12 italic">
                  "{t.quote}"
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold tracking-tight">{t.author}</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
