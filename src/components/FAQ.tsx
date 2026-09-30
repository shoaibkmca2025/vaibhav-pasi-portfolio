import { useState } from 'react';
import { Plus } from 'lucide-react';

// Short, direct answers (~40-60 words) so search and AI answer engines can quote them.
// These also feed the FAQPage structured data in src/seo.ts.
export const faqs = [
  {
    question: 'Who is Vaibhav Pasi?',
    answer:
      'Vaibhav Pasi is a technology entrepreneur, digital marketing strategist, software developer and AI consultant based in India. He is the Co-Founder of 4AM Global Media and helps startups, SMEs and enterprises grow through data-driven marketing, AI-powered business systems, high-performance websites and marketplace onboarding.',
  },
  {
    question: 'What services does Vaibhav Pasi offer?',
    answer:
      'Vaibhav offers digital marketing strategy, performance marketing, social media growth, SEO, branding, website design and development, AI and business automation, product onboarding for e-commerce and quick-commerce marketplaces, technology consulting, and AI workshops and corporate training.',
  },
  {
    question: 'What is 4AM Global Media?',
    answer:
      '4AM Global Media is a digital company co-founded by Vaibhav Pasi. It delivers software engineering, AI automation, branding, digital marketing, website development, cloud technologies and technology consulting for brands that want to scale.',
  },
  {
    question: 'Can Vaibhav help my brand launch on Blinkit, Zepto or Instamart?',
    answer:
      'Yes. As a Product Onboarding Expert, Vaibhav provides end-to-end support for launching on India\'s leading e-commerce and quick-commerce platforms, including seller account setup, compliance, catalog creation, listing optimization, inventory management, pricing strategy and marketplace growth consulting.',
  },
  {
    question: 'Does Vaibhav Pasi run AI workshops and training?',
    answer:
      'Yes. Vaibhav runs AI workshops, corporate training programs and Vibe Coding sessions that help students, professionals and business leaders adopt AI, build digital products and automate business processes.',
  },
  {
    question: 'How long does it take to see results?',
    answer:
      'Our ecosystem begins operating immediately upon setup. While viral loops can happen instantly, we optimize for sustained exponential growth over 90-day cycles.',
  },
  {
    question: 'Do you offer custom plans?',
    answer:
      'Every brand has a unique DNA. While our frameworks are standardized for performance, we tailor the strategic execution to fit your specific market category.',
  },
  {
    question: 'What platforms do you specialize in?',
    answer:
      'We dominate where the attention is. This includes Instagram, TikTok, YouTube, X (Twitter), and emerging tech-centric social ecosystems.',
  },
  {
    question: 'How do I get started?',
    answer:
      'The first step is choosing a plan or booking a strategy call. Once initiated, our team will reach out within 24 hours to begin the integration process.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-padding bg-brand-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-brand-yellow font-bold tracking-[0.4em] uppercase text-[10px] mb-5 block">FAQ</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter italic uppercase mb-6">
            Questions? <br /> <span className="text-brand-yellow">Answered.</span>
          </h2>
        </div>

        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, idx) => {
            const open = openIndex === idx;
            return (
              <div
                key={faq.question}
                className={`border rounded-2xl overflow-hidden bg-brand-dark-gray/20 transition-colors ${
                  open ? 'border-brand-yellow/30' : 'border-white/5'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : idx)}
                    aria-expanded={open}
                    aria-controls={`faq-answer-${idx}`}
                    id={`faq-question-${idx}`}
                    className="w-full p-5 md:p-8 flex items-center justify-between gap-4 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-base md:text-lg font-bold tracking-tight">{faq.question}</span>
                    <Plus
                      className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                        open ? 'rotate-45 text-brand-yellow' : 'text-gray-500'
                      }`}
                    />
                  </button>
                </h3>
                {/* Answers stay in the page when collapsed so crawlers and answer engines can read them */}
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-question-${idx}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 md:px-8 md:pb-8 text-gray-400 font-light leading-relaxed text-sm md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
