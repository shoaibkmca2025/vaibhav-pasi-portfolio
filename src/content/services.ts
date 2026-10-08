// Services shown on the home page, /services and each /services/<slug> landing page.
// Edit copy, deliverables and prices here; pages update automatically.

export type ServiceIcon = 'globe' | 'megaphone' | 'search' | 'bot' | 'database' | 'code' | 'compass';

export interface Service {
  slug: string;
  // Consulting has its own page; everything else gets /services/<slug>
  href: string;
  title: string;
  navTitle: string;
  icon: ServiceIcon;
  short: string;
  intro: string;
  deliverables: string[];
  useCases: string[];
  process: { title: string; text: string }[];
  price: string;
  priceNote: string;
  whatsapp: string;
  seo: { title: string; description: string };
  faqs: { question: string; answer: string }[];
}

export const services: Service[] = [
  {
    slug: 'website-development',
    href: '/services/website-development',
    title: 'Websites & Landing Pages',
    navTitle: 'Website Development',
    icon: 'globe',
    short: 'Conversion-focused business websites, landing pages and web experiences that turn visitors into enquiries.',
    intro:
      'A website should do one job well: turn the right visitors into enquiries. I plan the structure around your offer, write for your buyer, and build fast, mobile-first pages with clear calls to action, analytics and SEO foundations from day one.',
    deliverables: [
      'Page structure and conversion copy outline',
      'Responsive design for mobile, tablet and desktop',
      'Fast, SEO-ready build with metadata and sitemap',
      'Lead forms, WhatsApp and email capture',
      'Analytics and conversion tracking setup',
      'Launch, domain and hosting setup',
    ],
    useCases: ['New business website', 'Landing page for an ad campaign', 'Redesign of an outdated site', 'Personal brand or portfolio site'],
    process: [
      { title: 'Discovery', text: 'Goals, audience, offer and competitors in one focused session.' },
      { title: 'Structure & copy', text: 'Page map and messaging so every section moves the visitor forward.' },
      { title: 'Design & build', text: 'Responsive build with forms, tracking and SEO foundations.' },
      { title: 'Launch & measure', text: 'Go live, connect analytics and review early conversion data.' },
    ],
    price: 'From ₹15,000',
    priceNote: 'Typical Website Sprint: ₹15,000 – ₹25,000 depending on pages and features.',
    whatsapp: "Hi Vaibhav, I'd like to discuss a website for my business.",
    seo: {
      title: 'Website Development for Businesses | Vaibhav Pasi',
      description:
        'Conversion-focused business websites and landing pages: fast, mobile-first, SEO-ready builds with lead capture and analytics. Website Sprint from ₹15,000.',
    },
    faqs: [
      { question: 'How long does a website take?', answer: 'A focused Website Sprint (up to about five pages) usually takes one to three weeks from the discovery call, depending on how quickly content and feedback come in.' },
      { question: 'Will I be able to edit the website myself?', answer: 'Yes. The build can use an editable content setup so you can change text, images and blog posts without touching code. We agree the approach during discovery.' },
      { question: 'Do you write the website copy?', answer: 'I outline the structure and messaging for every section and can write the full copy, or refine the copy you already have.' },
    ],
  },
  {
    slug: 'digital-marketing',
    href: '/services/digital-marketing',
    title: 'Digital Marketing',
    navTitle: 'Digital Marketing',
    icon: 'megaphone',
    short: 'Social media, content, campaign strategy and digital growth systems built around measurable goals.',
    intro:
      'Posting more is not a strategy. I set clear goals, define content pillars your audience actually cares about, plan campaigns, and track what turns attention into enquiries, so marketing becomes a system instead of guesswork.',
    deliverables: [
      'Marketing audit and growth plan',
      'Content pillars and monthly content calendar',
      'Short-form video and post strategy',
      'Campaign planning for launches and offers',
      'Performance ad strategy and targeting',
      'Monthly reporting on reach, engagement and leads',
    ],
    useCases: ['Inconsistent or low-reach social media', 'Launching a product or service', 'Building a personal brand', 'Turning followers into customers'],
    process: [
      { title: 'Audit', text: 'Where your current content, channels and funnel stand today.' },
      { title: 'Strategy', text: 'Audience, positioning, content pillars and channel plan.' },
      { title: 'Execution', text: 'Calendar, content direction, campaigns and publishing rhythm.' },
      { title: 'Optimise', text: 'Monthly review of what performs and what to change.' },
    ],
    price: 'From ₹20,000 / month',
    priceNote: 'Retainers typically ₹20,000 – ₹50,000 per month depending on channels and volume.',
    whatsapp: "Hi Vaibhav, I'd like to discuss digital marketing for my business.",
    seo: {
      title: 'Digital Marketing & Social Media Strategy | Vaibhav Pasi',
      description:
        'Social media, content strategy, campaigns and performance marketing planned as one growth system, with monthly reporting. Retainers from ₹20,000/month.',
    },
    faqs: [
      { question: 'Do you manage posting as well as strategy?', answer: 'Yes. Engagements can cover strategy only, or strategy plus content direction, calendars and publishing, depending on your team.' },
      { question: 'Which platforms do you work with?', answer: 'Mainly Instagram, LinkedIn, YouTube and X, plus Meta and Google ads, chosen according to where your buyers spend time.' },
      { question: 'When will I see results?', answer: 'Early engagement signals usually show within the first month; lead and sales impact typically builds over two to three months of consistent execution.' },
    ],
  },
  {
    slug: 'seo',
    href: '/services/seo',
    title: 'SEO',
    navTitle: 'SEO',
    icon: 'search',
    short: 'Search visibility through technical SEO, on-page optimisation and a content strategy aimed at buyers.',
    intro:
      'SEO is how customers find you when they are already looking. I fix the technical foundations, optimise the pages that should rank, and plan content around the searches your buyers make, including structured data that helps Google and AI assistants understand your business.',
    deliverables: [
      'Technical SEO audit and fixes',
      'Keyword and search-intent research',
      'On-page optimisation of key pages',
      'Structured data (schema) implementation',
      'Content plan and article briefs',
      'Google Search Console setup and reporting',
    ],
    useCases: ['Not showing up on Google', 'Website traffic without enquiries', 'Launching a new site the right way', 'Local and service-area visibility'],
    process: [
      { title: 'Audit', text: 'Crawl, indexing, speed, metadata and structured data review.' },
      { title: 'Research', text: 'Keywords and questions your buyers actually search.' },
      { title: 'Optimise', text: 'Fix foundations and improve the pages that matter most.' },
      { title: 'Grow', text: 'Content plan and monthly tracking in Search Console.' },
    ],
    price: 'Custom quote',
    priceNote: 'Start with the ₹1,499 Digital Growth Audit to see what needs fixing first.',
    whatsapp: "Hi Vaibhav, I'd like to discuss SEO for my website.",
    seo: {
      title: 'SEO Services: Technical SEO, On-Page & Content | Vaibhav Pasi',
      description:
        'Technical SEO audits, on-page optimisation, structured data and content strategy aimed at the searches your buyers make. Start with a ₹1,499 audit.',
    },
    faqs: [
      { question: 'How long does SEO take to work?', answer: 'Technical fixes can show results within weeks; competitive rankings usually take three to six months of consistent work.' },
      { question: 'Do you guarantee first-page rankings?', answer: 'No one can honestly guarantee rankings. I focus on the factors you control: technical health, relevant content and a site that deserves to rank.' },
    ],
  },
  {
    slug: 'ai-automation',
    href: '/services/ai-automation',
    title: 'AI Automation',
    navTitle: 'AI Automation',
    icon: 'bot',
    short: 'Automate repetitive business work with AI, workflows and integrations between the tools you already use.',
    intro:
      'Most businesses lose hours every week copying data between forms, sheets, inboxes and WhatsApp. I map those repetitive steps and replace them with reliable automated workflows, using AI where it genuinely helps, such as qualifying enquiries or drafting replies, with a human in the loop where it matters.',
    deliverables: [
      'Process mapping of repetitive work',
      'Automated lead capture and follow-up',
      'AI-assisted enquiry qualification and replies',
      'Integrations between forms, CRM, sheets, email and WhatsApp',
      'Owner notifications and daily summaries',
      'Documentation and handover',
    ],
    useCases: ['Leads going cold before follow-up', 'Manual data entry between tools', 'Answering the same questions repeatedly', 'Order and invoice notifications'],
    process: [
      { title: 'Map', text: 'List the repetitive steps and where time is lost.' },
      { title: 'Design', text: 'Choose tools and design the workflow with fallbacks.' },
      { title: 'Build', text: 'Implement, connect and test with real data.' },
      { title: 'Handover', text: 'Documentation, monitoring and team walkthrough.' },
    ],
    price: 'Custom quote',
    priceNote: 'Scoped after a strategy call; small workflows are often a fixed-price project.',
    whatsapp: "Hi Vaibhav, I'd like to discuss AI automation for my business.",
    seo: {
      title: 'AI Automation & Business Workflow Automation | Vaibhav Pasi',
      description:
        'Automate lead follow-up, data entry, enquiries and notifications with AI and integrations between your forms, CRM, sheets, email and WhatsApp.',
    },
    faqs: [
      { question: 'Which tools do you use for automation?', answer: 'It depends on your stack. Typical building blocks are n8n or similar workflow tools, Google Sheets, CRMs, email, WhatsApp and AI models, connected through their APIs.' },
      { question: 'Will AI reply to my customers without me?', answer: 'Only if you want it to. Most setups draft or suggest replies and escalate to a person for anything important.' },
    ],
  },
  {
    slug: 'crm-development',
    href: '/services/crm-development',
    title: 'CRM & Business Software',
    navTitle: 'CRM Development',
    icon: 'database',
    short: 'Custom CRM systems, dashboards, portals and internal tools built around how your team actually works.',
    intro:
      'Spreadsheets break once a business grows. I build lightweight CRMs, dashboards and internal tools that match your sales and operations process, so leads, customers and tasks live in one place, with the reports you actually need.',
    deliverables: [
      'Lead and customer pipeline with custom stages',
      'Dashboards and reports',
      'Role-based access for your team',
      'Integrations with website forms, email and WhatsApp',
      'Data import from existing sheets',
      'Training and documentation',
    ],
    useCases: ['Leads tracked in scattered sheets', 'No visibility of sales pipeline', 'Client portal or internal tool', 'Reporting takes hours every week'],
    process: [
      { title: 'Requirements', text: 'Your pipeline, roles, data and reports.' },
      { title: 'Prototype', text: 'Clickable first version to confirm the workflow.' },
      { title: 'Build', text: 'Database, interface, integrations and access control.' },
      { title: 'Rollout', text: 'Data migration, training and support.' },
    ],
    price: 'Custom quote',
    priceNote: 'Projects typically ₹15,000 – ₹75,000 depending on scope.',
    whatsapp: "Hi Vaibhav, I'd like to discuss a CRM or business software for my team.",
    seo: {
      title: 'Custom CRM Development & Business Dashboards | Vaibhav Pasi',
      description:
        'Custom CRMs, dashboards, client portals and internal tools built around your sales and operations process, integrated with your website, email and WhatsApp.',
    },
    faqs: [
      { question: 'Why custom instead of an off-the-shelf CRM?', answer: 'Off-the-shelf tools are often the right choice, and I will say so. Custom makes sense when your process is specific, the per-seat cost is too high, or you need tight integrations.' },
    ],
  },
  {
    slug: 'software-development',
    href: '/services/software-development',
    title: 'Software Development',
    navTitle: 'Software Development',
    icon: 'code',
    short: 'Web applications, APIs and integrations for businesses that need more than a website.',
    intro:
      'When a business process needs its own software, I design and build web applications and APIs with a focus on reliability, maintainability and a clean handover, from the first prototype to production.',
    deliverables: ['Requirements and technical plan', 'Web application front end and back end', 'APIs and third-party integrations', 'Authentication and access control', 'Deployment and monitoring', 'Documentation and handover'],
    useCases: ['Booking, ordering or quoting systems', 'Integrating tools that do not talk to each other', 'Internal tools and admin panels', 'MVP for a new product idea'],
    process: [
      { title: 'Plan', text: 'Scope, architecture and milestones.' },
      { title: 'Prototype', text: 'Validate the core flow early.' },
      { title: 'Build', text: 'Iterative delivery with regular demos.' },
      { title: 'Launch', text: 'Deployment, monitoring and support.' },
    ],
    price: 'Custom quote',
    priceNote: 'Projects typically ₹15,000 – ₹75,000+ depending on scope.',
    whatsapp: "Hi Vaibhav, I'd like to discuss a software development project.",
    seo: {
      title: 'Custom Software & Web App Development | Vaibhav Pasi',
      description: 'Web applications, APIs and integrations for businesses: from prototype to production with a clean, documented handover.',
    },
    faqs: [
      { question: 'Do you build mobile apps?', answer: 'I focus on web applications, which work on every device and can be installed on phones. For native app needs we can discuss the right approach.' },
    ],
  },
  {
    slug: 'consulting',
    href: '/consulting',
    title: 'Consulting',
    navTitle: 'Consulting',
    icon: 'compass',
    short: 'Strategy sessions on websites, marketing, automation and technology decisions, with a clear action plan.',
    intro: 'A focused session to untangle a growth, marketing or technology decision and leave with a prioritised plan.',
    deliverables: ['60-minute focused session', 'Pre-call questionnaire review', 'Prioritised action plan', 'Recommended tools and next steps'],
    useCases: ['Choosing what to fix first', 'Planning a website or campaign', 'Evaluating automation ideas', 'Second opinion on a technology decision'],
    process: [],
    price: 'From ₹2,500',
    priceNote: '60-minute strategy call.',
    whatsapp: "Hi Vaibhav, I'd like to book a strategy call.",
    seo: { title: 'Consulting', description: '' },
    faqs: [],
  },
];

export const landingServices = services.filter((s) => s.href.startsWith('/services/'));
export const getService = (slug: string) => landingServices.find((s) => s.slug === slug);
