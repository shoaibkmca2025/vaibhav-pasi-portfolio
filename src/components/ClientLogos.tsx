import { clients, MIN_CLIENTS } from '../content/clients';

// "Brands I've worked with": a calm logo wall of real, consenting clients (content/clients.ts).
// Renders nothing until there are enough entries to look intentional.
export default function ClientLogos() {
  if (clients.length < MIN_CLIENTS) return null;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 pt-4 pb-14 md:pb-20">
      <p className="text-center text-xs font-bold tracking-[0.3em] uppercase text-gray-500">Brands I've worked with</p>
      <ul data-reveal-stagger className="mt-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {clients.map((c) => {
          const content = c.logo ? (
            <img src={c.logo} alt={c.name} loading="lazy" decoding="async" className="max-h-10 md:max-h-12 max-w-[80%] object-contain" />
          ) : (
            <span className="text-center text-sm md:text-base font-bold tracking-tight text-gray-300 leading-tight">{c.name}</span>
          );
          const box =
            'flex h-20 md:h-24 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 transition-colors hover:border-brand-yellow/40';
          return (
            <li key={c.name} title={c.industry ? `${c.name} · ${c.industry}` : c.name}>
              {c.url ? (
                <a href={c.url} target="_blank" rel="noopener noreferrer" className={box}>
                  {content}
                </a>
              ) : (
                <div className={box}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
