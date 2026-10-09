import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Eye, Images, MessageCircle, Play, TrendingUp, X } from 'lucide-react';

// The original screenshots (in /public/wins), shown in the gallery and opened from each result
const screenshots = [
  { src: '/wins/analytics-90d.jpg', caption: 'Impressions & views, 90 days' },
  { src: '/wins/analytics-likes-views.jpg', caption: 'Likes & views, 28 days' },
  { src: '/wins/analytics-watch-time.jpg', caption: 'Views & watch time, 28 days' },
  { src: '/wins/reels-creator-a.jpg', caption: 'Creator A: reel views before → after' },
  { src: '/wins/reels-creator-b.jpg', caption: 'Creator B: reel views before → after' },
  { src: '/wins/profile-growth.jpg', caption: 'Profile growth on Instagram & TikTok' },
  { src: '/wins/client-messages.jpg', caption: 'Client messages' },
];
const shot = (src: string) => screenshots.findIndex((s) => s.src === src);

// Figures are taken from the screenshots above; `receipt` points at the one each figure comes from
const stats = [
  { lift: '+67,471%', metric: 'Impressions', total: '127,710', period: '90 days vs previous 90', receipt: '/wins/analytics-90d.jpg' },
  { lift: '+14,968%', metric: 'Views', total: '8,740', period: '90 days vs previous 90', receipt: '/wins/analytics-90d.jpg' },
  { lift: '+885%', metric: 'Likes', total: '463', period: '28 days vs previous 28', receipt: '/wins/analytics-likes-views.jpg' },
  { lift: '+401%', metric: 'Views', total: '14.5K', period: '28 days vs previous 28', receipt: '/wins/analytics-likes-views.jpg' },
  { lift: '+328%', metric: 'Views', total: '23.6K', period: '28 days vs previous 28', receipt: '/wins/analytics-watch-time.jpg' },
  { lift: '+300%', metric: 'Watch time', total: '613 hrs', period: '28 days vs previous 28', receipt: '/wins/analytics-watch-time.jpg' },
];

// Views per reel before working together vs after
const glowUps = [
  {
    label: 'Creator A',
    icon: Eye,
    receipt: '/wins/reels-creator-a.jpg',
    before: [433, 513, 461, 661],
    after: ['28K', '4,055', '3,038', '2,931'],
    bestBefore: 661,
    bestAfter: 28_000,
  },
  {
    label: 'Creator B',
    icon: Play,
    receipt: '/wins/reels-creator-b.jpg',
    before: [643, 1075, 991, 722],
    after: ['3.1M', '999.8K', '174.6K', '127.9K'],
    bestBefore: 1075,
    bestAfter: 3_100_000,
  },
];

const profileRows = [
  { platform: 'Instagram', metric: 'Followers', before: '74', after: '17.6K' },
  { platform: 'TikTok', metric: 'Followers', before: '1,010', after: '56.6K' },
  { platform: 'TikTok', metric: 'Likes', before: '8,771', after: '514.8K' },
];

