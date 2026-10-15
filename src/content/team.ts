import { socialLinks } from '../contact';

// The people behind 4AM Global Media, shown on /team.
// Edit profiles here; the page, its structured data and the sitemap update automatically.
//
// Content rules (please keep): publish only confirmed details. Leave `portrait`, `portfolioUrl`
// and `socialLinks` empty until real ones are supplied; the page shows initials instead of a photo
// and hides empty links. A profile with `profileDetailsConfirmed: false` shows only the name and a
// "Profile details coming soon" note, and is left out of the page's structured data.

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  shortDescription: string;
  // Each string is one paragraph
  biography: string[];
  roleAt4AM?: string;
  expertise: string[];
  experienceLabel?: string;
  quote?: string;
  // Path in /public (e.g. '/team/rupali-bagul.jpg') or empty for an initials placeholder
  portrait?: string;
  portfolioUrl?: string;
  socialLinks?: { label: string; href: string }[];
  profileDetailsConfirmed: boolean;
  // Used in structured data for confirmed co-founders only
  isFounder?: boolean;
}

export const team: TeamMember[] = [
  {
    id: 'vaibhav-pasi',
    name: 'Vaibhav Pasi',
    designation: 'Co-Founder | Digital Growth, Strategy & Technology',
    shortDescription:
      'Bringing together digital strategy, marketing, technology, and innovation to help businesses strengthen their online presence and grow through digital solutions.',
    biography: [
      'Vaibhav Pasi is the Co-Founder of 4AM Global Media, where he works at the intersection of digital marketing, technology, and business growth.',
      'With an interest in building digital experiences and developing practical growth strategies, Vaibhav focuses on helping businesses strengthen their digital presence through marketing strategy, website development, AI-powered solutions, and automation.',
      'His approach combines creative thinking with technical execution, connecting business objectives with digital opportunities to develop solutions that are purposeful, scalable, and aligned with client goals.',
      "At 4AM Global Media, he contributes to the agency's strategic direction, digital initiatives, and technology-driven projects, working to bring ideas from concept to execution.",
    ],
    roleAt4AM:
      "As Co-Founder, Vaibhav contributes to the agency's vision, strategic planning, client solutions, and technology initiatives. He works to connect marketing opportunities with practical implementation, helping transform business requirements into digital experiences and growth-focused solutions.",
    expertise: [
      'Digital Marketing Strategy',
      'Digital Growth Planning',
      'Website Development',
      'AI-Powered Solutions',
      'Business Strategy',
      'Marketing Technology',
      'Workflow Automation',
      'Digital Product Development',
    ],
    quote: 'Turning ideas into digital experiences through strategy, technology, and execution.',
    portrait: '/vaibhav-pasi.jpg',
    // Verified profiles from src/contact.ts
    socialLinks: socialLinks.filter((l) => l.label === 'LinkedIn' || l.label === 'Instagram').map((l) => ({ label: l.label, href: l.href })),
    profileDetailsConfirmed: true,
    isFounder: true,
  },
  {
    id: 'shoaib-khatik',
    name: 'Shoaib Khatik',
    designation: 'Co-Founder',
    shortDescription:
      'Leads the technology vision and product engineering — building scalable, user-focused digital products with Python, the MERN stack, React Native and cloud technologies.',
    // Only the confirmed one-line introduction above so far; add a longer biography here when supplied
    biography: [],
    expertise: ['Full-Stack', 'MERN · Python', 'AI Solutions'],
    portrait: '/team/shoaib-khatik.jpg',
    socialLinks: [],
    profileDetailsConfirmed: true,
    isFounder: true,
  },
  {
    id: 'abhishek-prasad',
    name: 'Abhishek Prasad',
    designation: 'Co-Founder & Chief Technology Officer',
    shortDescription:
      'Technology-focused co-founder contributing to application development, engineering, and the technical implementation of digital solutions.',
    biography: [
      'Abhishek Prasad is the Co-Founder and Chief Technology Officer at 4AM Global Media, contributing to the technical direction and development of digital solutions.',
      'His technology-focused work includes application development and engineering, with experience and interests spanning programming, software development, and building practical digital products.',
      'At 4AM Global Media, Abhishek contributes to translating concepts and requirements into technical solutions, helping connect product ideas, software engineering, and implementation.',
      "His role supports the agency's ability to approach digital projects from both a strategic and technical perspective.",
    ],
    roleAt4AM:
      "As Co-Founder and CTO, Abhishek contributes to technical decision-making, software development, and the implementation of digital solutions. He helps guide technology-related work in alignment with the agency's project requirements and business objectives.",
    expertise: [
      'Technology Strategy',
      'Software Development',
      'Application Development',
      'Android Development',
      'Java',
      '.NET Technologies',
      'Technical Problem-Solving',
      'Digital Product Implementation',
    ],
    quote: 'Building practical technology solutions that turn ideas into reality.',
    portrait: '/team/abhishek-prasad.jpg',
    socialLinks: [],
    profileDetailsConfirmed: true,
    isFounder: true,
  },
  {
    id: 'rupali-bagul',
    name: 'Rupali Bagul',
    designation: 'Digital Marketing Head',
    shortDescription:
      'Leading digital marketing strategy, social media initiatives, brand communication, and campaign execution with a focus on creativity, audience engagement, and measurable growth.',
    biography: [
      'Rupali Bagul serves as the Digital Marketing Head at 4AM Global Media, where she oversees digital marketing strategies, social media initiatives, brand communication, and campaign execution.',
      'With a focus on creativity, audience engagement, and measurable growth, Rupali works on building strong digital identities for brands and developing marketing campaigns designed to connect businesses with their target audiences.',
    ],
    roleAt4AM:
      "As Digital Marketing Head, Rupali contributes to the agency's marketing direction and works closely with the creative and strategy teams to develop impactful digital campaigns for clients across different industries. Her approach combines creative storytelling, audience-focused communication, and data-driven insights to strengthen brand presence, build meaningful engagement, and support sustainable digital growth.",
    expertise: [
      'Digital Marketing Strategy',
      'Social Media Management',
      'Brand Strategy & Communication',
      'Content Marketing',
      'Campaign Planning & Execution',
      'Lead Generation',
      'Audience Engagement',
      'Digital Growth & Analytics',
    ],
    quote: 'Creating strategies that connect brands with people and turn digital interactions into meaningful growth.',
    portrait: '/team/rupali-bagul.jpg',
    socialLinks: [],
    profileDetailsConfirmed: true,
  },
  {
    id: 'sahil-pasi',
    name: 'Sahil Pasi',
    designation: '3D & Motion Graphics Designer',
    experienceLabel: '5+ years of experience',
    shortDescription:
      'Creating compelling 3D visuals, motion graphics, product visualizations, and creative stories that help brands capture attention and communicate with impact.',
    biography: [
      'Sahil Pasi is a 3D & Motion Graphics Designer with 5+ years of experience creating dynamic visual experiences for brands, campaigns, and digital platforms. His expertise spans 3D animation, motion graphics, 3D logo design, product visualization, visual effects, and creative storytelling.',
      'At 4AM Global Media, Sahil brings ideas to life through motion, depth, and design, combining creativity with emerging technologies to create visuals that capture attention and communicate with impact.',
    ],
    roleAt4AM:
      "Sahil contributes to the agency's creative production through 3D visuals, motion graphics, and visual content for digital campaigns. His work combines design, motion, technical execution, and storytelling to help communicate brand concepts in visually engaging ways.",
    expertise: [
      '3D Animation',
      'Motion Graphics',
      '3D Logo Design',
      'Product Visualization',
      'Visual Effects (VFX)',
      'Creative Design',
      'Visual Storytelling',
    ],
    quote: '5+ years of experience. Always learning. Always creating. Always evolving.',
    portrait: '/team/sahil-pasi.jpg',
    portfolioUrl: '',
    socialLinks: [],
    profileDetailsConfirmed: true,
  },
];

// "Different Talents. One Shared Vision." pillars
export const teamPillars = [
  { title: 'Strategy', text: 'Digital growth and planning' },
  { title: 'Technology', text: 'Software and applications' },
  { title: 'Marketing', text: 'Branding and campaigns' },
  { title: 'Creativity', text: '3D, motion and visual storytelling' },
];

// Optional "Creativity in Motion" gallery: shown only when real, approved work is listed here.
// Example: { src: '/team/work/product-render.jpg', alt: 'Product visualisation by Sahil Pasi', credit: 'Sahil Pasi' }
export const teamShowcase: { src: string; alt: string; credit?: string }[] = [];

export const COMPANY_URL = 'https://4amglobalmedia.com/';
