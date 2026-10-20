import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { posts } from './blog/posts';
import { landingServices } from './content/services';
import { getSeo, renderHead, pageSeo } from './seo';
import { sitePages } from './router';
import { team } from './content/team';
import { SITE_URL, PERSON_DESCRIPTION, person } from './site';
import { faqs } from './components/FAQ';
import { caseStudies } from './content/caseStudies';
import { clients, INDUSTRIES } from './content/clients';

// Every page that gets its own prerendered HTML file
const pagePaths = sitePages.filter((p) => p.key !== 'blog').map((p) => p.path);
const servicePaths = landingServices.map((s) => s.href);
const memberPaths = team.map((m) => `/team/${m.id}`);
export const routes = ['/', ...pagePaths, ...memberPaths, ...servicePaths, '/blog', ...posts.map((p) => `/blog/${p.slug}`), '/404'];

export function render(path: string) {
  return {
    html: renderToString(
      <StrictMode>
        <App initialPath={path} />
      </StrictMode>,
    ),
    head: renderHead(getSeo(path)),
  };
}

// ─── Sitemaps ───
// /sitemap.xml is a sitemap index pointing to one sitemap per section, so Search Console
// reports indexing for each group separately. Every entry lists its main image too.
interface SitemapEntry {
  loc: string;
  lastmod?: string;
  priority: string;
  images?: { src?: string; title: string }[];
}

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>\n';

const xmlEscape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const fullUrl = (src: string) => (src.startsWith('http') ? src : `${SITE_URL}${src.startsWith('/') ? '' : '/'}${src}`);

