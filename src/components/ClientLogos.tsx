import { ArrowUpRight } from 'lucide-react';
import { clients, MIN_CLIENTS, type Client } from '../content/clients';
import { onLinkClick } from '../router';

// Home page client wall (Designride-style "happy clients"): two rows of client names scrolling in
// opposite directions. Uses the press strip's marquee (.logo-strip in index.css), so it pauses on
// hover and becomes a static, wrapped list for Reduce Motion. Full linked list lives on /work#clients.
function Row({ items, reverse = false }: { items: Client[]; reverse?: boolean }) {
  return (
    <div className="logo-strip relative">
      <ul className={`logo-strip-track flex w-max gap-3 md:gap-4 ${reverse ? 'logo-strip-reverse' : ''}`}>
        {[...items, ...items].map((c, i) => {
          const copy = i >= items.length;
          const chip = c.logo ? (
            <img src={c.logo} alt={c.name} loading="lazy" decoding="async" className="max-h-7 md:max-h-8 w-auto object-contain" />
          ) : (
            <span className="whitespace-nowrap text-sm md:text-base font-semibold tracking-tight text-gray-300">{c.name}</span>
          );
          return (
            <li key={`${c.name}-${i}`} aria-hidden={copy || undefined}>
              <span className="flex h-14 md:h-16 items-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 md:px-6">{chip}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function ClientLogos() {
  if (clients.length < MIN_CLIENTS) return null;
  const half = Math.ceil(clients.length / 2);

  return (
    <div className="pt-4 pb-14 md:pb-20">
      <div data-reveal="up" className="max-w-3xl mx-auto px-5 text-center">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">Our happy clients</p>
        <h2 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight">
          <span className="text-accent">{clients.length}</span> client websites delivered
        </h2>
        <p className="mt-3 text-gray-400">Law firms, clinics, home services, restaurants, non-profits and more.</p>
      </div>
      <div className="mt-8 space-y-3 md:space-y-4" aria-label="Client names">
        <Row items={clients.slice(0, half)} />
        <Row items={clients.slice(half)} reverse />
      </div>
      <div className="mt-8 text-center">
        <a href="/work#clients" onClick={onLinkClick} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent link-underline">
          See every client website <ArrowUpRight className="w-4 h-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}
