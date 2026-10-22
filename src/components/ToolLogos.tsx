import { Linkedin } from 'lucide-react';
import type { SimpleIcon } from 'simple-icons';
import { logosFor, toolStrip, visibleHex } from '../lib/toolLogos';

export function BrandIcon({ icon, className = 'w-3.5 h-3.5' }: { icon: SimpleIcon; className?: string }) {
  return (
    <svg role="img" aria-label={icon.title} viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d={icon.path} />
    </svg>
  );
}

// Tool name chips with the tool's logo in front (monochrome, so a row of them stays calm)
// stagger: chips rise in one after another when the list scrolls into view
export function ToolChips({ tools, label = 'Tools and technologies', stagger = false }: { tools?: string[]; label?: string; stagger?: boolean }) {
  if (!tools?.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={label} data-reveal-stagger={stagger || undefined}>
      {tools.map((t) => {
        const icons = logosFor(t);
        return (
          <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-gray-300">
            {t === 'LinkedIn' ? (
              <Linkedin className="w-3.5 h-3.5 text-accent" aria-hidden />
            ) : (
              icons.map((icon) => (
                <span key={icon.slug} aria-hidden className="text-accent">
                  <BrandIcon icon={icon} />
                </span>
              ))
            )}
            {t}
          </li>
        );
      })}
    </ul>
  );
}

// Home page: the platforms and tools used day to day, shown as a logo row
export default function ToolLogos() {
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12 pt-14 md:pt-20 pb-14 md:pb-20">
      <p className="text-center text-xs font-bold tracking-[0.3em] uppercase text-gray-500">Tools and platforms I work with</p>
      <ul className="mt-7 grid grid-cols-4 sm:grid-cols-8 gap-3 md:gap-4">
        {toolStrip.map((icon) => {
          const hex = visibleHex(icon);
          return (
            <li key={icon.slug}>
              {/* Brand colour where it reads on the background; very dark logos use the text colour */}
              <span className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-1 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-white/25">
                <span className="text-white" style={hex ? { color: hex } : undefined}>
                  <BrandIcon icon={icon} className="w-7 h-7 md:w-8 md:h-8" />
                </span>
                <span className="text-[0.625rem] md:text-[0.6875rem] leading-tight text-center text-gray-400">{icon.title}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
