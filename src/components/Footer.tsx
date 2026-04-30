import { motion } from 'motion/react';
import { contactHref, socialLinks } from '../contact';

export default function ContactCTA() {
  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-brand-dark-gray/20 rounded-3xl p-12 md:p-24 text-center border border-white/5 relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              Ready to Scale Your <br className="hidden md:block" /> Digital Footprint?
            </h2>
            <p className="text-gray-400 font-light mb-12 max-w-xl mx-auto text-sm md:text-base">
              Let's discuss how we can engineer your brand's growth and establish market dominance.
            </p>
            <a href={contactHref} className="btn-primary inline-block px-12">
              START A PROJECT
            </a>
          </div>
          
          {/* Decorative glows */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-yellow/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-yellow/5 rounded-full blur-[100px]" />
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 md:px-12 lg:px-24 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="text-[10px] tracking-widest text-gray-600 uppercase font-bold">
        © {year} VAIBHAV PASI. DIGITAL ALCHEMIST.
      </div>
      
      <div className="flex items-center gap-12">
        {socialLinks.slice(0, 3).map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open Vaibhav Pasi on ${social.label}`}
            className="text-[10px] tracking-widest text-gray-500 hover:text-white transition-colors font-bold"
          >
            {social.label.toUpperCase()}
          </a>
        ))}
      </div>
    </footer>
  );
}
