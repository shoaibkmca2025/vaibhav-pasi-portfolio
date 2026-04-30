import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "How long does it take to see results?",
    answer: "Our ecosystem begins operating immediately upon setup. While viral loops can happen instantly, we optimize for sustained exponential growth over 90-day cycles."
  },
  {
    question: "Do you offer custom plans?",
    answer: "Every brand has a unique DNA. While our frameworks are standardized for performance, we tailor the strategic execution to fit your specific market category."
  },
  {
    question: "What platforms do you specialize in?",
    answer: "We dominate where the attention is. This includes Instagram, TikTok, YouTube, X (Twitter), and emerging tech-centric social ecosystems."
  },
  {
    question: "How do I get started?",
    answer: "The first step is choosing a plan or booking a strategy call. Once initiated, our team will reach out within 24 hours to begin the integration process."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-padding bg-brand-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter italic uppercase mb-6">Questions? <br /> <span className="text-brand-yellow">Answered.</span></h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-white/5 rounded-2xl overflow-hidden bg-brand-dark-gray/20">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                aria-expanded={openIndex === idx}
                aria-controls={`faq-answer-${idx}`}
                className="w-full p-8 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-lg font-bold tracking-tight">{faq.question}</span>
                {openIndex === idx ? (
                  <Minus className="w-5 h-5 text-brand-yellow" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-500" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    id={`faq-answer-${idx}`}
                    role="region"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-8 text-gray-400 font-light leading-relaxed text-sm">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
