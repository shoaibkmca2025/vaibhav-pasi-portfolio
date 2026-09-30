// Free tools: definitions + generators. Every tool runs in the browser (instant, free, private),
// except the Website Audit which calls /api/growth-score for real checks of a live site.
// To add a tool: add an entry to `tools` with fields and a `run` function.
import type { SiteCheckResponse } from '../../shared/growth';
import { postJson } from './api';

export type FieldType = 'text' | 'textarea' | 'select' | 'number';
export interface ToolField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  default?: string;
  help?: string;
}

export type ToolOutput =
  | { kind: 'list'; title: string; items: string[]; copy?: boolean }
  | { kind: 'text'; title: string; text: string }
  | { kind: 'table'; title: string; columns: string[]; rows: string[][] }
  | { kind: 'metrics'; title: string; items: { label: string; value: string; note?: string }[] }
  | { kind: 'checks'; title: string; items: { label: string; pass: boolean; detail: string }[] };

export interface Tool {
  slug: string;
  title: string;
  category: 'Content' | 'SEO' | 'Business' | 'Website';
  summary: string;
  fields: ToolField[];
  // Service to pre-select when the visitor clicks "Hire Vaibhav" after using the tool
  service: string;
  run: (values: Record<string, string>, seed: number) => ToolOutput[] | Promise<ToolOutput[]>;
}

/* ─── helpers ─── */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}
const hash = (str: string) => [...str].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);
function pickN<T>(arr: T[], n: number, rand: () => number) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
const hashtagify = (s: string) => '#' + s.replace(/[^a-z0-9]/gi, '').toLowerCase();
const fmtINR = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

const TONES = ['Friendly', 'Professional', 'Bold', 'Funny', 'Inspirational'];
const INDUSTRIES = ['Restaurant / Café', 'Fashion & Apparel', 'Beauty & Salon', 'Fitness', 'Real Estate', 'Education / Coaching', 'Healthcare / Clinic', 'D2C Product', 'Agency / Services', 'Creator / Personal Brand', 'Tech / SaaS', 'Other'];

/* ─── Instagram captions ─── */
const captionOpeners: Record<string, string[]> = {
  Friendly: ['Quick one for you:', 'Real talk:', 'Something we love:', 'Here’s the thing about {t}:'],
  Professional: ['Insight:', 'What most people miss about {t}:', 'A practical note on {t}:', 'Three things to know about {t}:'],
  Bold: ['Stop scrolling.', 'Unpopular opinion:', 'Nobody talks about this:', '{T} is not what you think.'],
  Funny: ['Me pretending I have {t} figured out:', 'POV: you finally understand {t}.', 'Plot twist:', 'Nobody: … Me: talking about {t} again.'],
  Inspirational: ['Start before you feel ready.', 'Small steps, every day.', 'This is your sign.', 'Progress over perfection.'],
};
const captionBodies = [
  'Here’s what we learned about {t} and why it matters for {a}.',
  'If you care about {t}, save this for later.',
  'The simplest way to get better at {t}? Start with one small change this week.',
  '{T} doesn’t have to be complicated. Here’s how we keep it simple for {a}.',
  'We get asked about {t} every week, so here’s the honest answer.',
];
const captionCtas = ['Save this for later.', 'Share this with someone who needs it.', 'Comment “INFO” and we’ll send details.', 'Tap the link in bio to learn more.', 'Follow for more like this.', 'Tell us your take in the comments.'];

