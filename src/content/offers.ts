// Productized offers ("Start small") and the START / GROW / SCALE pricing tiers.
// `checkoutId` must match an item in shared/catalog.ts (that file holds the price actually charged).

export interface Offer {
  id: string;
  title: string;
  price: string;
  priceNote?: string;
  summary: string;
  includes: string[];
  cta: string;
  // How the CTA works: pay online, or go to a form/page
  action: { type: 'checkout'; checkoutId: string } | { type: 'link'; href: string };
  featured?: boolean;
}

export const offers: Offer[] = [
  {
    id: 'growth-audit',
    title: 'Digital Growth Audit',
    price: '₹1,499',
    summary: 'A practical review of where your business is losing visibility, trust and leads online, with a clear list of what to fix first.',
    includes: [
      'Website review',
      'UX review',
      'Conversion review',
      'SEO observations',
      'Social media observations',
      'Competitor and positioning observations',
      'Priority action plan',
    ],
    cta: 'Get My Audit',
    action: { type: 'checkout', checkoutId: 'growth-audit' },
    featured: true,
  },
  {
    id: 'strategy-call',
    title: 'Strategy Call',
    price: '₹2,500',
    priceNote: '60 minutes',
    summary: 'A focused 60-minute consultation on the growth or technology decision in front of you.',
    includes: ['Website', 'Marketing', 'AI', 'Automation', 'SEO', 'Growth', 'Software'],
    cta: 'Book a Strategy Call',
    action: { type: 'link', href: '/consulting' },
  },
  {
    id: 'website-sprint',
    title: 'Website Sprint',
    price: '₹15,000 – ₹25,000',
    priceNote: 'final price depends on pages and features',
    summary: 'A fast, conversion-focused business website or landing page, planned, built and launched in a short sprint.',
    includes: ['Page structure and copy outline', 'Responsive build', 'Lead capture and WhatsApp', 'SEO foundations', 'Analytics setup', 'Launch support'],
    cta: 'Build My Website',
    action: { type: 'link', href: '/hire-me?service=Website%20Development' },
  },
  {
    id: 'growth-system',
    title: 'Business Growth System',
    price: 'Custom',
    summary: 'Website, marketing, SEO, automation and analytics planned and built as one connected system.',
    includes: ['Website', 'Marketing', 'SEO', 'Automation', 'Analytics'],
    cta: 'Request Proposal',
    action: { type: 'link', href: '/hire-me?service=Business%20Growth%20System' },
  },
];

export interface PricingTier {
  name: 'START' | 'GROW' | 'SCALE';
  audience: string;
  price: string;
  cadence?: string;
  timeline: string;
  deliverables: string[];
  cta: string;
  href: string;
  highlight?: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'START',
    audience: 'For individuals and small businesses',
    price: '₹15,000',
    cadence: 'starting, one-time',
    timeline: '1–3 weeks',
    deliverables: ['Website or landing page sprint', 'Lead capture + WhatsApp integration', 'SEO foundations', 'Analytics setup'],
    cta: 'Start a Project',
    href: '/hire-me?service=Website%20Development&budget=%E2%82%B915%2C000%20%E2%80%93%20%E2%82%B950%2C000',
  },
  {
    name: 'GROW',
    audience: 'For businesses ready to scale',
    price: '₹20,000 – ₹50,000',
    cadence: 'per month',
    timeline: 'Monthly retainer',
    deliverables: ['Digital marketing and content strategy', 'SEO and conversion improvements', 'Campaign planning', 'Monthly reporting and review call'],
    cta: 'Discuss a Retainer',
    href: '/hire-me?service=Digital%20Marketing&budget=Monthly%20retainer%20(%E2%82%B920%2C000%20%E2%80%93%20%E2%82%B950%2C000)',
    highlight: true,
  },
  {
    name: 'SCALE',
    audience: 'For companies needing custom technology and automation',
    price: 'Custom',
    timeline: 'Scoped per project',
    deliverables: ['CRM or business software', 'AI and workflow automation', 'Integrations across your tools', 'Dashboards and analytics'],
    cta: 'Request a Proposal',
    href: '/hire-me?service=AI%20Automation',
  },
];
