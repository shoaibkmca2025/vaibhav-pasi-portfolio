import { motion } from 'motion/react';
import { ArrowUpRight, Linkedin } from 'lucide-react';
import { socialLinks } from '../contact';
import { techGroups } from '../content/proof';
import { onLinkClick } from '../router';

const linkedin = socialLinks.find((s) => s.label === 'LinkedIn')!.href;

// Section 6 of the home page: a short founder story. Facts only; the full story lives on /about.
export default function AboutIntro({ onAboutPage = false }: { onAboutPage?: boolean }) {
  return (
    <section className="section-padding bg-brand-dark-gray border-y border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-sm mx-auto lg:max-w-none w-full"
        >
          <img
            src="/vaibhav-pasi.jpg"
            alt="Portrait of Vaibhav Pasi"
            width={640}
            height={640}
            loading="lazy"
            className="w-full aspect-square object-cover rounded-[2rem] border border-white/10"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="eyebrow mb-5">About Vaibhav</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-[1.08]">
            A developer who markets, <span className="text-accent">a marketer who builds.</span>
          </h2>
          <div className="mt-6 space-y-4 text-gray-400 md:text-lg leading-relaxed">
            <p>
              I'm Vaibhav Pasi: an MCA graduate and software developer who has worked in digital marketing since 2019, and
              Co-Founder of 4AM Global Media.
            </p>
            <p>
              Most businesses hire one team to build and another to market, and the gaps between them cost growth. I work
              across both: the website is built to convert, campaigns are measured properly, and repetitive work is
              automated so your team can focus on customers.
            </p>
          </div>

          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4" aria-label="Technical skills">
            {techGroups.slice(0, 4).map((g) => (
              <li key={g.group}>
                <span className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-500">{g.group}</span>
                <span className="block mt-1 text-sm text-gray-300">{g.items.join(' · ')}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="/contact#enquire" onClick={onLinkClick} className="btn-primary">
              Discuss a project <ArrowUpRight className="w-4 h-4" aria-hidden />
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <Linkedin className="w-4 h-4" aria-hidden /> LinkedIn
            </a>
            {!onAboutPage && (
              <a href="/about" onClick={onLinkClick} className="inline-flex items-center min-h-11 px-3 text-sm font-semibold text-gray-300 link-underline">
                Full story
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
