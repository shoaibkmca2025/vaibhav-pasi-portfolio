import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Quote } from 'lucide-react';
import { testimonials } from '../content/proof';

// Genuine client messages from content/proof.ts, quoted as sent and linked to the original screenshot.
// Names are withheld; add a name, role and company only with the client's permission.
export default function Testimonials() {
  // Phones: one message at a time in a swipeable row with Previous/Next buttons (never autoplays).
  // Tablets and up: the full grid, so every message stays readable at once.
  const listRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const first = list.firstElementChild as HTMLElement | null;
        if (first) setIndex(Math.round(list.scrollLeft / (first.offsetWidth + 16)));
      });
    };
    list.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      list.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  const go = (to: number) => {
    const list = listRef.current;
    const item = list?.children[Math.max(0, Math.min(testimonials.length - 1, to))] as HTMLElement | undefined;
    if (!list || !item) return;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.scrollTo({ left: item.offsetLeft - list.offsetLeft, behavior: smooth ? 'smooth' : 'auto' });
  };

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

        <ul
          ref={listRef}
          aria-label="Client messages"
          className="flex md:grid md:grid-cols-2 gap-4 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth -mx-5 px-5 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 pb-2 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t, i) => (
            <li
              data-reveal="up"
              style={{ '--i': (i % 2) } as CSSProperties}
              key={t.quote}
              aria-label={`Message ${i + 1} of ${testimonials.length}`}
              className="shrink-0 w-[86%] sm:w-[70%] md:w-auto snap-center"
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
            </li>
          ))}
        </ul>

        {/* Manual controls, phones only */}
        <div className="mt-6 flex items-center justify-center gap-4 md:hidden">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Previous message"
            className="grid w-11 h-11 place-items-center rounded-full border border-white/15 text-white transition-[opacity,border-color,transform] active:scale-95 disabled:opacity-30 hover:border-brand-yellow/50"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
          </button>
          <p className="min-w-[4.5rem] text-center text-sm tabular-nums text-gray-400" aria-live="polite">
            {index + 1} / {testimonials.length}
          </p>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index === testimonials.length - 1}
            aria-label="Next message"
            className="grid w-11 h-11 place-items-center rounded-full border border-white/15 text-white transition-[opacity,border-color,transform] active:scale-95 disabled:opacity-30 hover:border-brand-yellow/50"
          >
            <ArrowRight className="w-4 h-4" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
