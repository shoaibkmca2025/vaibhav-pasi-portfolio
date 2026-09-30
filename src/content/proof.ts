// Testimonials, the trust bar and the technology list. Only verified content belongs here.

// Real client messages, quoted as sent (screenshot: /public/wins/client-messages.jpg).
// Add attributed testimonials (name, role, company) only with the client's permission.
export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  proof?: string;
}

export const testimonials: Testimonial[] = [
  { quote: 'Also, a video absolutely blew up. 340k on insta and 850k on tik tok.... crazy', author: 'Client', role: 'Creator', proof: '/wins/client-messages.jpg' },
  {
    quote: 'Our goal for this week was to get 1 reel to 5k views and my reel got up to 10.5k views! Really happy with it and it’s easily my most viewed reel.',
    author: 'Client',
    role: 'Creator',
    proof: '/wins/client-messages.jpg',
  },
  {
    quote: 'Since a few days ago my reels went from around 200-300 to about 500, there’s even one at about 3k!!',
    author: 'Client',
    role: 'Creator',
    proof: '/wins/client-messages.jpg',
  },
  {
    quote: 'Just closed a first client for the beta offer, it’s not even ready but he wanted to start right away!',
    author: 'Client',
    role: 'Business owner',
    proof: '/wins/client-messages.jpg',
  },
];

// Compact credibility facts. Every value here is backed by content on the site.
export const trustFacts = [
  { value: '2019', label: 'Working in digital marketing since' },
  { value: '4AM', label: 'Co-Founder, 4AM Global Media' },
  { value: '11', label: 'Press features (May 2026)' },
  { value: '3.1M', label: 'Best client reel views' },
  { value: '6', label: 'Service lines' },
];

export const industries = ['Creators & personal brands', 'D2C & e-commerce', 'Quick commerce', 'Startups & SMEs', 'Education & training', 'Professional services'];

// Technologies used in this website's own codebase or named in the services offered.
// Add a technology only if it is used in real work.
export const techGroups = [
  { group: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Vite'] },
  { group: 'Backend & APIs', items: ['Node.js', 'REST APIs', 'Serverless functions', 'Webhooks'] },
  { group: 'Data & CRM', items: ['Supabase / Postgres', 'Google Sheets', 'CRM integrations'] },
  { group: 'Automation & AI', items: ['n8n', 'AI models (LLMs)', 'WhatsApp & email automation'] },
  { group: 'Growth & SEO', items: ['Google Search Console', 'Google Analytics', 'Structured data', 'Meta & Google Ads'] },
  { group: 'Delivery', items: ['Git & GitHub', 'Vercel', 'Razorpay payments'] },
];