/* ─── Marketing ideas bank ─── */
const ideaBank: { idea: string; goals: string[]; budget: 'Low' | 'Medium' | 'High' }[] = [
  { idea: 'Run a 7-day content series answering the top 7 customer questions', goals: ['Awareness', 'Trust'], budget: 'Low' },
  { idea: 'Turn your best customer result into a before/after carousel', goals: ['Leads', 'Trust'], budget: 'Low' },
  { idea: 'Offer a free mini-audit or consultation with a simple booking link', goals: ['Leads'], budget: 'Low' },
  { idea: 'Collaborate with a complementary local business on a joint giveaway', goals: ['Awareness'], budget: 'Low' },
  { idea: 'Set up WhatsApp Business with quick replies and a catalogue', goals: ['Sales', 'Leads'], budget: 'Low' },
  { idea: 'Ask your 10 happiest customers for a Google review this week', goals: ['Trust', 'Awareness'], budget: 'Low' },
  { idea: 'Publish a “how we do it” behind-the-scenes reel every week', goals: ['Awareness', 'Trust'], budget: 'Low' },
  { idea: 'Create a lead magnet (checklist or guide) and promote it in bio', goals: ['Leads'], budget: 'Low' },
  { idea: 'Retarget website visitors with a testimonial ad', goals: ['Sales'], budget: 'Medium' },
  { idea: 'Run a limited-time bundle for existing customers via email/WhatsApp', goals: ['Sales'], budget: 'Low' },
  { idea: 'Partner with 3 micro-creators in your niche for honest reviews', goals: ['Awareness', 'Sales'], budget: 'Medium' },
  { idea: 'Launch a landing page for your single best offer and send all ads to it', goals: ['Leads', 'Sales'], budget: 'Medium' },
  { idea: 'Host a free live session or workshop on a problem your customers have', goals: ['Leads', 'Trust'], budget: 'Low' },
  { idea: 'Write 4 SEO articles targeting questions your customers search', goals: ['Awareness', 'Leads'], budget: 'Medium' },
  { idea: 'Run a lead-form ad with an instant WhatsApp follow-up automation', goals: ['Leads'], budget: 'High' },
  { idea: 'Start a referral reward: existing customers get a discount per referral', goals: ['Sales', 'Leads'], budget: 'Low' },
  { idea: 'Build a simple quiz that recommends the right product or service', goals: ['Leads', 'Sales'], budget: 'Medium' },
  { idea: 'Run a YouTube pre-roll campaign with a 15-second customer story', goals: ['Awareness'], budget: 'High' },
  { idea: 'Send a monthly email with one useful tip and one offer', goals: ['Sales', 'Trust'], budget: 'Low' },
  { idea: 'Create a comparison page: you vs the common alternative', goals: ['Sales', 'Trust'], budget: 'Low' },
];

