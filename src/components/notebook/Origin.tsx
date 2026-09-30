import { motion } from 'motion/react';
import { bigStat, metricStamps, originStory, philosophy, stickers, timeline, workedOn } from './data';

const reveal = {
  initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
};

const stickerStyles = [
  'bg-ink text-paper -rotate-12',
  'bg-marker text-navy rotate-6',
  'bg-navy text-paper -rotate-3',
  'bg-[#ff5b3a] text-paper rotate-12',
  'bg-[#fff25c] text-navy -rotate-6',
  'bg-paper text-ink rotate-3',
];

export default function Origin() {
  return (
    <section id="origin" className="relative bg-void text-paper overflow-hidden">
      {/* Epilogue-style opener */}
      <div className="max-w-4xl mx-auto px-5 pt-24 md:pt-36 pb-16 md:pb-24 text-center">
        <motion.p {...reveal} className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
          “If I ever write a book on how I see growth,
          <br className="hidden md:block" /> it will have <span className="glow-highlight">infinite chapters.</span>
          <br />
          <span className="opacity-60">And I'll still be shipping version two.”</span>
        </motion.p>
        <p className="mt-8 font-hand text-marker text-lg">go on, scroll down</p>
      </div>

      {/* Open notebook */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-5 pb-24 md:pb-36">
        {/* Stickers scattered around the notebook */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20 hidden md:block">
          {stickers.map((s, i) => (
            <motion.span
              key={s}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 * i }}
              className={`absolute brutal-sm px-3 py-1.5 font-black uppercase text-sm tracking-tight ${stickerStyles[i % stickerStyles.length]}`}
              style={[
                { top: '2%', left: '-1%' },
                { top: '30%', right: '-1%' },
                { top: '55%', left: '47%' },
                { bottom: '18%', left: '-1.5%' },
                { bottom: '6%', right: '6%' },
                { top: '4%', left: '46%' },
              ][i]}
            >
              {s}
            </motion.span>
          ))}
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 bg-paper text-navy shadow-[0_40px_120px_-20px_rgba(1,44,235,0.35)] rounded-sm">
          {/* Spine */}
          <div aria-hidden className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-10 -translate-x-1/2 bg-gradient-to-r from-transparent via-navy/15 to-transparent z-10" />

          {/* ── Left page ── */}
          <div className="relative bg-ruled p-6 sm:p-10 md:p-14 lg:border-r border-navy/10">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-ink border-b-2 border-ink pb-2 mb-8">
              <span>01 -- Origin</span>
              <span>The beginning</span>
            </div>

            <motion.div {...reveal} className="relative inline-block bg-[#fff25c] px-4 py-3 -rotate-2 shadow-md mb-8 max-w-xs">
              <p className="font-hand text-base leading-snug">
                I'm an open book. Here is the unfiltered timeline of how I figured things out.
              </p>
            </motion.div>

            <p className="font-hand text-ink text-lg -rotate-1 mb-2">how it all started.</p>
            <motion.h2 {...reveal} className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[-0.04em] leading-[0.95]">
              {originStory.headline.map((line) =>
                line === originStory.highlight ? (
                  <span key={line} className="block text-ink">{line}</span>
                ) : (
                  <span key={line} className="block">{line}</span>
                ),
              )}
            </motion.h2>

            <div className="mt-8 space-y-4 text-[15px] md:text-base font-medium leading-relaxed opacity-85 max-w-md">
              {originStory.micro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-8 items-start">
              {/* Polaroid */}
              <motion.figure
                initial={{ opacity: 0, rotate: 0, y: 30 }}
                whileInView={{ opacity: 1, rotate: -4, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative bg-white p-3 pb-10 shadow-xl shrink-0 w-48"
              >
                <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-2" />
                <img
                  src="/vaibhav-pasi.jpg"
                  alt="Vaibhav Pasi"
                  className="w-full aspect-square object-cover grayscale contrast-125"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="absolute bottom-2 inset-x-0 text-center font-hand text-sm">vp, early phase</figcaption>
              </motion.figure>

              <div className="font-hand text-ink text-base leading-relaxed rotate-1 border-l-2 border-ink/40 pl-4">
                {originStory.annotation.map((a) => (
                  <p key={a}>{a}</p>
                ))}
              </div>
            </div>

            {/* Mini timeline */}
            <ol className="mt-10 space-y-2 font-mono text-xs">
              {timeline.map((t) => (
                <li key={t.year} className="flex gap-3">
                  <span className="text-ink font-bold">{t.year}</span>
                  <span className="opacity-75">{t.label}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* ── Right page ── */}
          <div className="relative bg-blueprint p-6 sm:p-10 md:p-14">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-ink border-b-2 border-ink pb-2 mb-8">
              <span>02 -- One yes led to the next</span>
              <span className="hidden sm:inline">Things that happened</span>
            </div>

            {/* Big stat */}
            <motion.div {...reveal} className="flex flex-wrap items-end gap-4">
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">So far</span>
                <span className="block text-7xl md:text-8xl font-black tracking-[-0.06em] text-ink leading-none">{bigStat.value}</span>
                <span className="block font-extrabold uppercase tracking-wide text-sm mt-1">{bigStat.label}</span>
              </div>
              <p className="font-hand text-base max-w-[16ch] -rotate-2 pb-2">{bigStat.aside}</p>
            </motion.div>

            {/* Terminal card */}
            <motion.div {...reveal} className="mt-10 bg-navy text-paper brutal">
              <div className="flex items-center gap-1.5 px-4 py-2 border-b border-paper/15">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5b3a]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#fff25c]" />
                <span className="w-2.5 h-2.5 rounded-full bg-marker" />
                <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">core_philosophy.md</span>
              </div>
              <div className="p-5 md:p-6">
                <p className="text-2xl md:text-3xl font-black uppercase tracking-tight">{philosophy.title}</p>
                <p className="mt-3 text-sm md:text-[15px] font-medium leading-relaxed opacity-80">{philosophy.body}</p>
                <p className="mt-4 font-mono text-sm text-marker caret">&gt; {philosophy.tagline}</p>
              </div>
            </motion.div>

            {/* Places */}
            <motion.div {...reveal} className="relative mt-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink mb-3">// Places I've hustled at</p>
              <p className="text-lg md:text-xl font-bold leading-snug">
                {workedOn.intro} <span className="marker-swipe">{workedOn.company}</span>. Launched brands on{' '}
                {workedOn.places.map((p, i) => (
                  <span key={p}>
                    <span className="underline decoration-ink decoration-2 underline-offset-4">{p}</span>
                    {i < workedOn.places.length - 2 ? ', ' : i === workedOn.places.length - 2 ? ' & ' : '.'}
                  </span>
                ))}
              </p>
              <p className="mt-3 text-sm md:text-[15px] font-medium opacity-80 leading-relaxed">{workedOn.outro}</p>
              <span className="stamp absolute -top-4 right-0 text-ink text-xs rotate-12">Verified</span>
            </motion.div>

            {/* Metric stamps */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {metricStamps.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, scale: 1.4, rotate: 0 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: [-3, 2, -1][i] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.12, ease: 'easeOut' }}
                  className="bg-paper brutal-sm p-4"
                >
                  <span className="block text-3xl font-black tracking-tight text-ink">{m.value}</span>
                  <span className="block text-[11px] font-extrabold uppercase tracking-[0.12em]">{m.label}</span>
                  <span className="block mt-1 font-hand text-sm opacity-70">{m.note}</span>
                </motion.div>
              ))}
            </div>

            {/* PS */}
            <motion.div
              {...reveal}
              className="mt-10 relative bg-white px-5 py-4 shadow-md rotate-1"
              style={{ clipPath: 'polygon(0 4%, 6% 0, 14% 5%, 24% 1%, 35% 4%, 47% 0, 60% 4%, 72% 1%, 84% 5%, 94% 0, 100% 4%, 100% 100%, 0 100%)' }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink mb-1">PS //</p>
              <p className="text-sm md:text-[15px] font-semibold leading-relaxed">
                The goal is simple: find brands making incredible things, and help them grow with code, content and a little 4AM madness.
              </p>
              <p className="mt-2 font-hand text-ink">still figuring things out. — VP</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
