// Everything that can be paid for on the site. The server charges ONLY these prices;
// the browser never sends an amount. Prices are in paise (₹1 = 100 paise).

export type CatalogKind = 'product' | 'offer';

export interface CatalogItem {
  id: string;
  kind: CatalogKind;
  name: string;
  amount: number; // paise
  // After payment: products get a download link, offers get the next step
  fulfilment: 'download' | 'booking' | 'onboarding';
  // Env var holding the private file URL for downloads (set in Vercel, never shipped to the browser)
  fileEnv?: string;
}

export const catalog: CatalogItem[] = [
  // Productized offers
  { id: 'growth-audit', kind: 'offer', name: 'Digital Growth Audit', amount: 1499_00, fulfilment: 'onboarding' },
  { id: 'strategy-call', kind: 'offer', name: '60-Minute Strategy Call', amount: 2500_00, fulfilment: 'booking' },

  // Digital products
  { id: 'ai-marketing-prompt-pack', kind: 'product', name: 'AI Marketing Prompt Pack', amount: 499_00, fulfilment: 'download', fileEnv: 'FILE_AI_MARKETING_PROMPT_PACK' },
  { id: 'social-media-content-calendar', kind: 'product', name: 'Social Media Content Calendar', amount: 499_00, fulfilment: 'download', fileEnv: 'FILE_SOCIAL_MEDIA_CONTENT_CALENDAR' },
  { id: 'marketing-strategy-templates', kind: 'product', name: 'Marketing Strategy Templates', amount: 999_00, fulfilment: 'download', fileEnv: 'FILE_MARKETING_STRATEGY_TEMPLATES' },
  { id: 'freelancer-proposal-kit', kind: 'product', name: 'Freelancer Proposal Kit', amount: 999_00, fulfilment: 'download', fileEnv: 'FILE_FREELANCER_PROPOSAL_KIT' },
  { id: 'website-planning-kit', kind: 'product', name: 'Website Planning Kit', amount: 999_00, fulfilment: 'download', fileEnv: 'FILE_WEBSITE_PLANNING_KIT' },
  { id: 'business-automation-templates', kind: 'product', name: 'Business Automation Templates', amount: 999_00, fulfilment: 'download', fileEnv: 'FILE_BUSINESS_AUTOMATION_TEMPLATES' },
  { id: 'ai-business-toolkit', kind: 'product', name: 'AI Business Toolkit', amount: 1499_00, fulfilment: 'download', fileEnv: 'FILE_AI_BUSINESS_TOOLKIT' },
];

export const getCatalogItem = (id: string) => catalog.find((c) => c.id === id);

export const formatINR = (paise: number) =>
  `₹${(paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
