// Editor setup. Only formatting that survives the trip to Markdown is enabled, so nothing the
// writer sees in the editor gets silently dropped on save (no colours, highlights or task lists).
import {
  BlockquoteBridge,
  BoldBridge,
  BulletListBridge,
  CodeBridge,
  CoreBridge,
  DropCursorBridge,
  HardBreakBridge,
  HeadingBridge,
  HistoryBridge,
  ImageBridge,
  ItalicBridge,
  LinkBridge,
  ListItemBridge,
  OrderedListBridge,
  PlaceholderBridge,
  UnderlineBridge,
} from '@10play/tentap-editor';
import type { Palette } from '@/lib/theme';

export function editorCss(p: Palette) {
  return `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap');
  html, body { background: ${p.background}; color: ${p.text}; margin: 0; }
  body { font: 400 19px/1.7 'Source Serif 4', Georgia, serif; -webkit-font-smoothing: antialiased; }
  .ProseMirror { padding: 4px 20px 160px; outline: none; min-height: 100vh; caret-color: ${p.accent}; }
  .ProseMirror p { margin: 0 0 1em; }
  .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 { font-family: Outfit, system-ui, sans-serif; line-height: 1.25; margin: 1.4em 0 .5em; }
  .ProseMirror h1 { font-size: 1.6em; } .ProseMirror h2 { font-size: 1.35em; } .ProseMirror h3 { font-size: 1.15em; }
  .ProseMirror a { color: ${p.accent}; text-decoration: underline; }
  .ProseMirror blockquote { border-left: 3px solid ${p.brand}; margin: 1.2em 0; padding-left: 1em; font-style: italic; color: ${p.textSecondary}; }
  .ProseMirror ul, .ProseMirror ol { padding-left: 1.3em; } .ProseMirror li p { margin: .2em 0; }
  .ProseMirror img { max-width: 100%; height: auto; border-radius: 10px; display: block; margin: 1.2em auto; }
  .ProseMirror img.ProseMirror-selectednode { outline: 3px solid ${p.accent}; }
  .ProseMirror code { background: ${p.surfaceAlt}; border-radius: 4px; padding: .1em .3em; font-size: .85em; }
  .ProseMirror p.is-editor-empty:first-child::before { color: ${p.muted}; content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
  `;
}

export function editorKit(p: Palette) {
  return [
    BoldBridge,
    ItalicBridge,
    UnderlineBridge,
    CodeBridge,
    HistoryBridge,
    HeadingBridge,
    BulletListBridge,
    OrderedListBridge,
    ListItemBridge,
    BlockquoteBridge,
    LinkBridge.configureExtension({ openOnClick: false }),
    ImageBridge,
    DropCursorBridge,
    HardBreakBridge,
    PlaceholderBridge.configureExtension({ placeholder: 'Tell your story…' }),
    CoreBridge.configureCSS(editorCss(p)),
  ];
}
