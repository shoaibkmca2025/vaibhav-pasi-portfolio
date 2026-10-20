import { ArrowUpRight } from 'lucide-react';
import { posts, formatDate } from '../blog/posts';
import { landingServices } from '../content/services';
import { team } from '../content/team';
import { onLinkClick, sitePages } from '../router';
import { PageHero } from './PageParts';

// Human-readable sitemap: every indexable page, grouped the same way as the XML sitemaps
// (see sitemaps() in entry-server.tsx). Also gives crawlers one internal link to each page.
interface Link {
  href: string;
  label: string;
  note?: string;
}

function Group({ title, links }: { title: string; links: Link[] }) {
  if (!links.length) return null;
  return (
    <section data-reveal="up" className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight">
        {title} <span className="text-gray-500 font-normal text-base">({links.length})</span>
      </h2>
      <ul className="mt-5 divide-y divide-white/5">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              onClick={onLinkClick}
              className="group flex items-center justify-between gap-4 py-3 text-gray-300 hover:text-white transition-colors"
            >
              <span className="min-w-0">
                <span className="block font-medium group-hover:text-accent transition-colors">{l.label}</span>
                {l.note && <span className="block text-sm text-gray-500 truncate">{l.note}</span>}
              </span>
              <ArrowUpRight className="w-4 h-4 shrink-0 text-gray-500 group-hover:text-accent transition-colors" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function SitemapPage() {
  const pages: Link[] = [
    { href: '/', label: 'Home' },
    ...sitePages.filter((p) => p.key !== 'sitemap').map((p) => ({ href: p.path, label: p.label })),
  ];
  const services: Link[] = landingServices.map((s) => ({ href: s.href, label: s.title, note: s.price }));
  const articles: Link[] = posts.map((p) => ({ href: `/blog/${p.slug}`, label: p.title, note: formatDate(p.date) }));
  const people: Link[] = team
    .filter((m) => m.profileDetailsConfirmed)
    .map((m) => ({ href: `/team/${m.id}`, label: m.name, note: m.designation.split('|')[0].trim() }));

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero page="sitemap" title="Sitemap" intro="Every page on this site in one place: main pages, services, articles and the 4AM team." />
      <div className="section-padding">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          <Group title="Pages" links={pages} />
          <Group title="Services" links={services} />
          <Group title="Insights" links={articles} />
          <Group title="4AM Team" links={people} />
        </div>
        <p className="max-w-6xl mx-auto mt-8 text-sm text-gray-500">
          For search engines: <a href="/sitemap.xml" className="text-accent link-underline">sitemap.xml</a>
        </p>
      </div>
    </main>
  );
}
