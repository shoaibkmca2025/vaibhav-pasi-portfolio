// Digital products. Prices charged come from shared/catalog.ts (same `id`).
// A product can only be delivered once its file URL is set in the FILE_<ID> env var.

export interface Product {
  id: string;
  title: string;
  price: string;
  priceRange?: string;
  category: 'AI' | 'Marketing' | 'Business' | 'Web';
  summary: string;
  features: string[];
  // Cover artwork is drawn in CSS from these two colours (no stock images)
  accent: [string, string];
  format: string;
}

export const products: Product[] = [
  {
    id: 'ai-marketing-prompt-pack',
    title: 'AI Marketing Prompt Pack',
    price: '₹499',
    priceRange: '₹499 – ₹999',
    category: 'AI',
    summary: 'Ready-to-use prompts for content ideas, captions, ad copy, emails and campaign planning with ChatGPT, Claude or Gemini.',
    features: ['Prompts grouped by marketing task', 'Fill-in-the-blank templates for your brand', 'Examples of strong vs weak outputs'],
    accent: ['#f5ff00', '#7c3aed'],
    format: 'PDF + Notion',
  },
  {
    id: 'social-media-content-calendar',
    title: 'Social Media Content Calendar',
    price: '₹499',
    priceRange: '₹499 – ₹999',
    category: 'Marketing',
    summary: 'A planning system for consistent posting: content pillars, monthly calendar, post tracker and idea bank.',
    features: ['Monthly and weekly calendar views', 'Content pillar planner', 'Post status tracker', 'Idea bank by content type'],
    accent: ['#22d3ee', '#0f172a'],
    format: 'Google Sheets + Notion',
  },
  {
    id: 'marketing-strategy-templates',
    title: 'Marketing Strategy Templates',
    price: '₹999',
    category: 'Marketing',
    summary: 'Templates to plan positioning, audience, offers, channels and campaigns on one page, then turn them into action.',
    features: ['One-page marketing plan', 'Audience and positioning worksheet', 'Campaign planning template', 'Monthly review template'],
    accent: ['#f97316', '#1e1b4b'],
    format: 'Google Docs + Sheets',
  },
  {
    id: 'freelancer-proposal-kit',
    title: 'Freelancer Proposal Kit',
    price: '₹999',
    category: 'Business',
    summary: 'Proposal, scope and pricing templates to send clear, professional quotes that are easier to say yes to.',
    features: ['Proposal template', 'Scope of work template', 'Pricing and packages worksheet', 'Follow-up email templates'],
    accent: ['#a3e635', '#052e16'],
    format: 'Google Docs',
  },
  {
    id: 'website-planning-kit',
    title: 'Website Planning Kit',
    price: '₹999',
    category: 'Web',
    summary: 'Plan a website that converts before you build it: sitemap, page-by-page content outline, and launch checklist.',
    features: ['Sitemap planner', 'Page content outlines', 'Conversion checklist', 'SEO and launch checklist'],
    accent: ['#60a5fa', '#111827'],
    format: 'PDF + Google Docs',
  },
  {
    id: 'business-automation-templates',
    title: 'Business Automation Templates',
    price: '₹999',
    priceRange: '₹999 – ₹1,999',
    category: 'Business',
    summary: 'Workflow blueprints for lead follow-up, enquiry routing, notifications and reporting you can adapt to your tools.',
    features: ['Lead capture to follow-up blueprint', 'Enquiry routing blueprint', 'Notification and reporting flows', 'Setup notes for common tools'],
    accent: ['#f472b6', '#1f0a1a'],
    format: 'PDF + workflow files',
  },
  {
    id: 'ai-business-toolkit',
    title: 'AI Business Toolkit',
    price: '₹1,499',
    priceRange: '₹1,499 – ₹2,999',
    category: 'AI',
    summary: 'A practical toolkit for using AI across marketing, sales and operations, with prompts, checklists and use-case guides.',
    features: ['AI use-case map by department', 'Prompt library', 'Tool selection checklist', 'Rollout and policy template'],
    accent: ['#f5ff00', '#0a0a0a'],
    format: 'PDF + Notion',
  },
];
