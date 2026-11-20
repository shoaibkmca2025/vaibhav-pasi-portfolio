// The mobile editor writes HTML; articles are stored as Markdown. This converts the editor's
// output so app-written posts look like hand-written ones (and stay editable in /admin).
import TurndownService from 'turndown';
import { siteUrl } from './http.js';

const td = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  hr: '---',
});

td.remove(['script', 'style', 'iframe', 'object', 'embed', 'form']);

// Only web, mail and on-site links survive (no javascript: or data: URLs)
td.addRule('safeLink', {
  filter: (node) => node.nodeName === 'A' && Boolean(node.getAttribute('href')),
  replacement(content, node) {
    const href = relativeToSite((node as HTMLElement).getAttribute('href')!.trim());
    if (!/^(https?:\/\/|mailto:|\/|#)/i.test(href)) return content;
    return content.trim() ? `[${content}](${href.replace(/[()\s]/g, encodeURIComponent)})` : '';
  },
});

// Markdown has no underline; Markdown allows inline HTML, which the site renders
td.addRule('underline', {
  filter: ['u'],
  replacement: (content) => (content.trim() ? `<u>${content}</u>` : content),
});

// "- item" rather than turndown's "-   item", and no blank line inside each item
td.addRule('listItem', {
  filter: 'li',
  replacement(content, node) {
    const parent = node.parentNode as HTMLElement | null;
    let marker = '- ';
    if (parent?.nodeName === 'OL') {
      const start = Number(parent.getAttribute('start') || 1);
      marker = `${start + Array.prototype.indexOf.call(parent.children, node)}. `;
    }
    const body = content.replace(/^\n+/, '').replace(/\n+$/, '').replace(/\n/gm, `\n${' '.repeat(marker.length)}`);
    return `${marker}${body}${node.nextSibling ? '\n' : ''}`;
  },
});

// A captioned figure (from our own renderer) round-trips as ![alt](src "caption")
td.addRule('figure', {
  filter: 'figure',
  replacement(_content, node) {
    const el = node as HTMLElement;
    const img = el.querySelector('img');
    if (!img) return _content;
    const caption = el.querySelector('figcaption')?.textContent?.trim() ?? '';
    return `\n\n${imageMarkdown(img.getAttribute('src') ?? '', img.getAttribute('alt') ?? '', caption)}\n\n`;
  },
});

td.addRule('image', {
  filter: 'img',
  replacement(_content, node) {
    const img = node as HTMLElement;
    return imageMarkdown(img.getAttribute('src') ?? '', img.getAttribute('alt') ?? '', img.getAttribute('title') ?? '');
  },
});

function imageMarkdown(src: string, alt: string, caption: string) {
  const clean = (s: string) => s.replace(/[\[\]\n]/g, ' ').trim();
  const title = caption ? ` "${clean(caption).replace(/"/g, "'")}"` : '';
  return src ? `![${clean(alt)}](${relativeToSite(src)}${title})` : '';
}

// https://www.vaibhavpasi.online/blog/x.jpg -> /blog/x.jpg (the format existing posts use)
export function relativeToSite(url: string) {
  for (const host of [siteUrl(), 'https://www.vaibhavpasi.online', 'https://vaibhavpasi.online']) {
    const base = host.replace(/\/$/, '');
    if (url.startsWith(`${base}/`)) return url.slice(base.length);
  }
  return url;
}

export function htmlToMarkdown(html: string) {
  return td
    .turndown(html)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