export const tools: Tool[] = [
  {
    slug: 'instagram-caption-generator',
    title: 'Instagram Caption Generator',
    category: 'Content',
    summary: 'Five ready-to-post captions with a hook, a call to action and relevant hashtags.',
    service: 'Digital Marketing',
    fields: [
      { name: 'topic', label: 'What is the post about?', type: 'text', placeholder: 'e.g. our new cold brew menu', required: true },
      { name: 'audience', label: 'Who is it for?', type: 'text', placeholder: 'e.g. coffee lovers in Pune', default: 'our community' },
      { name: 'tone', label: 'Tone', type: 'select', options: TONES, default: 'Friendly' },
    ],
    run: (v, seed) => {
      const rand = rng(seed ^ hash(v.topic));
      const t = v.topic.trim();
      const a = v.audience?.trim() || 'our community';
      const fill = (s: string) => s.replaceAll('{t}', t).replaceAll('{T}', cap(t)).replaceAll('{a}', a);
      const openers = captionOpeners[v.tone] ?? captionOpeners.Friendly;
      const tags = [...new Set([...words(t).filter((w) => w.length > 3).map(hashtagify), ...words(a).filter((w) => w.length > 3).map(hashtagify)])].slice(0, 5);
      const extra = ['#smallbusiness', '#instagood', '#reels', '#growth', '#explore', '#india'];
      const captions = Array.from({ length: 5 }, () => {
        const opener = fill(openers[Math.floor(rand() * openers.length)]);
        const body = fill(captionBodies[Math.floor(rand() * captionBodies.length)]);
        const cta = captionCtas[Math.floor(rand() * captionCtas.length)];
        const ht = [...tags, ...pickN(extra, 3, rand)].join(' ');
        return `${opener}\n\n${body}\n\n${cta}\n\n${ht}`;
      });
      return [{ kind: 'list', title: 'Captions', items: captions, copy: true }];
    },
  },
  {
    slug: 'reel-script-generator',
    title: 'Reel Script Generator',
    category: 'Content',
    summary: 'A shot-by-shot short-video script with three hook options, on-screen text and a CTA.',
    service: 'Digital Marketing',
    fields: [
      { name: 'topic', label: 'Reel topic', type: 'text', placeholder: 'e.g. 3 mistakes first-time home buyers make', required: true },
      { name: 'audience', label: 'Target viewer', type: 'text', placeholder: 'e.g. young couples buying a first flat', default: 'your ideal customer' },
      { name: 'length', label: 'Length', type: 'select', options: ['15 seconds', '30 seconds', '60 seconds'], default: '30 seconds' },
      { name: 'cta', label: 'Call to action', type: 'text', placeholder: 'e.g. DM “HOME” for our checklist', default: 'Follow for more' },
    ],
    run: (v) => {
      const t = v.topic.trim();
      const secs = parseInt(v.length) || 30;
      const beats = secs <= 15 ? 2 : secs <= 30 ? 3 : 5;
      const per = Math.max(3, Math.floor((secs - 6) / beats));
      const rows: string[][] = [['0–3s', `Hook (pick one below)`, 'Big bold text of the hook']];
      let at = 3;
      for (let i = 1; i <= beats; i++) {
        rows.push([`${at}–${at + per}s`, `Point ${i}: one clear idea about ${t}, shown not told`, `“${i}.” + 3–5 word summary`]);
        at += per;
      }
      rows.push([`${at}–${secs}s`, `Payoff + CTA: ${v.cta || 'Follow for more'}`, v.cta || 'Follow for more']);
      return [
        {
          kind: 'list',
          title: 'Hook options (first 3 seconds)',
          copy: true,
          items: [
            `If you’re ${v.audience || 'serious about this'}, don’t make these mistakes with ${t}.`,
            `Here’s what nobody tells you about ${t}.`,
            `I wish I knew this about ${t} sooner.`,
          ],
        },
        { kind: 'table', title: `${secs}-second script`, columns: ['Time', 'What to show / say', 'On-screen text'], rows },
        { kind: 'list', title: 'Filming tips', items: ['Film vertical, face or product in the first frame', 'Add captions: most people watch on mute', 'Cut every 2–3 seconds to keep attention', 'End on the CTA, then loop back to the hook'] },
      ];
    },
  },
  {
    slug: 'business-name-generator',
    title: 'Business Name Generator',
    category: 'Business',
    summary: 'Twenty brandable name ideas from your keywords, with a domain idea for each.',
    service: 'Website Development',
    fields: [
      { name: 'keywords', label: 'Keywords', type: 'text', placeholder: 'e.g. fresh, organic, bakery', required: true },
      { name: 'industry', label: 'Industry', type: 'select', options: INDUSTRIES, default: 'Other' },
      { name: 'style', label: 'Style', type: 'select', options: ['Modern', 'Classic', 'Playful', 'Premium'], default: 'Modern' },
    ],
    run: (v, seed) => {
      const rand = rng(seed ^ hash(v.keywords));
      const kws = words(v.keywords).slice(0, 5);
      if (!kws.length) return [];
      const styleSuffix: Record<string, string[]> = {
        Modern: ['ly', 'io', 'ify', 'hub', 'lab', 'base', 'flow', 'stack'],
        Classic: [' & Co.', ' House', ' Works', ' Studio', ' Company', ' Traders'],
        Playful: ['oo', 'zy', 'pop', 'bee', 'buddy', 'nest'],
        Premium: [' Atelier', ' Collective', ' Maison', ' Reserve', ' Society', ' Edition'],
      };
      const prefixes = ['The ', 'Go', 'Get', 'My', 'Pure ', 'True ', 'Urban ', 'Next '];
      const sfx = styleSuffix[v.style] ?? styleSuffix.Modern;
      const names = new Set<string>();
      let guard = 0;
      while (names.size < 20 && guard++ < 400) {
        const k = kws[Math.floor(rand() * kws.length)];
        const k2 = kws[Math.floor(rand() * kws.length)];
        const r = rand();
        let n: string;
        if (r < 0.35) n = cap(k) + sfx[Math.floor(rand() * sfx.length)];
        else if (r < 0.6 && k !== k2) n = cap(k) + cap(k2);
        else if (r < 0.8) n = prefixes[Math.floor(rand() * prefixes.length)] + cap(k);
        else n = cap(k.slice(0, Math.max(3, Math.ceil(k.length * 0.6)))) + cap(k2.slice(-Math.max(2, Math.floor(k2.length * 0.5))));
        names.add(n.replace(/\s+/g, ' ').trim());
      }
      return [
        {
          kind: 'table',
          title: 'Name ideas',
          columns: ['Name', 'Domain idea'],
          rows: [...names].map((n) => [n, n.toLowerCase().replace(/[^a-z0-9]/g, '') + (rand() < 0.5 ? '.com' : '.in')]),
        },
        { kind: 'list', title: 'Before you decide', items: ['Say it out loud: is it easy to spell after hearing it once?', 'Check the domain and Instagram handle are available', 'Search your trademark registry for conflicts', 'Make sure it still fits if you add products later'] },
      ];
    },
  },
  {
    slug: 'seo-title-generator',
    title: 'SEO Title Generator',
    category: 'SEO',
    summary: 'Eight search-friendly page titles with character counts, so none get cut off in Google.',
    service: 'SEO',
    fields: [
      { name: 'keyword', label: 'Main keyword', type: 'text', placeholder: 'e.g. wedding photographer in Jaipur', required: true },
      { name: 'brand', label: 'Brand name', type: 'text', placeholder: 'e.g. Studio Aurora' },
      { name: 'type', label: 'Page type', type: 'select', options: ['Service page', 'Blog article', 'Product page', 'Homepage', 'Local business'], default: 'Service page' },
    ],
    run: (v) => {
      const k = cap(v.keyword.trim());
      const b = v.brand?.trim();
      const year = new Date().getFullYear();
      const tail = b ? ` | ${b}` : '';
      const byType: Record<string, string[]> = {
        'Service page': [`${k}${tail}`, `${k}: Pricing, Process & Results${tail}`, `Professional ${k} Services${tail}`, `Affordable ${k} – Get a Free Quote${tail}`],
        'Blog article': [`${k}: The Complete Guide (${year})`, `How to Choose ${k}: 7 Things to Check`, `${k} Explained Simply${tail}`, `${k}: Mistakes to Avoid${tail}`],
        'Product page': [`${k} – Buy Online${tail}`, `${k}: Features, Price & Reviews${tail}`, `Best ${k} for Every Budget${tail}`, `${k} with Fast Delivery${tail}`],
        Homepage: [`${b || 'Your Brand'} – ${k}`, `${k} You Can Trust${tail}`, `${b || 'Your Brand'}: ${k} Made Simple`, `${k} | Official Site${tail}`],
        'Local business': [`${k} – Book Today${tail}`, `Top-Rated ${k}${tail}`, `${k}: Timings, Prices & Contact${tail}`, `Trusted ${k} Near You${tail}`],
      };
      const generic = [`${k}: What You Need to Know${tail}`, `${k} (${year} Guide)${tail}`, `Why ${k} Matters${tail}`, `${k} Tips from Experts${tail}`];
      const titles = [...(byType[v.type] ?? byType['Service page']), ...generic];
      return [
        {
          kind: 'table',
          title: 'Title ideas',
          columns: ['Title', 'Length', 'Status'],
          rows: titles.map((t) => [t, `${t.length}`, t.length <= 60 ? '✓ Fits' : t.length <= 65 ? '~ May truncate' : '✗ Too long']),
        },
        { kind: 'list', title: 'Title checklist', items: ['Put the main keyword near the start', 'Keep it under ~60 characters', 'Make each page title unique', 'Write for the click, not just the keyword'] },
      ];
    },
  },
  {
    slug: 'meta-description-generator',
    title: 'Meta Description Generator',
    category: 'SEO',
    summary: 'Five meta descriptions sized for Google, each with your keyword and a reason to click.',
    service: 'SEO',
    fields: [
      { name: 'keyword', label: 'Main keyword', type: 'text', placeholder: 'e.g. yoga classes in Bengaluru', required: true },
      { name: 'benefit', label: 'Key benefit or offer', type: 'text', placeholder: 'e.g. small batches, certified trainers', required: true },
      { name: 'cta', label: 'Call to action', type: 'select', options: ['Book now', 'Get a free quote', 'Shop now', 'Learn more', 'Call today', 'Start free'], default: 'Learn more' },
    ],
    run: (v) => {
      const k = v.keyword.trim();
      const b = v.benefit.trim();
      const c = v.cta;
      const list = [
        `Looking for ${k}? ${cap(b)}. ${c} and see why customers choose us.`,
        `${cap(k)} with ${b}. Clear pricing, friendly support and results you can see. ${c}.`,
        `Discover ${k} that fits your needs: ${b}. ${c} today.`,
        `${cap(b)}: that's what makes our ${k} different. ${c} in under a minute.`,
        `Everything you need to know about ${k}, plus ${b}. ${c}.`,
      ];
      return [
        { kind: 'table', title: 'Meta descriptions', columns: ['Description', 'Length', 'Status'], rows: list.map((d) => [d, `${d.length}`, d.length >= 120 && d.length <= 160 ? '✓ Ideal' : d.length < 120 ? '~ Short: add detail' : '✗ Long: trim']) },
      ];
    },
  },
  {
    slug: 'proposal-generator',
    title: 'Proposal Generator',
    category: 'Business',
    summary: 'A clean client proposal with scope, timeline, pricing and next steps, ready to paste and send.',
    service: 'Consulting',
    fields: [
      { name: 'yourName', label: 'Your name / company', type: 'text', required: true },
      { name: 'client', label: 'Client name', type: 'text', required: true },
      { name: 'project', label: 'Project', type: 'text', placeholder: 'e.g. 5-page website redesign', required: true },
      { name: 'deliverables', label: 'Deliverables (one per line)', type: 'textarea', placeholder: 'Homepage design\nContact form\nSEO setup', required: true },
      { name: 'timeline', label: 'Timeline', type: 'text', placeholder: 'e.g. 3 weeks', default: '3 weeks' },
      { name: 'price', label: 'Price', type: 'text', placeholder: 'e.g. ₹25,000', required: true },
    ],
    run: (v) => {
      const items = v.deliverables.split('\n').map((s) => s.trim()).filter(Boolean);
      const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      const text = `PROPOSAL: ${v.project}
Prepared for ${v.client} by ${v.yourName} · ${today}

1. OBJECTIVE
Deliver ${v.project} that meets ${v.client}'s goals on time and on budget.

2. SCOPE OF WORK
${items.map((d, i) => `${i + 1}. ${d}`).join('\n')}

3. TIMELINE
Estimated ${v.timeline} from project start, with a review at each milestone.

4. INVESTMENT
${v.price}
Payment: 50% to start, 50% on delivery.

5. WHAT'S NOT INCLUDED
Anything outside the scope above is quoted separately before work begins.

6. NEXT STEPS
Reply to confirm, and we'll schedule the kickoff call and share the invoice.

Thank you for the opportunity.
${v.yourName}`;
      return [{ kind: 'text', title: 'Your proposal', text }];
    },
  },
  {
    slug: 'marketing-idea-generator',
    title: 'Marketing Idea Generator',
    category: 'Business',
    summary: 'Twelve practical marketing ideas matched to your goal and budget, not generic advice.',
    service: 'Digital Marketing',
    fields: [
      { name: 'industry', label: 'Industry', type: 'select', options: INDUSTRIES, default: 'Other' },
      { name: 'goal', label: 'Main goal', type: 'select', options: ['Leads', 'Sales', 'Awareness', 'Trust'], default: 'Leads' },
      { name: 'budget', label: 'Budget', type: 'select', options: ['Low', 'Medium', 'High'], default: 'Low' },
    ],
    run: (v, seed) => {
      const rand = rng(seed ^ hash(v.industry + v.goal + v.budget));
      const order = { Low: 0, Medium: 1, High: 2 } as const;
      const max = order[v.budget as keyof typeof order] ?? 0;
      const matches = ideaBank.filter((i) => i.goals.includes(v.goal) && order[i.budget] <= max);
      const others = ideaBank.filter((i) => !matches.includes(i) && order[i.budget] <= max);
      const chosen = [...pickN(matches, 8, rand), ...pickN(others, 12, rand)].slice(0, 12);
      return [{ kind: 'table', title: `Ideas for ${v.industry} · goal: ${v.goal}`, columns: ['#', 'Idea', 'Budget'], rows: chosen.map((c, i) => [`${i + 1}`, c.idea, c.budget]) }];
    },
  },
  {
    slug: 'website-audit',
    title: 'Website Audit',
    category: 'Website',
    summary: 'Sixteen live checks on any public homepage: speed, SEO, mobile, trust, sharing and contact paths.',
    service: 'Website Development',
    fields: [{ name: 'url', label: 'Website address', type: 'text', placeholder: 'example.com', required: true }],
    run: async (v) => {
      const r = await postJson<SiteCheckResponse>('/api/growth-score', { url: v.url });
      if (!r.reachable) return [{ kind: 'text', title: 'Could not reach the site', text: 'The website did not respond or blocked the check. Make sure the address is correct and public.' }];
      const passed = r.checks.filter((c) => c.pass).length;
      return [
        { kind: 'metrics', title: 'Summary', items: [{ label: 'Checks passed', value: `${passed}/${r.checks.length}` }, { label: 'Checked URL', value: new URL(r.finalUrl!).hostname }] },
        { kind: 'checks', title: 'Results', items: r.checks.map((c) => ({ label: c.label, pass: c.pass, detail: c.detail })) },
      ];
    },
  },
  {
    slug: 'roi-calculator',
    title: 'ROI Calculator',
    category: 'Business',
    summary: 'Estimate what better conversion and automation are worth in revenue and hours each month.',
    service: 'AI Automation',
    fields: [
      { name: 'visitors', label: 'Monthly website visitors', type: 'number', default: '2000', required: true },
      { name: 'conversion', label: 'Current conversion rate (%)', type: 'number', default: '1.5', required: true },
      { name: 'value', label: 'Average customer value (₹)', type: 'number', default: '5000', required: true },
      { name: 'uplift', label: 'Expected conversion improvement (%)', type: 'number', default: '30', help: 'e.g. 30 means 1.5% becomes 1.95%' },
      { name: 'hours', label: 'Hours/week on manual admin', type: 'number', default: '8' },
      { name: 'hourly', label: 'Value of an hour (₹)', type: 'number', default: '500' },
    ],
    run: (v) => {
      const n = (k: string) => Math.max(0, parseFloat(v[k]) || 0);
      const current = n('visitors') * (n('conversion') / 100);
      const improved = current * (1 + n('uplift') / 100);
      const extraRevenue = (improved - current) * n('value');
      const automation = n('hours') * 4.33 * 0.6 * n('hourly');
      return [
        {
          kind: 'metrics',
          title: 'Estimated monthly impact',
          items: [
            { label: 'Customers now', value: current.toFixed(1) },
            { label: 'Customers after', value: improved.toFixed(1) },
            { label: 'Extra revenue / month', value: fmtINR(extraRevenue) },
            { label: 'Automation savings / month', value: fmtINR(automation), note: 'assumes 60% of admin hours automated' },
            { label: 'Total / year', value: fmtINR((extraRevenue + automation) * 12) },
          ],
        },
        { kind: 'text', title: 'How this is calculated', text: 'Customers = visitors × conversion rate. Extra revenue = extra customers × average value. Automation savings = weekly admin hours × 4.33 weeks × 60% × hourly value. These are estimates to guide decisions, not guarantees.' },
      ];
    },
  },
  {
    slug: 'social-media-content-generator',
    title: 'Social Media Content Generator',
    category: 'Content',
    summary: 'A 30-day content plan with post types, topics and hooks for your niche and platform.',
    service: 'Digital Marketing',
    fields: [
      { name: 'niche', label: 'Your niche / business', type: 'text', placeholder: 'e.g. home bakery', required: true },
      { name: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'LinkedIn', 'YouTube Shorts', 'Facebook', 'X (Twitter)'], default: 'Instagram' },
      { name: 'frequency', label: 'Posts per week', type: 'select', options: ['3', '5', '7'], default: '5' },
    ],
    run: (v, seed) => {
      const rand = rng(seed ^ hash(v.niche + v.platform));
      const niche = v.niche.trim();
      const perWeek = parseInt(v.frequency) || 5;
      const formats = v.platform === 'LinkedIn' ? ['Text post', 'Carousel', 'Document', 'Poll', 'Short video'] : v.platform.startsWith('YouTube') ? ['Short', 'Short', 'Short', 'Community post'] : ['Reel', 'Carousel', 'Story', 'Single image', 'Reel'];
      const themes = [
        ['Educational', `3 things people get wrong about ${niche}`],
        ['Behind the scenes', `A day in the life at our ${niche}`],
        ['Social proof', `Customer story: before and after`],
        ['Product / offer', `Why our ${niche} is different`],
        ['Engagement', `This or that? (${niche} edition)`],
        ['Educational', `Beginner's guide to ${niche}`],
        ['Personal', `Why I started this ${niche}`],
        ['Trend', `A trending audio with a ${niche} twist`],
        ['FAQ', `Answering your most asked ${niche} question`],
        ['Offer', `This week's highlight / limited offer`],
        ['Tips', `Quick tip you can use today`],
        ['Myth vs fact', `${cap(niche)} myth, busted`],
      ];
      const dayIdx = perWeek === 7 ? [0, 1, 2, 3, 4, 5, 6] : perWeek === 5 ? [0, 1, 2, 3, 4] : [0, 2, 4];
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const rows: string[][] = [];
      for (let d = 0; d < 30; d++) {
        if (!dayIdx.includes(d % 7)) continue;
        const [type, topic] = themes[Math.floor(rand() * themes.length)];
        rows.push([`Day ${d + 1} (${dayNames[d % 7]})`, formats[Math.floor(rand() * formats.length)], type, topic]);
      }
      return [{ kind: 'table', title: `30-day ${v.platform} plan`, columns: ['Day', 'Format', 'Pillar', 'Idea'], rows }];
    },
  },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
