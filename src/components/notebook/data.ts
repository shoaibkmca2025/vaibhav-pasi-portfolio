// Content for the notebook-style home page. Edit copy here rather than inside the components.

export const navItems = [
  { label: 'Home', id: 'home' },
  { label: 'Origin', id: 'origin' },
  { label: 'Projects', id: 'projects' },
  { label: 'Best Work', id: 'bestwork' },
  { label: 'Visuals', id: 'visuals' },
  { label: 'Contact', id: 'contact' },
] as const;

export const roles = [
  { stage: 'Started As', title: 'Marketer' },
  { stage: 'Became', title: 'Developer' },
  { stage: 'Currently', title: 'Co-Founder, 4AM' },
];

export const heroBadges = ['4AM Global Media', 'India', 'Tech x Marketing'];

export const originStory = {
  headline: ['I started', 'marketing brands', 'in 2019 because', 'I wanted to see', 'if the internet', 'would listen.'],
  highlight: 'would listen.',
  micro: [
    "No agency, no budget, no playbook. Just a laptop, late nights and a habit of testing every idea until something moved the numbers.",
    'Then I learned to code, because the fastest way to grow a brand was to build the machine that grows it.',
  ],
  annotation: ['It started as posting things.', 'Then it became systems.', 'Then it became a company.'],
};

export const timeline = [
  { year: '2019', label: 'Started the digital marketing journey' },
  { year: '2021', label: 'Scaled a first brand to 1M+ reach' },
  { year: '2023', label: 'Built a full-stack marketing ecosystem' },
  { year: '2025', label: 'Co-founded 4AM Global Media' },
  { year: '2026', label: '100+ brands served, featured in 15+ publications' },
];

export const bigStat = { value: '30M+', label: 'Reach generated', aside: 'crazy what happens when you mix code with marketing.' };

export const philosophy = {
  title: 'Tech with a purpose.',
  body: "I'm a builder at heart. I obsess over systems, but I love it most when the system actually makes a brand grow and people take action.",
  tagline: 'beautiful growth that actually works.',
};

export const workedOn = {
  intro: 'Co-Founder of',
  company: '4AM Global Media',
  places: ['Blinkit', 'Zepto', 'Instamart', 'Amazon', 'Flipkart'],
  outro: 'Launched and scaled brands across quick-commerce and e-commerce, and ran AI workshops for students, founders and corporate teams.',
};

export const metricStamps = [
  { value: '100+', label: 'Brands scaled', note: 'across D2C, SaaS and retail.' },
  { value: '200+', label: 'Projects delivered', note: 'websites, apps, automations.' },
  { value: '15+', label: 'Press features', note: 'mom finally gets what I do.' },
];

export const stickers = ['AI', 'SEO', '4AM', 'SHIP IT', 'ROAS', 'q-comm'];

export interface CaseFile {
  id: string;
  station: string;
  title: string;
  category: string;
  image: string;
  summary: string;
  goals: string;
  strategy: string[];
  results: { label: string; value: string }[];
}

// Used by both the stacked project cards and the metro "Best Work" route
export const caseFiles: CaseFile[] = [
  {
    id: 'growth-01',
    station: 'Brand Growth',
    title: '4AM Global Media: scaling to 100K+',
    category: 'Viral Growth',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop',
    summary: 'Zero to 100K+ followers in 12 months with no paid acquisition.',
    goals: 'Establish a dominant digital presence and reach 100,000 active followers within 12 months without paid acquisition.',
    strategy: [
      'Iterative algorithmic testing for short-form video.',
      'Narrative-driven content pillars built around one clear point of view.',
      'High-frequency distribution across X and Instagram.',
    ],
    results: [
      { label: 'Followers', value: '112,400' },
      { label: 'Avg monthly reach', value: '1.2M' },
      { label: 'Conversion rate', value: '8.4%' },
    ],
  },
  {
    id: 'tech-01',
    station: 'E-com Rebuild',
    title: 'Luxury e-commerce re-architecture',
    category: 'Software',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
    summary: 'Headless rebuild that cut load time to 0.9s and lifted checkout 42%.',
    goals: 'Reduce cart abandonment and improve mobile performance for a high-ticket lifestyle brand.',
    strategy: [
      'Migrated to a headless commerce architecture on Next.js.',
      'One-click checkout and AI-driven product recommendations.',
      'LCP optimisation for users around the world.',
    ],
    results: [
      { label: 'Page load', value: '0.9s' },
      { label: 'Checkout conv.', value: '+42%' },
      { label: 'Mobile sales', value: '+65%' },
    ],
  },
  {
    id: 'viral-01',
    station: 'Viral Sprint',
    title: '30-day viral social campaign',
    category: 'Social',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    summary: 'A 30-day content sprint that pulled 2.5M impressions.',
    goals: 'Turn a quiet brand account into a demand engine in a single month.',
    strategy: [
      'Daily short-form content built on tested hooks.',
      'Creator collaborations to borrow trust and reach.',
      'Retargeting warm viewers into a simple offer.',
    ],
    results: [
      { label: 'Impressions', value: '2.5M' },
      { label: 'Duration', value: '30 days' },
      { label: 'Paid spend', value: 'Minimal' },
    ],
  },
  {
    id: 'qcomm-01',
    station: 'Q-Comm Launch',
    title: 'Quick-commerce onboarding',
    category: 'Marketplace',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
    summary: 'End-to-end launch on Blinkit, Zepto and Instamart.',
    goals: 'Get a D2C brand live and selling on India’s quick-commerce apps without months of back-and-forth.',
    strategy: [
      'Seller accounts, compliance and catalog set up in one pass.',
      'Listing optimisation and pricing strategy per platform.',
      'Inventory planning and post-launch growth consulting.',
    ],
    results: [
      { label: 'Platforms', value: '3' },
      { label: 'Catalog', value: 'Live' },
      { label: 'Support', value: 'End-to-end' },
    ],
  },
  {
    id: 'ai-01',
    station: 'AI Workshops',
    title: 'AI workshops and Vibe Coding sessions',
    category: 'Training',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop',
    summary: 'Hands-on AI training for students, founders and corporate teams.',
    goals: 'Help non-engineers adopt AI and ship their own digital products.',
    strategy: [
      'Practical, build-along sessions instead of slide decks.',
      'Automation recipes teams can reuse the next morning.',
      'Vibe Coding: from idea to working prototype in one sitting.',
    ],
    results: [
      { label: 'Format', value: 'Live' },
      { label: 'Audience', value: 'All levels' },
      { label: 'Output', value: 'Shipped apps' },
    ],
  },
];

export const visualTags = [
  'Growth Marketing',
  'Web Development',
  'AI Automation',
  'SEO',
  'Performance Ads',
  'Branding',
  'Q-Commerce',
  'Workshops',
];

export const galleryImages = [
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop',
];
