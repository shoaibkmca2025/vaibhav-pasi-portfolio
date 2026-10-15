import { useState } from 'react';
import { Plus } from 'lucide-react';

// Answers come from content/faqs.ts (accurate, no guarantees). Re-exported for the FAQ structured data.
export { faqs } from '../content/faqs';
import { faqs } from '../content/faqs';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-padding bg-brand-black">
      <div className="max-w-4xl mx-auto">
        <div className="section-head text-center mb-12 md:mb-20">
          <span className="eyebrow font-bold tracking-[0.4em] uppercase text-[0.6875rem] mb-5 block">FAQ</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
            Questions? <br /> <span className="text-accent">Answered.</span>
          </h2>
        </div>

        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, idx) => {
            const open = openIndex === idx;
            return (
              <div
                key={faq.question}
                className={`border rounded-2xl overflow-hidden bg-brand-dark-gray/20 transition-colors ${
                  open ? 'border-accent/30' : 'border-white/5'
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
                        open ? 'rotate-45 text-accent' : 'text-gray-500'
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
                    <p className="px-5 pb-5 md:px-8 md:pb-8 text-gray-400 font-normal leading-relaxed text-sm md:text-base">
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
