// A complete, theme-aware HTML page for an article, shown in a WebView. Used by the reader and
// by the editor's preview, so the preview is exactly what readers see.
import type { Palette } from './theme';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

interface Options {
  title: string;
  html: string;
  cover?: string;
  category?: string;
  byline?: string; // e.g. "Nov 20, 2026 · 6 min read"
  tags?: string[];
  palette: Palette;
  textScale?: number;
  footer?: string; // extra HTML at the end
}

export function articleDocument({ title, html, cover, category, byline, tags = [], palette: p, textScale = 1, footer = '' }: Options) {
  const base = Math.round(19 * textScale);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap" />
<style>
  :root { color-scheme: ${p.scheme}; }
  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body { margin: 0; background: ${p.background}; color: ${p.text};
    font: 400 ${base}px/1.7 'Source Serif 4', Georgia, serif; -webkit-font-smoothing: antialiased; }
  .wrap { max-width: 680px; margin: 0 auto; padding: 8px 22px 48px; }
  .cover { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block; background: ${p.surfaceAlt}; }
  .eyebrow { font: 700 12px/1 Outfit, system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: ${p.accent}; margin: 24px 0 12px; }
  h1.title { font: 800 ${Math.round(32 * textScale)}px/1.15 Outfit, system-ui, sans-serif; letter-spacing: -.02em; margin: 0 0 14px; }
  .byline { font: 400 14px/1.4 Outfit, system-ui, sans-serif; color: ${p.muted}; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid ${p.border}; }
  .body > :first-child { margin-top: 0; }
  p { margin: 0 0 1.15em; }
  h1, h2, h3, h4 { font-family: Outfit, system-ui, sans-serif; line-height: 1.25; letter-spacing: -.01em; margin: 1.8em 0 .6em; }
  .body h1 { font-size: 1.6em; } .body h2 { font-size: 1.35em; } .body h3 { font-size: 1.15em; }
  a { color: ${p.accent}; text-decoration: underline; text-underline-offset: 3px; }
  strong { font-weight: 600; }
  ul, ol { padding-left: 1.3em; margin: 0 0 1.15em; } li { margin: .35em 0; } li > p { margin: 0; }
  blockquote { margin: 1.6em 0; padding: .1em 0 .1em 1.1em; border-left: 3px solid ${p.brand}; font-style: italic; color: ${p.textSecondary}; }
  blockquote p:last-child { margin-bottom: 0; }
  img { max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 1.6em auto; }
  figure { margin: 1.8em 0; } figure img { margin: 0 auto; }
  figcaption { font: 400 14px/1.5 Outfit, system-ui, sans-serif; color: ${p.muted}; text-align: center; margin-top: 10px; }
  hr { border: 0; height: 1px; background: ${p.border}; margin: 2.4em 0; }
  code { font: .85em ui-monospace, Menlo, monospace; background: ${p.surfaceAlt}; padding: .15em .35em; border-radius: 4px; }
  pre { background: ${p.surface}; padding: 14px; border-radius: 10px; overflow-x: auto; } pre code { background: none; padding: 0; }
  table { width: 100%; border-collapse: collapse; font: 400 15px/1.5 Outfit, system-ui, sans-serif; display: block; overflow-x: auto; margin: 1.5em 0; }
  th, td { border: 1px solid ${p.border}; padding: 8px 10px; text-align: left; } th { background: ${p.surface}; }
  .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px; }
  .tag { font: 500 13px/1 Outfit, system-ui, sans-serif; padding: 8px 12px; border-radius: 999px; background: ${p.surfaceAlt}; color: ${p.textSecondary}; }
</style>
</head>
<body>
${cover ? `<img class="cover" src="${esc(cover)}" alt="" />` : ''}
<main class="wrap">
  ${category ? `<div class="eyebrow">${esc(category)}</div>` : '<div style="height:20px"></div>'}
  <h1 class="title">${esc(title || 'Untitled')}</h1>
  ${byline ? `<div class="byline">${esc(byline)}</div>` : ''}
  <article class="body">${html}</article>
  ${tags.length ? `<div class="tags">${tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
  ${footer}
</main>
</body>
</html>`;
}
