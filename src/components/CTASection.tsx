import { motion } from 'motion/react';
import { ArrowUpRight, MessageCircle, Send } from 'lucide-react';
import { bookingExternal, bookingHref } from '../lib/booking';
import { hasWhatsApp, whatsappHref } from '../lib/whatsapp';
import { onLinkClick } from '../router';

// Final call to action, used at the end of most pages
export default function CTASection() {
  return (
    <section className="px-5 sm:px-6 md:px-12 lg:px-24 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="theme-dark relative overflow-hidden max-w-6xl mx-auto rounded-[2rem] md:rounded-[2.5rem] border border-brand-yellow/20 bg-[radial-gradient(90%_120%_at_100%_0%,rgba(79,140,255,0.18),transparent_55%),radial-gradient(70%_90%_at_0%_100%,rgba(255,122,102,0.12),transparent_60%),linear-gradient(135deg,#0f1a33,#070b18)] text-white px-7 py-14 sm:px-12 md:px-16 md:py-20 text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] max-w-4xl mx-auto">
          Ready to Turn Your Next Idea Into a <span className="text-gradient">Growth Opportunity?</span>
        </h2>
        <p className="mt-6 text-gray-400 md:text-lg max-w-2xl mx-auto leading-relaxed">
          Let's discuss your business goals and identify the right technology or marketing solution.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
          <a
            href={bookingHref}
            data-cta="book"
            {...(bookingExternal ? { target: '_blank', rel: 'noopener noreferrer' } : { onClick: onLinkClick })}
            className="btn-primary w-full sm:w-auto"
          >
            Book a Strategy Call <ArrowUpRight className="w-4 h-4" aria-hidden />
          </a>
          {hasWhatsApp && (
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full sm:w-auto">
              <MessageCircle className="w-4 h-4" aria-hidden /> WhatsApp
            </a>
          )}
          <a href="/contact#enquire" onClick={onLinkClick} className="btn-secondary w-full sm:w-auto">
            <Send className="w-4 h-4" aria-hidden /> Send an Enquiry
          </a>
        </div>
      </motion.div>
    </section>
  );
}
