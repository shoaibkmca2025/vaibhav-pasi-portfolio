import type { CSSProperties } from 'react';
import { Building2, CalendarDays, Layers, Newspaper, PlayCircle } from 'lucide-react';
import { trustFacts } from '../content/proof';
import LogoStrip from './LogoStrip';
import ToolLogos from './ToolLogos';

// One icon per fact, in the same order as trustFacts
const FACT_ICONS = [CalendarDays, Building2, Newspaper, PlayCircle, Layers];

// Section 3 of the home page: verified facts only (see content/proof.ts), then the press strip and the tools used
export default function Credibility() {
  return (
    <section aria-label="Credentials" className="bg-brand-black">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 lg:px-24 py-12 md:py-16">
        <dl className="grid grid-cols-2 md:grid-cols-5 gap-px rounded-[1.75rem] overflow-hidden border border-white/10 bg-white/10">
          {trustFacts.map((f, i) => {
            const Icon = FACT_ICONS[i] ?? Layers;
            return (
            <div
              data-reveal="up"
              style={{ '--i': i } as CSSProperties}
              key={f.label}
              className={`flex flex-col-reverse justify-end bg-brand-black px-5 py-6 md:py-8 text-center ${i === trustFacts.length - 1 ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <dt className="mt-2 text-sm text-gray-400 leading-snug">{f.label}</dt>
              <dd className="text-3xl md:text-4xl font-bold tracking-tight text-accent">
                <Icon aria-hidden className="mx-auto mb-3 block w-5 h-5 text-gray-500" />
                <span data-count>{f.value}</span>
              </dd>
            </div>
            );
          })}
        </dl>
      </div>
      <LogoStrip />
      <ToolLogos />
    </section>
  );
}
