import { publications } from './Press';

// Scrolling "As featured in" band of press logos, right under the hero.
// The list is doubled so the loop is seamless; hovering pauses it, Reduce Motion stops it.
const logos = publications.filter((p) => 'logo' in p && p.logo);

export default function LogoStrip() {
  return (
    <section aria-label="As featured in" className="py-12 md:py-16 bg-brand-dark-gray border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 text-center mb-8 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          As featured <span className="text-accent">in</span>
        </h2>
        <p className="mt-2 text-sm md:text-base text-gray-400">
          Coverage of Vaibhav's work across {logos.length} publications.
        </p>
      </div>

      <div className="logo-strip relative">
        <ul className="logo-strip-track flex w-max gap-4 md:gap-6">
          {[...logos, ...logos].map((pub, i) => (
            <li key={`${pub.name}-${i}`} aria-hidden={i >= logos.length || undefined}>
              <a
                href={pub.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={i >= logos.length ? -1 : undefined}
                aria-label={`Read the feature on ${pub.name}`}
                className={`flex items-center justify-center h-16 md:h-20 w-40 md:w-48 px-5 rounded-2xl border transition-transform hover:-translate-y-0.5 ${
                  'plate' in pub && pub.plate === 'dark' ? 'bg-neutral-900 border-white/10' : 'bg-[#f5f5f7] border-black/5'
                }`}
              >
                <img
                  src={(pub as { logo: string }).logo}
                  alt={`${pub.name} logo`}
                  loading="lazy"
                  decoding="async"
                  className="max-h-9 md:max-h-11 max-w-full object-contain shrink-0"
                />
                {'wordmark' in pub && pub.wordmark && (
                  <span className="ml-2 text-base md:text-lg font-bold tracking-tight text-neutral-800">{pub.name}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
