import {
  siGithub,
  siGoogleads,
  siGoogleanalytics,
  siGooglesearchconsole,
  siGooglesheets,
  siInstagram,
  siMeta,
  siN8n,
  siNodedotjs,
  siPostgresql,
  siRazorpay,
  siReact,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siJavascript,
  siVercel,
  siVite,
  siWhatsapp,
  type SimpleIcon,
} from 'simple-icons';

// Brand logos (Simple Icons, CC0) for tools named in services and the toolkit.
// Logos are shown only for tools actually used; generic entries ("Short-form video") get none.
// LinkedIn isn't in Simple Icons, so components fall back to the lucide LinkedIn glyph.
const BY_NAME: Record<string, SimpleIcon[]> = {
  React: [siReact],
  TypeScript: [siTypescript],
  JavaScript: [siJavascript],
  'Tailwind CSS': [siTailwindcss],
  Vite: [siVite],
  Vercel: [siVercel],
  'Meta & Google Ads': [siMeta, siGoogleads],
  'Google Analytics': [siGoogleanalytics],
  Instagram: [siInstagram],
  'Google Search Console': [siGooglesearchconsole],
  n8n: [siN8n],
  'Google Sheets': [siGooglesheets],
  'WhatsApp & email automation': [siWhatsapp],
  'Supabase / Postgres': [siSupabase, siPostgresql],
  'Node.js': [siNodedotjs],
  'Git & GitHub': [siGithub],
  'Razorpay payments': [siRazorpay],
};

export const logosFor = (tool: string) => BY_NAME[tool] ?? [];

// The strip on the home page: one logo per tool, in a deliberate order
export const toolStrip: SimpleIcon[] = [
  siMeta,
  siGoogleads,
  siGoogleanalytics,
  siGooglesearchconsole,
  siInstagram,
  siWhatsapp,
  siN8n,
  siGooglesheets,
  siReact,
  siTypescript,
  siTailwindcss,
  siNodedotjs,
  siSupabase,
  siVercel,
  siGithub,
  siRazorpay,
];

// Brand colours that would disappear on the navy background get the foreground colour instead
export function visibleHex(icon: SimpleIcon) {
  const n = parseInt(icon.hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.28 ? null : `#${icon.hex}`;
}
