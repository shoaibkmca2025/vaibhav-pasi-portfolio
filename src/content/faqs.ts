// FAQs. Short, direct answers so search engines and AI assistants can quote them.
// `about` questions feed the Person-focused FAQ schema; the rest are commercial questions.
import { contactEmail } from '../contact';

export interface Faq {
  question: string;
  answer: string;
}

export const aboutFaqs: Faq[] = [
  {
    question: 'Who is Vaibhav Pasi?',
    answer:
      'Vaibhav Pasi is a digital marketer, software developer and AI & automation consultant based in India, and Co-Founder of 4AM Global Media. He helps businesses grow through websites, digital marketing, SEO, AI automation and custom software.',
  },
  {
    question: 'What is 4AM Global Media?',
    answer:
      '4AM Global Media is a digital company co-founded by Vaibhav Pasi, working across software, AI automation, branding, digital marketing and website development.',
  },
  {
    question: 'Where is Vaibhav Pasi based?',
    answer: 'Vaibhav Pasi is based in India and works with businesses and creators in India and internationally, remotely and on site for workshops.',
  },
  {
    question: 'How can I contact Vaibhav Pasi?',
    answer: `Email ${contactEmail}, use the project form at vaibhavpasi.online/hire-me, or message on WhatsApp from any page of the website.`,
  },
];

export const businessFaqs: Faq[] = [
  {
    question: 'How much does a project cost?',
    answer:
      'Small, fixed-scope work starts with the ₹1,499 Digital Growth Audit or a ₹2,500 strategy call. Website sprints typically cost ₹15,000 – ₹25,000, larger projects ₹15,000 – ₹75,000, and monthly marketing retainers ₹20,000 – ₹50,000. You get a written quote before any work starts.',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'An audit is delivered within a few working days. A website sprint usually takes one to three weeks. Automation and software projects are scoped into milestones, typically two to eight weeks.',
  },
  {
    question: 'What is the process?',
    answer:
      'Enquiry → short discovery call → written scope and quote → build in milestones with regular updates → launch → handover and support. For unclear projects we start with the audit or a strategy call.',
  },
  {
    question: 'How does payment work?',
    answer:
      'Audits, strategy calls and digital products are paid online at checkout. Projects are usually split into an advance to start and the balance at milestones or launch. Retainers are billed monthly in advance.',
  },
  {
    question: 'How many revisions are included?',
    answer: 'Each project includes defined review rounds at every milestone, stated in the quote, so feedback is built into the schedule rather than added at the end.',
  },
  {
    question: 'Which technologies do you use?',
    answer:
      'For websites and apps: React, TypeScript and Node.js on modern hosting such as Vercel. For automation: workflow tools such as n8n, Google Sheets, CRMs, email, WhatsApp and AI models connected through their APIs. The choice depends on your needs and budget.',
  },
  {
    question: 'Do you offer support and maintenance after launch?',
    answer: 'Yes. Every launch includes a support period for fixes, and ongoing maintenance or improvement can continue on a monthly plan.',
  },
  {
    question: 'Can you improve my existing website instead of rebuilding it?',
    answer: 'Often, yes. The audit shows whether targeted fixes to speed, SEO, copy and conversion are enough, or whether a rebuild is the better investment.',
  },
  {
    question: 'Is SEO included with a website?',
    answer: 'Every website includes SEO foundations: fast pages, clean structure, titles, descriptions, sitemap and structured data. Ongoing SEO and content work is a separate service.',
  },
  {
    question: 'What can AI automation actually do for a small business?',
    answer:
      'Common wins are instant lead follow-up, routing enquiries to the right person, drafting replies, syncing form data to a CRM or sheet, and sending order or invoice notifications, with a person approving anything important.',
  },
  {
    question: 'Do you build custom software and CRMs?',
    answer: 'Yes: lightweight CRMs, dashboards, client portals, internal tools and integrations, when an off-the-shelf tool does not fit the way your team works.',
  },
];

export const faqs: Faq[] = [...aboutFaqs, ...businessFaqs];
