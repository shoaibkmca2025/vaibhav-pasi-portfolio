// Runs after `vite build`: renders every page to static HTML so search engines,
// AI crawlers and link previews see the full content and per-page meta tags.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const ssrEntry = path.resolve('dist-ssr/entry-server.js');

const { routes, render, sitemap, robots, llmsTxt } = await import(pathToFileURL(ssrEntry).href);

const template = fs
  .readFileSync(path.join(dist, 'index.html'), 'utf-8')
  // The page-specific title and description replace the generic ones from index.html
  .replace(/<title>[\s\S]*?<\/title>\s*/, '')
  .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/, '');

for (const route of routes) {
  const { html, head } = render(route);
  const page = template
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  // /blog -> blog.html, /blog/x -> blog/x.html (served at clean URLs via vercel.json "cleanUrls")
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, `${route}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page);
  console.log(`prerendered ${route}`);
}

fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap());
fs.writeFileSync(path.join(dist, 'robots.txt'), robots());
fs.writeFileSync(path.join(dist, 'llms.txt'), llmsTxt());
console.log('wrote sitemap.xml, robots.txt, llms.txt');

fs.rmSync(path.resolve('dist-ssr'), { recursive: true, force: true });