function urlset(entries: SitemapEntry[]) {
  const urls = entries.map((e) => {
    const images = (e.images ?? [])
      .filter((img) => img.src)
      .map(
        (img) =>
          `    <image:image>\n      <image:loc>${xmlEscape(fullUrl(img.src!))}</image:loc>\n    </image:image>`,
      )
      .join('\n');
    return [
      '  <url>',
      `    <loc>${xmlEscape(SITE_URL + e.loc)}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : '',
      `    <priority>${e.priority}</priority>`,
      images,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n');
  });
  return `${XML_HEADER}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>\n`;
}

const latestDate = () => posts[0]?.date;
const portrait = { src: '/vaibhav-pasi.jpg', title: person.name };

// Each section: file name → its pages
function sitemapSections(): Record<string, SitemapEntry[]> {
  const latest = latestDate();
  return {
    'sitemap-pages.xml': [
      { loc: '/', lastmod: latest, priority: '1.0', images: [portrait] },
      // Legal pages are indexable but low priority
      ...pagePaths.map((loc) => ({
        loc,
        lastmod: latest,
        priority: ['/privacy', '/terms', '/sitemap'].includes(loc) ? '0.3' : '0.9',
        images: loc === '/about' ? [portrait] : [],
      })),
      { loc: '/blog', lastmod: latest, priority: '0.8' },
    ],
    'sitemap-services.xml': landingServices.map((s) => ({
      loc: s.href,
      lastmod: latest,
      priority: '0.8',
      images: s.image ? [{ src: s.image.src, title: s.title }] : [],
    })),
    'sitemap-blog.xml': posts.map((p) => ({
      loc: `/blog/${p.slug}`,
      lastmod: p.date,
      priority: '0.7',
      images: p.cover ? [{ src: p.cover, title: p.title }] : [],
    })),
    // Only profiles with confirmed details; the rest are noindex until filled in
    'sitemap-team.xml': team
      .filter((m) => m.profileDetailsConfirmed)
      .map((m) => ({
        loc: `/team/${m.id}`,
        lastmod: latest,
        priority: '0.6',
        images: m.portrait ? [{ src: m.portrait, title: m.name }] : [],
      })),
  };
}

// Every sitemap file to write: the index plus one per section
export function sitemaps(): Record<string, string> {
  const sections = sitemapSections();
  const files: Record<string, string> = {};
  const index: string[] = [];
  for (const [file, entries] of Object.entries(sections)) {
    if (!entries.length) continue;
    files[file] = urlset(entries);
    const lastmod = entries.map((e) => e.lastmod).filter(Boolean).sort().pop();
    index.push(`  <sitemap>\n    <loc>${SITE_URL}/${file}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}  </sitemap>`);
  }
  files['sitemap.xml'] = `${XML_HEADER}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${index.join('\n')}\n</sitemapindex>\n`;
  return files;
}


export function robots() {
  // Search engines and AI assistants are all welcome, so the site can be cited in AI answers
  // (the blog admin and API endpoints are kept out of search results)
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\n# AI search and assistant crawlers\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: Claude-SearchBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nUser-agent: Applebot-Extended\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

// llms.txt: a plain-text summary AI assistants can read to understand who this site is about
export function llmsTxt() {
  const lines = [
    `# ${person.name}`,
    '',
    `> ${PERSON_DESCRIPTION}`,
    '',
    `- Role: ${person.jobTitle}`,
    `- Company: ${person.organization.name} (${person.organization.url})`,
    `- Based in: ${person.country}`,
    `- Contact: ${person.email}`,
    `- Expertise: ${person.knowsAbout.join(', ')}`,
    '',
    '## Profiles',
    ...person.sameAs.map((url) => `- ${url}`),
    '',
    '## Pages',
    `- [Home](${SITE_URL}/): overview, services, featured projects, testimonials and FAQs`,
    ...sitePages
      .filter((p) => p.key !== 'blog')
      .map((p) => `- [${p.label}](${SITE_URL}${p.path}): ${pageSeo[p.key as keyof typeof pageSeo].description}`),
    `- [Insights](${SITE_URL}/blog): articles on marketing, websites, AI and e-commerce`,
    '',
    '## Services',
    ...landingServices.map((s) => `- [${s.title}](${SITE_URL}${s.href}): ${s.short} ${s.price}.`),
    '',
    '## Full text',
    `- [llms-full.txt](${SITE_URL}/llms-full.txt): every service, case study, FAQ and article in one file`,
    '',
    '## Articles',
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`),
    '',
    '## FAQ',
    ...faqs.flatMap((f) => [`### ${f.question}`, f.answer, '']),
  ];
  return lines.join('\n');
}

// Article HTML → readable Markdown-ish text for llms-full.txt
function htmlToText(html: string) {
  return html
    .replace(/<h([1-6])[^>]*>/g, (_, n) => '\n' + '#'.repeat(Number(n) + 1) + ' ')
    .replace(/<\/h[1-6]>/g, '\n')
    .replace(/<li[^>]*>/g, '- ')
    .replace(/<\/(p|li|ul|ol|blockquote|tr)>/g, '\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// llms-full.txt: the substance of the site in one plain-text file, for AI search and assistants.
// Built from the same content the pages render, so it never drifts from what visitors see.
export function llmsFullTxt() {
  const out: string[] = [llmsTxt(), '', '---', '', '# Full content', ''];
  out.push('## Services', '');
  for (const s of landingServices) {
    out.push(`### ${s.title}`, `URL: ${SITE_URL}${s.href}`, `Price: ${s.price}. ${s.priceNote}`, '', s.intro, '');
    if (s.deliverables.length) out.push('What is included:', ...s.deliverables.map((d) => `- ${d}`), '');
    if (s.process.length) out.push('Process:', ...s.process.map((p, i) => `${i + 1}. ${p.title}: ${p.text}`), '');
    if (s.faqs.length) out.push('Questions:', ...s.faqs.flatMap((f) => [`Q: ${f.question}`, `A: ${f.answer}`]), '');
  }
  out.push('## Case studies', '', 'Client names are kept private; each result is backed by the original screenshot on the site.', '');
  for (const c of caseStudies) {
    out.push(
      `### ${c.headline}`,
      `URL: ${SITE_URL}/work#${c.slug}`,
      `Client: ${c.client} (${c.category})`,
      `Challenge: ${c.challenge}`,
      'Approach:',
      ...c.approach.map((a) => `- ${a}`),
      `Results: ${c.outcome.map((o) => `${o.value} ${o.label}`).join('; ')}`,
      '',
    );
  }
  out.push('## Client websites', '', `${clients.length} websites delivered, by industry:`, '');
  for (const industry of INDUSTRIES) {
    const items = clients.filter((c) => c.industry === industry);
    if (items.length) out.push(`### ${industry}`, ...items.map((c) => (c.url ? `- ${c.name}: ${c.url}` : `- ${c.name}`)), '');
  }
  out.push('## Articles', '');
  for (const p of posts) {
    out.push(`### ${p.title}`, `URL: ${SITE_URL}/blog/${p.slug}`, `Published: ${p.date} · Author: ${person.name}`, '', htmlToText(p.html), '');
  }
  return out.join('\n');
}
