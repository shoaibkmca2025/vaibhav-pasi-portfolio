import { ArrowRight } from 'lucide-react';
import { navPages, onLinkClick } from '../router';

// Shown for any address that isn't a page. Prerendered to dist/404.html, which Vercel serves
// with a real 404 status for unknown URLs; marked noindex in src/seo.ts.
export default function NotFoundPage() {
  return (
    <main id="main" tabIndex={-1} className="flex min-h-svh items-center px-5 pb-20 pt-32 outline-none sm:px-6 md:px-12 lg:px-24">
      <div className="mx-auto w-full max-w-3xl text-center">
        <span className="eyebrow mb-6">Error 404</span>
        <h1 className="text-5xl font-black leading-[0.95] tracking-tighter md:text-7xl">This page doesn&apos;t exist.</h1>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-gray-400 md:text-lg">
          The link may be outdated or mistyped. Try one of these instead:
        </p>
        <nav aria-label="Main pages" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-3">
            {navPages.map((p) => (
              <li key={p.key}>
                <a
                  href={p.path}
                  onClick={onLinkClick}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
                >
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="/" onClick={onLinkClick} className="btn-primary mt-10">
          Back to Home <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </main>
  );
}
