import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Eye, Images, MessageCircle, Play, TrendingUp, X } from 'lucide-react';

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

function ProofLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-brand-yellow hover:gap-2.5 transition-all"
    >
      See screenshot <ArrowUpRight className="w-3.5 h-3.5" />
    </button>
  );
}

const subHeading = 'text-[10px] font-bold tracking-[0.4em] uppercase text-gray-500 mb-6 md:mb-8';

export default function ClientWins() {
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
    <section className="section-padding bg-brand-black border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-40 -right-40 w-[320px] h-[320px] md:w-[600px] md:h-[600px] bg-brand-yellow/5 blur-[80px] md:blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6">
          <div className="max-w-2xl">
            <span className="text-brand-yellow font-bold tracking-[0.4em] uppercase text-[10px] mb-5 block">Client Wins</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter italic uppercase leading-[0.9] mb-6">
              Receipts, <span className="text-gray-500">Not Promises.</span>
            </h2>
            <p className="text-gray-400 font-light leading-relaxed md:text-lg">
              Real numbers from real client accounts. Tap any result to see the original screenshot behind it.
            </p>
          </div>
          <div className="section-marker self-start md:self-auto">RESULTS</div>
        </div>

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
                    ? 'bg-brand-yellow text-black border-brand-yellow glow-box'
                    : 'bg-brand-dark-gray/20 border-white/5 hover:border-brand-yellow/30'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${featured ? 'text-black/60' : 'text-gray-500'}`}>
                    {s.metric} · {s.period}
                  </span>
                  <TrendingUp className={`w-4 h-4 shrink-0 ${featured ? 'text-black' : 'text-brand-yellow'}`} />
                </div>
                <div
                  className={`mt-4 text-5xl md:text-6xl font-black tracking-tighter italic leading-none ${
                    featured ? '' : 'text-white group-hover:text-brand-yellow transition-colors'
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
                      featured ? 'text-black' : 'text-brand-yellow'
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
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          {glowUps.map((g, i) => {
            const Icon = g.icon;
            const multiple = Math.round(g.bestAfter / g.bestBefore).toLocaleString('en-US');
            return (
              <motion.article key={g.label} {...fade(i * 0.1)} className="p-6 md:p-10 rounded-3xl bg-brand-dark-gray/20 border border-white/5">
                <div className="flex items-start justify-between gap-4 mb-8">
                  <div>
                    <div className="text-2xl font-bold tracking-tight">{g.label}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Top 4 reels</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl md:text-4xl font-black italic tracking-tighter text-brand-yellow glow-yellow">{multiple}×</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Best reel</div>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-5">
                  <div>
                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-3">Before</div>
                    <ul className="space-y-2">
                      {g.before.map((v) => (
                        <li key={v} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/5 text-sm text-gray-500 tabular-nums">
                          <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden /> {v.toLocaleString('en-US')}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ArrowRight className="w-6 h-6 text-brand-yellow" aria-hidden />
                  <div>
                    <div className="text-[10px] text-brand-yellow font-bold uppercase tracking-widest mb-3">After</div>
                    <ul className="space-y-2">
                      {g.after.map((v, j) => (
                        <li
                          key={v}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold tabular-nums ${
                            j === 0 ? 'bg-brand-yellow text-black text-base md:text-lg' : 'bg-white/5 border border-white/10 text-white text-sm'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden /> {v}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-gray-400 font-light">
                    Best reel went from <span className="text-white font-medium">{g.bestBefore.toLocaleString('en-US')}</span> views to{' '}
                    <span className="text-brand-yellow font-bold">{g.after[0]}</span>.
                  </p>
                  <ProofLink onClick={() => openSrc(g.receipt)} />
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* 03: profile growth + 04: messages */}
        <div className="mt-20 md:mt-28 grid gap-12 lg:gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5">
            <p className={subHeading}>03 — Profile growth</p>
            <motion.div {...fade()} className="p-6 md:p-10 rounded-3xl bg-brand-dark-gray/20 border border-white/5">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Personal-brand creator</div>
              <div className="mt-2 text-3xl md:text-4xl font-bold tracking-tighter italic uppercase leading-[0.95]">
                0 → 10K in <span className="text-brand-yellow">2 months</span>
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
                      <td className="py-4 text-right text-xl font-black italic text-brand-yellow tabular-nums">{r.after}</td>
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
                  className="group p-6 rounded-3xl rounded-bl-md bg-brand-dark-gray/20 border border-white/5 hover:border-brand-yellow/30 transition-all"
                >
                  <MessageCircle className="w-5 h-5 text-brand-yellow/40 group-hover:text-brand-yellow transition-colors mb-4" aria-hidden />
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
              <div className="aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 group-hover:border-brand-yellow/50 transition-colors bg-brand-dark-gray">
                <img
                  src={s.src}
                  alt={s.caption}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <span className="mt-3 block text-[10px] font-bold tracking-widest uppercase text-gray-500 group-hover:text-brand-yellow transition-colors leading-relaxed">
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
                className="shrink-0 w-10 h-10 rounded-full border border-white/15 text-white hover:border-brand-yellow hover:text-brand-yellow flex items-center justify-center transition-colors"
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
                className="shrink-0 w-10 h-10 rounded-full border border-white/15 text-white hover:border-brand-yellow hover:text-brand-yellow flex items-center justify-center transition-colors"
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
