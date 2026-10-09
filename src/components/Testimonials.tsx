import { motion } from 'motion/react';
import { ArrowUpRight, Quote } from 'lucide-react';
import { testimonials } from '../content/proof';

// Genuine client messages from content/proof.ts, quoted as sent and linked to the original screenshot.
// Names are withheld; add a name, role and company only with the client's permission.
export default function Testimonials() {
  return (
    <section className="section-padding bg-brand-black">
      <div className="max-w-7xl mx-auto">
        <div className="section-head flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="max-w-2xl">
            <span className="eyebrow mb-5">In clients' words</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-[1.08]">
              Messages from <span className="text-accent">real clients.</span>
            </h2>
            <p className="mt-6 text-gray-400 md:text-lg leading-relaxed">
              Quoted exactly as sent. Names are kept private; the original messages are linked.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {testimonials.map((t, i) => (
            <motion.li
              key={t.quote}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.06 }}
            >
              <figure className="h-full flex flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-6 md:p-8">
                <Quote className="w-6 h-6 text-accent" aria-hidden />
                <blockquote className="mt-4 text-lg leading-relaxed text-gray-200">“{t.quote}”</blockquote>
                <figcaption className="mt-auto pt-6 flex items-center justify-between gap-4 text-sm">
                  <span className="text-gray-400">
                    {t.author}
                    {t.role ? ` · ${t.role}` : ''}
                  </span>
                  {t.proof && (
                    <a href={t.proof} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-accent link-underline">
                      Original message <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
                    </a>
                  )}
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
