import { contactEmail, socialLinks } from './contact';

// Live address of the site: every canonical URL, sitemap entry and structured-data ID is built from it
export const SITE_URL = 'https://vaibhavpasi.online';

export const SITE_NAME = 'Vaibhav Pasi';

export const DEFAULT_TITLE = 'Vaibhav Pasi | Digital Marketer, Developer & AI Consultant';
export const DEFAULT_DESCRIPTION =
  'Vaibhav Pasi is a digital marketing strategist, software developer and AI consultant, and Co-Founder of 4AM Global Media, helping brands scale with growth marketing, AI and e-commerce.';

export const PORTRAIT_URL = `${SITE_URL}/vaibhav-pasi.jpg`;
// 1200x630 image shown in link previews on WhatsApp, LinkedIn, X, etc.
export const SHARE_IMAGE_URL = `${SITE_URL}/vaibhav-pasi-og.jpg`;

export const person = {
  name: 'Vaibhav Pasi',
  givenName: 'Vaibhav',
  familyName: 'Pasi',
  jobTitle: 'Digital Marketing Strategist, Software Developer & AI Consultant',
  organization: { name: '4AM Global Media', url: 'https://4amglobalmedia.com' },
  email: contactEmail,
  country: 'India',
  sameAs: socialLinks.map((s) => s.href),
  knowsAbout: [
    'Digital Marketing Strategy',
    'Social Media Growth',
    'Performance Marketing',
    'Search Engine Optimization',
    'AI & Business Automation',
    'Software & Web Development',
    'Product Onboarding & Marketplace Management',
    'Quick Commerce & E-commerce',
    'Branding & Creative Strategy',
    'AI Workshops & Corporate Training',
  ],
};

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
