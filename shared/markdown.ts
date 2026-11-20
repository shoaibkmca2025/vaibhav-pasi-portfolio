// One Markdown renderer for the website, the app feed and the dashboard API, so an article
// looks the same everywhere.
// Extra over standard Markdown: an image alone in its paragraph with a title becomes a
// captioned figure:  ![Alt text](/blog/photo.jpg "Caption")
import { Marked, type Tokens } from 'marked';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const marked = new Marked({
  renderer: {
    paragraph(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, token: Tokens.Paragraph) {
      const only = token.tokens.length === 1 ? token.tokens[0] : null;
      if (only?.type === 'image' && (only as Tokens.Image).title) {
        const img = only as Tokens.Image;
        return (
          `<figure><img src="${escapeHtml(img.href)}" alt="${escapeHtml(img.text)}" loading="lazy" />` +
          `<figcaption>${escapeHtml(img.title!)}</figcaption></figure>\n`
        );
      }
      return `<p>${this.parser.parseInline(token.tokens)}</p>\n`;
    },
  },
});

export const renderMarkdown = (body: string) => marked.parse(body, { async: false }) as string;

// Relative site paths (/blog/x.jpg, /blog/post) -> absolute, for HTML shown outside the website
export const absolutizeHtml = (html: string, siteUrl: string) =>
  html.replace(/(\s(?:src|href)=")\/(?!\/)/g, `$1${siteUrl.replace(/\/$/, '')}/`);
