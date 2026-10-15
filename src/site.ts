import { contactEmail, socialLinks } from './contact';

// Live address of the site: every canonical URL, sitemap entry and structured-data ID is built from it.
// www is the primary host (the bare domain redirects here), so canonicals never point at a redirect.
export const SITE_URL = 'https://www.vaibhavpasi.online';

export const SITE_NAME = 'Vaibhav Pasi';

export const DEFAULT_TITLE = 'Vaibhav Pasi | Software Developer & Digital Marketing Strategist';
// Home page meta description (written for the search result snippet)
export const DEFAULT_DESCRIPTION =
  "Software developer, digital marketing strategist and Co-Founder of 4AM Global Media. Explore Vaibhav Pasi's work in websites, SEO, marketing and AI automation.";
// Who he is, in one consistent statement: used for the Person and WebSite entities and llms.txt
export const PERSON_DESCRIPTION =
  'Vaibhav Pasi is a software developer and digital marketing strategist, an MCA graduate, and Co-Founder of 4AM Global Media. His work combines website development, SEO, digital marketing and AI-powered business automation.';

export const PORTRAIT_URL = `${SITE_URL}/vaibhav-pasi.jpg`;
// 1200x630 image shown in link previews on WhatsApp, LinkedIn, X, etc.
export const SHARE_IMAGE_URL = `${SITE_URL}/vaibhav-pasi-og.jpg`;

export const person = {
  name: 'Vaibhav Pasi',
  givenName: 'Vaibhav',
  familyName: 'Pasi',
  jobTitle: 'Software Developer, Digital Marketing Strategist & AI Automation Consultant',
  organization: { name: '4AM Global Media', url: 'https://4amglobalmedia.com' },
  email: contactEmail,
  country: 'India',
  sameAs: socialLinks.map((s) => s.href),
  knowsAbout: [
    'Software Development',
    'Website Development',
    'Search Engine Optimization',
    'Answer Engine Optimization',
    'Generative Engine Optimization',
    'Digital Marketing Strategy',
    'Conversion Rate Optimization',
    'Content Strategy',
    'Social Media Growth',
    'Performance Marketing',
    'AI & Business Automation',
    'Product Onboarding & Marketplace Management',
    'Quick Commerce & E-commerce',
    'Branding & Creative Strategy',
    'AI Workshops & Corporate Training',
  ],
};

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
