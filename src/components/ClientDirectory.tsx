import { ArrowUpRight } from 'lucide-react';
import { clients, INDUSTRIES, type Client } from '../content/clients';

// Full list of client websites on /work, grouped by industry. Each name links to the live site
// (left unlinked when the site is offline; see content/clients.ts).
const domain = (url: string) => new URL(url).hostname.replace(/^www\./, '');

// Small logo beside each name; an initial when there is no usable logo
function Thumb({ c }: { c: Client }) {
  const plate = c.logo ? (c.plate === 'dark' ? 'bg-[#151922] border-white/10' : 'bg-[#f5f5f7] border-black/5') : 'border-white/10';
  return (
    <span aria-hidden className={`grid w-14 h-9 shrink-0 place-items-center rounded-lg border px-1.5 ${plate}`}>
      {c.logo ? (
        <img src={c.logo} alt="" loading="lazy" decoding="async" className="max-h-6 max-w-full object-contain" />
      ) : (
        <span className="text-xs font-bold text-gray-500">{c.name.replace(/^the /i, '').charAt(0)}</span>
      )}
    </span>
  );
}

export default function ClientDirectory() {
  const groups = INDUSTRIES.map((industry) => ({ industry, items: clients.filter((c) => c.industry === industry) })).filter(
    (g) => g.items.length,
  );
  if (!groups.length) return null;

  return (
    <section id="clients" className="scroll-mt-24 section-padding bg-brand-dark-gray border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="section-head flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="max-w-2xl">
            <span className="eyebrow mb-5">Client websites</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-[1.08]">
              {clients.length} client <span className="text-accent">websites.</span>
            </h2>
            <p className="mt-6 text-gray-400 md:text-lg leading-relaxed">
              Websites designed and built for businesses and organisations across the US, the Cayman Islands and India. Open any of them to see the work.
            </p>
          </div>
        </div>

        <div className="columns-1 md:columns-2 xl:columns-3 gap-5 md:gap-6">
          {groups.map((g) => (
            <section
              key={g.industry}
              data-reveal="up"
              className="mb-5 md:mb-6 break-inside-avoid rounded-[1.75rem] border border-white/10 bg-brand-black p-6 md:p-7"
            >
              <h3 className="flex items-baseline justify-between gap-3 text-lg font-bold tracking-tight">
                {g.industry}
                <span className="text-sm font-normal text-gray-500">{g.items.length}</span>
              </h3>
              <ul className="mt-4 divide-y divide-white/5">
                {g.items.map((c) => (
                  <li key={c.name}>
                    {c.url ? (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 py-2.5"
                      >
                        <Thumb c={c} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-gray-200 group-hover:text-accent transition-colors">{c.name}</span>
                          <span className="block text-xs text-gray-500 truncate">{domain(c.url)}</span>
                        </span>
                        <ArrowUpRight className="w-4 h-4 shrink-0 text-gray-500 group-hover:text-accent transition-colors" aria-hidden />
                      </a>
                    ) : (
                      <span className="flex items-center gap-3 py-2.5 text-gray-400">
                        <Thumb c={c} />
                        {c.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