// Client messages, quoted as sent
const messages = [
  'Also, a video absolutely blew up. 340k on insta and 850k on tik tok.... crazy',
  'Since a few days ago my reels went from around 200-300 to about 500, there’s even one at about 3k!!',
  'Our goal for this week was to get 1 reel to 5k views and my reel got up to 10.5k views! Really happy with it and it’s easily my most viewed reel.',
  'Just closed a first client for the beta offer, it’s not even ready but he wanted to start right away!',
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

type Glow = (typeof glowUps)[number];

// Staggered, overlapping chip layout lifted from the "client wins" screenshots (percent of the board)
const afterSlots = [
  { top: 19, left: 30, width: 54, z: 4 },
  { top: 27, left: 5, width: 47, z: 3 },
  { top: 31, left: 54, width: 41, z: 2 },
  { top: 39, left: 13, width: 44, z: 1 },
];
const beforeSlots = [
  { top: 66, left: 8, width: 48, z: 1 },
  { top: 68, left: 50, width: 44, z: 3 },
  { top: 75, left: 24, width: 40, z: 2 },
  { top: 81, left: 44, width: 48, z: 4 },
];
// Faint colour washes standing in for the reel thumbnails behind each count
const tints = [
  'from-violet-900/70 via-zinc-900 to-zinc-950',
  'from-red-950/80 via-zinc-950 to-black',
  'from-zinc-700/60 via-zinc-800 to-zinc-900',
  'from-stone-600/50 via-zinc-900 to-zinc-950',
];

function Chip({
  value,
  Icon,
  slot,
  tint,
  big,
  dim,
  delay,
}: {
  value: string;
  Icon: typeof Eye;
  slot: { top: number; left: number; width: number; z: number };
  tint: string;
  big?: boolean;
  dim?: boolean;
  delay: number;
  key?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute flex items-center gap-[2.5cqw] rounded-[2.2cqw] border border-white/10 bg-gradient-to-r ${tint} px-[4cqw] py-[2.6cqw] shadow-[0_18px_40px_-8px_rgba(0,0,0,0.9)] ${
        big ? 'ring-1 ring-brand-yellow/60' : ''
      }`}
      style={{ top: `${slot.top}%`, left: `${slot.left}%`, width: `${slot.width}%`, zIndex: slot.z }}
    >
      <Icon className={`shrink-0 w-[5cqw] h-[5cqw] ${dim ? 'text-white/70' : 'text-white'}`} strokeWidth={2.5} aria-hidden />
      <span className={`font-semibold tabular-nums tracking-tight ${big ? 'text-[7cqw] text-white' : dim ? 'text-[5cqw] text-white/75' : 'text-[6cqw] text-white'}`}>
        {value}
      </span>
    </motion.div>
  );
}

function WinBoard({ g, index, onProof }: { g: Glow; index: number; onProof: () => void; key?: string }) {
  const Icon = g.icon;
  const multiple = Math.round(g.bestAfter / g.bestBefore).toLocaleString('en-US');
  // Curves up from the "before" pile and lands under the "after" pile, like the hand-drawn arrows in the screenshots
  // Drawn in a 100×125 box that matches the board's 4:5 shape, so the stroke never distorts
  const path = index % 2 === 0 ? 'M64 83 C 92 70, 82 56, 56 63 C 30 70, 6 73, 12 62' : 'M48 82 C 64 75, 80 70, 72 55';
  const head = index % 2 === 0 ? 'M8 65 L 12 61 L 16.5 64' : 'M67.5 57.5 L 72 54 L 75.5 59';

  return (
    <motion.article
      {...fade(index * 0.1)}
      className="@container relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 bg-[#0b0b0b]"
    >
      {/* Striped, vignetted backdrop */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 45% 45%, rgba(255,255,255,0.14), transparent 60%), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 9%, rgba(255,255,255,0.015) 9% 18%)',
        }}
      />
      <div aria-hidden className="absolute inset-0 opacity-[0.18] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

      {/* Label + multiplier */}
      <div className="absolute top-[5cqw] left-[6cqw] right-[6cqw] flex items-start justify-between z-10">
        <div>
          <div className="text-[3.4cqw] font-bold tracking-tight text-white">{g.label}</div>
          <div className="text-[2.6cqw] font-bold uppercase tracking-[0.2em] text-white/40 mt-[0.5cqw]">Reel views</div>
        </div>
        <div className="text-right">
          <div className="text-[11cqw] font-black italic tracking-tighter leading-none text-accent glow-yellow">{multiple}×</div>
          <div className="text-[2.6cqw] font-bold uppercase tracking-[0.2em] text-white/50 mt-[1cqw]">Best reel</div>
        </div>
      </div>

      {/* Hand-drawn arrow */}
      <svg aria-hidden viewBox="0 0 100 125" className="absolute inset-0 w-full h-full z-[5] pointer-events-none">
        <motion.path
          d={path}
          fill="none"
          stroke="white"
          strokeWidth={0.7}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }}
        />
        <motion.path
          d={head}
          fill="none"
          stroke="white"
          strokeWidth={0.7}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.2, delay: 1.6 }}
        />
      </svg>

      {/* After (top) and before (bottom) piles */}
      {g.after.map((v, j) => (
        <Chip key={`a-${v}`} value={v} Icon={Icon} slot={afterSlots[j]} tint={tints[j % tints.length]} big={j === 0} delay={0.9 + j * 0.08} />
      ))}
      {g.before.map((v, j) => (
        <Chip
          key={`b-${v}`}
          value={v.toLocaleString('en-US')}
          Icon={Icon}
          slot={beforeSlots[j]}
          tint={tints[(j + 2) % tints.length]}
          dim
          delay={0.1 + j * 0.08}
        />
      ))}

      <span className="absolute left-[6cqw] top-[59%] text-[2.6cqw] font-bold uppercase tracking-[0.2em] text-white/40 z-10">Before</span>
      <span className="absolute left-[6cqw] top-[20%] text-[2.6cqw] font-bold uppercase tracking-[0.2em] text-accent z-10">After</span>

      {/* Footer line */}
      <div className="absolute bottom-[5cqw] left-[6cqw] right-[6cqw] flex flex-wrap items-center justify-between gap-2 z-10">
        <p className="text-[3.2cqw] text-gray-400 font-light">
          Best reel: <span className="text-white font-medium">{g.bestBefore.toLocaleString('en-US')}</span> →{' '}
          <span className="text-accent font-bold">{g.after[0]}</span> views
        </p>
        <ProofLink onClick={onProof} />
      </div>
    </motion.article>
  );
}

function ProofLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-accent hover:gap-2.5 transition-all"
    >
      See screenshot <ArrowUpRight className="w-3.5 h-3.5" />
    </button>
  );
}

const subHeading = 'text-[10px] font-bold tracking-[0.4em] uppercase text-gray-500 mb-6 md:mb-8';

// `hideHeader` is used on the Client Wins page, where the page header already carries the title
export default function ClientWins({ hideHeader = false }: { hideHeader?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const openSrc = (src: string) => setOpen(shot(src));
  const step = (d: number) => setOpen((i) => (i === null ? i : (i + d + screenshots.length) % screenshots.length));

  useEffect(() => {
    if (open === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <section className={`section-padding bg-brand-black relative overflow-hidden ${hideHeader ? '' : 'border-t border-white/5'}`}>
      <div className="absolute top-40 -right-40 w-[320px] h-[320px] md:w-[600px] md:h-[600px] bg-brand-yellow/5 blur-[80px] md:blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        {!hideHeader && (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow font-bold tracking-[0.4em] uppercase text-[10px] mb-5 block">Client Wins</span>
            <h2 className="flex items-end mb-6 leading-none" aria-label="Client Wins">
              <span className="text-6xl sm:text-7xl md:text-8xl font-black tracking-[-0.06em] bg-gradient-to-r from-[#d8c3a0] via-[#f1e6d0] to-white bg-clip-text text-transparent pb-2">
                client
              </span>
              <span className="font-script text-8xl sm:text-9xl md:text-[10rem] text-white ml-2 md:ml-3 -mb-3 md:-mb-5 leading-[0.8]">Wins</span>
            </h2>
            <p className="text-xl md:text-2xl font-bold tracking-tight text-white mb-3">Receipts, not promises.</p>
            <p className="text-gray-400 font-light leading-relaxed md:text-lg">
              Real numbers from real client accounts. Tap any result to see the original screenshot behind it.
            </p>
          </div>
          <div className="section-marker self-start md:self-auto">RESULTS</div>
        </div>
        )}

        {/* 01: headline lifts */}
        <p className={subHeading}>01 — The numbers</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {stats.map((s, i) => {
            const featured = i === 0;
            return (
              <motion.button
                key={`${s.metric}-${s.total}`}
                type="button"
                {...fade((i % 3) * 0.08)}
                onClick={() => openSrc(s.receipt)}
                className={`group text-left p-6 md:p-8 rounded-3xl border transition-all ${
                  featured
                    ? 'bg-brand-yellow text-black border-accent glow-box'
                    : 'bg-brand-dark-gray/20 border-white/5 hover:border-accent/30'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${featured ? 'text-black/60' : 'text-gray-500'}`}>
                    {s.metric} · {s.period}
                  </span>
                  <TrendingUp className={`w-4 h-4 shrink-0 ${featured ? 'text-black' : 'text-accent'}`} />
                </div>
                <div
                  className={`mt-4 text-5xl md:text-6xl font-black tracking-tighter italic leading-none ${
                    featured ? '' : 'text-white group-hover:text-accent transition-colors'
                  }`}
                >
                  {s.lift}
                </div>
                <div className="mt-5 flex items-end justify-between gap-3">
                  <span className={`text-lg font-bold tracking-tight ${featured ? '' : 'text-gray-300'}`}>
                    {s.total} <span className={`text-sm font-light ${featured ? 'text-black/60' : 'text-gray-500'}`}>{s.metric.toLowerCase()}</span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase ${
                      featured ? 'text-black' : 'text-accent'
                    }`}
                  >
                    Proof <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* 02: before → after reels */}
        <p className={`${subHeading} mt-20 md:mt-28`}>02 — Before → after, reel views</p>
        <div className="grid gap-6 lg:grid-cols-2">
          {glowUps.map((g, i) => (
            <WinBoard key={g.label} g={g} index={i} onProof={() => openSrc(g.receipt)} />
          ))}
        </div>

        {/* 03: profile growth + 04: messages */}
        <div className="mt-20 md:mt-28 grid gap-12 lg:gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5">
            <p className={subHeading}>03 — Profile growth</p>
            <motion.div {...fade()} className="p-6 md:p-10 rounded-3xl bg-brand-dark-gray/20 border border-white/5">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Personal-brand creator</div>
              <div className="mt-2 text-3xl md:text-4xl font-bold tracking-tighter italic uppercase leading-[0.95]">
                0 → 10K in <span className="text-accent">2 months</span>
              </div>
              <table className="mt-8 w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                    <th className="pb-3 font-bold">Platform</th>
                    <th className="pb-3 font-bold text-right">Before</th>
                    <th className="pb-3 font-bold text-right">After</th>
                  </tr>
                </thead>
                <tbody>
                  {profileRows.map((r) => (
                    <tr key={`${r.platform}-${r.metric}`} className="border-t border-white/5">
                      <td className="py-4 text-sm font-bold">
                        {r.platform} <span className="font-light text-gray-500">{r.metric.toLowerCase()}</span>
                      </td>
                      <td className="py-4 text-right text-sm text-gray-500 tabular-nums">{r.before}</td>
                      <td className="py-4 text-right text-xl font-black italic text-accent tabular-nums">{r.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 flex justify-end">
                <ProofLink onClick={() => openSrc('/wins/profile-growth.jpg')} />
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-start justify-between gap-4">
              <p className={subHeading}>04 — Straight from the DMs</p>
              <ProofLink onClick={() => openSrc('/wins/client-messages.jpg')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {messages.map((m, i) => (
                <motion.figure
                  key={m}
                  {...fade(i * 0.08)}
                  className="group p-6 rounded-3xl rounded-bl-md bg-brand-dark-gray/20 border border-white/5 hover:border-accent/30 transition-all"
                >
                  <MessageCircle className="w-5 h-5 text-accent/40 group-hover:text-accent transition-colors mb-4" aria-hidden />
                  <blockquote className="text-gray-300 font-light leading-relaxed italic">“{m}”</blockquote>
                  <figcaption className="mt-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">Client message</figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </div>

        {/* 05: the original screenshots */}
        <div className="mt-20 md:mt-28 flex items-end justify-between gap-4 mb-6 md:mb-8">
          <p className={`${subHeading} !mb-0`}>05 — The original screenshots</p>
          <span className="hidden sm:inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-gray-600">
            <Images className="w-3.5 h-3.5" /> {screenshots.length} screenshots
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-5 px-5 sm:mx-0 sm:px-0 pb-2">
          {screenshots.map((s, i) => (
            <motion.button
              key={s.src}
              type="button"
              {...fade(Math.min(i, 4) * 0.06)}
              onClick={() => setOpen(i)}
              className="group relative shrink-0 w-[62vw] sm:w-[240px] lg:w-[calc((100%-6*16px)/7)] snap-start text-left"
            >
              <div className="aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 group-hover:border-accent/50 transition-colors bg-brand-dark-gray">
                <img
                  src={s.src}
                  alt={s.caption}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <span className="mt-3 block text-[10px] font-bold tracking-widest uppercase text-gray-500 group-hover:text-accent transition-colors leading-relaxed">
                {s.caption}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Screenshot viewer */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={screenshots[open].caption}
            className="fixed inset-0 z-[5000] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-4"
          >
            <div className="relative flex items-center gap-2 sm:gap-4" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous screenshot"
                className="shrink-0 w-10 h-10 rounded-full border border-white/15 text-white hover:border-accent hover:text-accent flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <AnimatePresence mode="wait">
                <motion.img
                  key={open}
                  src={screenshots[open].src}
                  alt={screenshots[open].caption}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="max-h-[80svh] max-w-[calc(100vw-120px)] w-auto rounded-2xl border border-white/10"
                />
              </AnimatePresence>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next screenshot"
                className="shrink-0 w-10 h-10 rounded-full border border-white/15 text-white hover:border-accent hover:text-accent flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="absolute -top-3 right-9 sm:right-11 w-10 h-10 rounded-full bg-brand-yellow text-black flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 text-center">
              {screenshots[open].caption} · {open + 1} / {screenshots.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
