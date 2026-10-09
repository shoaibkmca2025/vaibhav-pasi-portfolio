import { motion } from 'motion/react';
import { ArrowUpRight, Newspaper } from 'lucide-react';

export const featureHeadline = 'Vaibhav Pasi: Visionary Entrepreneur Redefining Digital Marketing Through 4AM Global Media';

// Logos live in /public/press. Most are dark artwork, so they sit on a light plate;
// "dark" is for logos drawn in white.
// Publications without a local logo use a text-only fallback (textOnly: true).
export const publications = [
  {
    name: 'Dailyhunt',
    href: 'https://m.dailyhunt.in/news/india/english/punjabbytes-epaper-dhb7faabc774324241990251ac4336f653/-newsid-dhb7faabc774324241990251ac4336f653_9e048369b0044e30a55581dd34c09d1f',
    logo: '/press/dailyhunt.png',
    wordmark: true,
  },
  {
    name: 'ESHN News',
    href: 'https://eshnnews.com/2026/05/19/vaibhav-pasi-the-visionary-entrepreneur-redefining-digital-marketing-through-4am-global-media/',
    logo: '/press/eshn-news.png',
    plate: 'dark',
  },
  {
    name: 'Prime News of India',
    href: 'https://primenewsofindia.com/2026/05/19/vaibhav-pasi-the-visionary-entrepreneur-redefining-digital-marketing-through-4am-global-media/',
    logo: '/press/prime-news-of-india.png',
  },
  {
    name: 'Indian Prime Bulletin',
    href: 'https://indianprimebulletin.com/2026/05/19/vaibhav-pasi-the-visionary-entrepreneur-redefining-digital-marketing-through-4am-global-media/',
    logo: '/press/indian-prime-bulletin.png',
  },
  {
    name: 'Smart Bharat News',
    href: 'https://www.smartbharatnews.top/2026/05/vaibhav-pasi-visionary-entrepreneur.html',
    textOnly: true,
  },
  {
    name: 'National Outlook Daily',
    href: 'https://www.nationaloutlookdaily.top/2026/05/vaibhav-pasi-visionary-entrepreneur.html',
    textOnly: true,
  },
  {
    name: 'Bharat Biz Wire',
    href: 'https://www.bharatbizwire.top/2026/05/vaibhav-pasi-visionary-entrepreneur.html',
    textOnly: true,
  },
  {
    name: 'Saga of India',
    href: 'https://www.sagaofindia.top/2026/05/vaibhav-pasi-visionary-entrepreneur.html',
    textOnly: true,
  },
  {
    name: 'The Republic News',
    href: 'https://www.therepublicnews.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html',
    textOnly: true,
  },
  {
    name: 'Indian Economics News',
    href: 'https://www.indianeconomicsnews.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html',
    textOnly: true,
  },
  {
    name: 'Times News Express',
    href: 'http://www.timesnewsexpress.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html',
    textOnly: true,
  },
  {
    name: 'Daily District News',
    href: 'https://www.dailydistrictnews.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html',
    logo: '/press/daily-district-news.png',
  },
  {
    name: 'News Wire of India',
    href: 'https://www.newswireofindia.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html',
    logo: '/press/news-wire-of-india.png',
  },
  {
    name: '99 News',
    href: 'https://www.99news.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html',
    logo: '/press/99-news.png',
  },
  {
    name: 'Insider News Times',
    href: 'https://www.insidernewstimes.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html',
    logo: '/press/insider-news-times.png',
  },
  {
    name: 'News Today 24x7',
    href: 'https://www.newstoday24x7.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html',
    logo: '/press/news-today-24x7.png',
  },
  {
    name: 'The India Forbes News',
    href: 'https://www.theindiaforbesnews.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html',
    logo: '/press/the-india-forbes-news.png',
  },
  {
    name: 'Today News Standard',
    href: 'https://www.todaynewsstandard.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html',
    logo: '/press/today-news-standard.png',
  },
];

export default function Press() {
  return (
    <section className="section-padding bg-brand-black border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase text-[0.6875rem] mb-6 block">
              In the Press
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter italic uppercase mb-6 leading-[0.9]">
              As Featured <br />
              <span className="text-gray-500">In.</span>
            </h2>
            <p className="text-gray-400 font-normal leading-relaxed flex gap-3">
              <Newspaper className="w-5 h-5 shrink-0 text-accent mt-0.5" />
              <span>
                <span className="text-white font-medium">"{featureHeadline}"</span> — covered by {publications.length} publications, May 2026.
              </span>
            </p>
          </div>
          <div className="text-[0.6875rem] tracking-[0.4em] font-bold text-gray-500 border-b border-gray-800 pb-2 uppercase self-start md:self-auto">
            {publications.length} Publications
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {publications.map((pub, idx) => (
            <motion.a
              key={pub.name}
              href={pub.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Read the feature on ${pub.name} (opens in a new tab)`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx % 4) * 0.08 }}
              className="group flex flex-col p-2 md:p-3 rounded-2xl md:rounded-3xl bg-brand-dark-gray/20 border border-white/5 hover:border-accent/40 transition-all"
            >
              <div
                className={`h-20 sm:h-24 md:h-28 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 px-4 py-3 md:px-6 md:py-4 transition-transform duration-500 group-hover:scale-[0.98] ${
                  ('textOnly' in pub && pub.textOnly)
                    ? 'theme-dark bg-neutral-900 border border-white/10'
                    : pub.plate === 'dark' ? 'theme-dark bg-neutral-900 border border-white/10' : 'bg-[#f5f5f7] border border-black/5'
                }`}
              >
                {('textOnly' in pub && pub.textOnly) ? (
                  <span className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white text-center leading-tight">{pub.name}</span>
                ) : (
                  <>
                    <img
                      src={pub.logo}
                      alt={`${pub.name} logo`}
                      className={`object-contain ${pub.wordmark ? 'h-8 md:h-10 w-auto' : 'max-h-full max-w-full'}`}
                      loading="lazy"
                      decoding="async"
                    />
                    {pub.wordmark && (
                      <span className="text-base sm:text-lg md:text-2xl font-bold tracking-tight text-neutral-800">{pub.name}</span>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 px-2 pt-3 pb-1">
                <span className="text-[0.6875rem] md:text-[0.6875rem] font-bold tracking-wider uppercase text-gray-400 group-hover:text-white transition-colors leading-tight">
                  {pub.name}
                </span>
                <ArrowUpRight className="w-4 h-4 shrink-0 text-gray-500 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
