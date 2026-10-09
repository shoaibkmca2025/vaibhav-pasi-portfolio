import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { posts } from './blog/posts';
import { landingServices } from './content/services';
import { getSeo, renderHead, pageSeo } from './seo';
import { sitePages } from './router';
import { SITE_URL, DEFAULT_DESCRIPTION, person } from './site';
import { faqs } from './components/FAQ';

// Every page that gets its own prerendered HTML file
const pagePaths = sitePages.filter((p) => p.key !== 'blog').map((p) => p.path);
const servicePaths = landingServices.map((s) => s.href);
export const routes = ['/', ...pagePaths, ...servicePaths, '/blog', ...posts.map((p) => `/blog/${p.slug}`)];

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

export function sitemap() {
  const latest = posts[0]?.date;
  const entries = [
    { loc: '/', lastmod: latest, priority: '1.0' },
    ...pagePaths.map((loc) => ({ loc, lastmod: latest, priority: '0.9' })),
    ...servicePaths.map((loc) => ({ loc, lastmod: latest, priority: '0.8' })),
    { loc: '/blog', lastmod: latest, priority: '0.8' },
    ...posts.map((p) => ({ loc: `/blog/${p.slug}`, lastmod: p.date, priority: '0.7' })),
  ];
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${SITE_URL}${e.loc}</loc>\n${e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : ''}    <priority>${e.priority}</priority>\n  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function robots() {
  // Search engines and AI assistants are all welcome, so the site can be cited in AI answers
  // (the blog admin and API endpoints are kept out of search results)
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\n# AI search and assistant crawlers\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: Claude-SearchBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

// llms.txt: a plain-text summary AI assistants can read to understand who this site is about
export function llmsTxt() {
  const lines = [
    `# ${person.name}`,
    '',
    `> ${DEFAULT_DESCRIPTION}`,
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
    `- [Home](${SITE_URL}/): overview, press coverage, testimonials and FAQs`,
    ...sitePages
      .filter((p) => p.key !== 'blog')
      .map((p) => `- [${p.label}](${SITE_URL}${p.path}): ${pageSeo[p.key as keyof typeof pageSeo].description}`),
    `- [Blog](${SITE_URL}/blog): articles on growth marketing, AI and e-commerce`,
    '',
    '## Services',
    ...landingServices.map((s) => `- [${s.title}](${SITE_URL}${s.href}): ${s.short} ${s.price}.`),
    '',
    '## Articles',
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`),
    '',
    '## FAQ',
    ...faqs.flatMap((f) => [`### ${f.question}`, f.answer, '']),
  ];
  return lines.join('\n');
}
