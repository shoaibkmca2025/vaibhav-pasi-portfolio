import { ArrowUpRight } from 'lucide-react';
import { clients, MIN_CLIENTS, type Client } from '../content/clients';
import { onLinkClick } from '../router';

// Home page client wall (Designride-style "happy clients"): two rows of client logos scrolling in
// opposite directions. Uses the press strip's marquee (.logo-strip in index.css), so it pauses on
// hover and becomes a static, wrapped list for Reduce Motion. Full linked list lives on /work#clients.
function Row({ items, reverse = false }: { items: Client[]; reverse?: boolean }) {
  return (
    <div className="logo-strip relative">
      <ul className={`logo-strip-track flex w-max gap-3 md:gap-4 ${reverse ? 'logo-strip-reverse' : ''}`}>
        {[...items, ...items].map((c, i) => {
          const copy = i >= items.length;
          // Each logo sits on the plate that keeps it visible (light for dark logos, dark for white ones)
          const plate = c.plate === 'dark' ? 'theme-dark bg-[#151922] border-white/10' : 'bg-[#f5f5f7] border-black/5';
          return (
            <li key={`${c.name}-${i}`} aria-hidden={copy || undefined}>
              <span
                title={c.name}
                className={`flex h-16 md:h-20 w-36 md:w-44 items-center justify-center rounded-2xl border px-4 ${plate}`}
              >
                <img
                  src={c.logo}
                  alt={copy ? '' : c.name}
                  loading="lazy"
                  decoding="async"
                  className="max-h-9 md:max-h-11 max-w-full w-auto object-contain"
                />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function ClientLogos() {
  // The wall shows logos only; every client (with or without a logo) is listed on /work#clients
  const withLogos = clients.filter((c) => c.logo);
  if (withLogos.length < MIN_CLIENTS) return null;
  const half = Math.ceil(withLogos.length / 2);

  return (
    <div className="pt-4 pb-14 md:pb-20">
      <div data-reveal="up" className="max-w-3xl mx-auto px-5 text-center">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">Our happy clients</p>
        <h2 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight">
          <span className="text-accent">{clients.length}</span> client websites delivered
        </h2>
        <p className="mt-3 text-gray-400">Law firms, clinics, home services, restaurants, non-profits and more.</p>
      </div>
      <div className="mt-8 space-y-3 md:space-y-4" aria-label="Client logos">
        <Row items={withLogos.slice(0, half)} />
        <Row items={withLogos.slice(half)} reverse />
      </div>
      <div className="mt-8 text-center">
        <a href="/work#clients" onClick={onLinkClick} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent link-underline">
          See every client website <ArrowUpRight className="w-4 h-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}
