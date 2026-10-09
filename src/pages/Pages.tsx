import { motion } from 'motion/react';
import { ArrowUpRight, Mail, MessageCircle, Phone } from 'lucide-react';
import Press from '../components/Press';
import ServiceShowcase from '../components/ServiceShowcase';
import HowItWorks from '../components/HowItWorks';
import AboutIntro from '../components/AboutIntro';
import CaseStudies from '../components/CaseStudies';
import ClientWins from '../components/ClientWins';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CTASection from '../components/CTASection';
import LeadForm from '../components/LeadForm';
import SocialIcon from '../components/SocialIcon';
import { ToolChips } from '../components/ToolLogos';
import { contactEmail, contactHref, contactPhoneDisplay, contactPhoneHref, socialLinks } from '../contact';
import { industries, techGroups, trustFacts } from '../content/proof';
import { hasDetailPage, services } from '../content/services';
import { hasWhatsApp, whatsappHref } from '../lib/whatsapp';
import { NextPage, PageHero } from './PageParts';
import { onLinkClick } from '../router';

export { PrivacyPage, TermsPage } from './Legal';

/* ─────────────── About ─────────────── */
// Everything here is verifiable: education, role, start year, press, tools actually used
function Toolkit() {
  return (
    <section className="section-padding bg-brand-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16">
        <div>
          <span className="eyebrow mb-5">Toolkit</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-[1.08]">
            The tools I <span className="text-accent">work with.</span>
          </h2>
          <p className="mt-6 text-gray-400 md:text-lg leading-relaxed">
            Technologies used in real client work and in this website's own code, from the front end to automation and analytics.
          </p>
          <h3 className="mt-10 text-xs font-bold tracking-[0.2em] uppercase text-gray-500">Industries I've worked with</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {industries.map((i) => (
              <li key={i} className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-gray-300">
                {i}
              </li>
            ))}
          </ul>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {techGroups.map((g) => (
            <div key={g.group} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <dt className="text-xs font-bold tracking-[0.2em] uppercase text-accent">{g.group}</dt>
              <dd className="mt-3">
                <ToolChips tools={[...g.items]} label={g.group} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function AboutPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero
        page="about"
        title={
          <>
            The Person <br />
            <span className="text-accent">Behind the Work.</span>
          </>
        }
        intro="MCA graduate, software developer and digital marketer since 2019. Co-Founder of 4AM Global Media, working where technology and marketing meet."
        facts={trustFacts.slice(0, 4)}
      />
      <AboutIntro onAboutPage />
      <Toolkit />
      <Press />
      <HowItWorks />
      <CTASection />
      <NextPage page="about" />
    </main>
  );
}

/* ─────────────── Services ─────────────── */
// Side-by-side summary of every service and its starting price, linking to the detail pages
function ServicesCompare() {
  return (
    <section id="compare" className="scroll-mt-24 section-padding bg-brand-dark-gray border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="section-head flex flex-col items-center text-center mb-10 md:mb-14">
          <div className="max-w-2xl">
            <span className="eyebrow mb-5">Compare</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-[1.08]">
              Services at a <span className="text-accent">glance.</span>
            </h2>
            <p className="mt-6 text-gray-400 md:text-lg leading-relaxed">Starting prices, so you know where to begin. Open any service for the full scope, process and FAQs.</p>
          </div>
        </div>
        <ul className="rounded-[1.75rem] border border-white/10 bg-brand-black overflow-hidden divide-y divide-white/10">
          {services.map((s) => {
            const detail = hasDetailPage(s);
            return (
              <li key={s.slug}>
                <a
                  href={detail ? s.href : `/contact?service=${encodeURIComponent(s.navTitle)}#enquire`}
                  onClick={onLinkClick}
                  className="group grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] items-center gap-2 sm:gap-6 px-6 md:px-8 py-5 hover:bg-white/[0.03] transition-colors"
                >
                  <span>
                    <span className="block font-bold text-lg tracking-tight group-hover:text-accent transition-colors">{s.title}</span>
                    <span className="block text-sm text-gray-400 mt-0.5">{s.short}</span>
                  </span>
                  <span className="font-semibold whitespace-nowrap">{s.price}</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent whitespace-nowrap">
                    {detail ? 'View details' : 'Enquire'} <ArrowUpRight className="w-4 h-4" aria-hidden />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function ServicesPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero
        page="services"
        title={
          <>
            Marketing, Software <br />
            <span className="text-accent">and AI, Together.</span>
          </>
        }
        intro="Digital marketing, websites, custom software, SEO, LinkedIn growth and AI automation, planned as one system instead of separate vendors."
      />
      <ServiceShowcase />
      <ServicesCompare />
      <HowItWorks />
      <CTASection />
      <NextPage page="services" />
    </main>
  );
}

/* ─────────────── Portfolio ─────────────── */
export function WorkPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero
        page="work"
        title={
          <>
            Selected <br />
            <span className="text-accent">Work.</span>
          </>
        }
        intro="Case studies from real client accounts: the challenge, what I did, the tools used and the results, each backed by the original screenshot. Client names are kept private."
      />
      <CaseStudies />
      <section className="px-5 sm:px-6 md:px-12 lg:px-24 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-6 md:p-8">
          <p className="text-gray-300 md:text-lg">More screenshots, reel results and client messages are on the Client Wins page.</p>
          <a href="/client-wins" onClick={onLinkClick} className="btn-secondary shrink-0">
            See client wins <ArrowUpRight className="w-4 h-4" aria-hidden />
          </a>
        </div>
      </section>
      <CTASection />
      <NextPage page="work" />
    </main>
  );
}

/* ─────────────── Client Wins ─────────────── */
export function ClientWinsPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero
        page="client-wins"
        title={
          <span className="flex items-end not-italic normal-case" aria-label="Client Wins">
            <span className="font-black tracking-[-0.06em] bg-gradient-to-r from-[#d8c3a0] via-[#f1e6d0] to-white bg-clip-text text-transparent pb-2 pr-1">
              client
            </span>
            <span className="font-script font-normal text-[1.45em] text-white ml-2 md:ml-3 -mb-[0.12em] leading-[0.8]">Wins</span>
          </span>
        }
        intro="Receipts, not promises. Real numbers from real client accounts: analytics lifts, before-and-after reel views, profile growth and messages straight from clients, each with the original screenshot."
        facts={[
          { value: '+67,471%', label: 'Impressions, 90 days' },
          { value: '3.1M', label: 'Best reel views' },
          { value: '56.6K', label: 'Followers gained' },
          { value: '613 hrs', label: 'Watch time, 28 days' },
        ]}
      />
      <ClientWins hideHeader />
      <Testimonials />
      <CTASection />
      <NextPage page="client-wins" />
    </main>
  );
}

/* ─────────────── Contact ─────────────── */
function ContactLink({ href, icon: Icon, label, value, external = false }: { href: string; icon: typeof Mail; label: string; value: string; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-brand-yellow/40 transition-colors"
    >
      <span className="grid w-11 h-11 shrink-0 place-items-center rounded-xl bg-brand-yellow text-black">
        <Icon className="w-5 h-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold tracking-[0.2em] uppercase text-gray-500">{label}</span>
        <span className="block mt-0.5 font-semibold break-words group-hover:text-accent transition-colors">{value}</span>
      </span>
    </a>
  );
}

export function ContactPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero
        page="contact"
        title={
          <>
            Let's Build <br />
            <span className="text-accent">Something.</span>
          </>
        }
        intro="Tell me about your business and what you want to achieve. Use the enquiry form, call, WhatsApp or email, whichever is easiest for you."
      />

      <section id="enquire" className="scroll-mt-24 section-padding border-b border-white/5">
        <div className="max-w-7xl mx-auto grid gap-10 lg:gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">Send an enquiry</h2>
            <LeadForm source="contact" />
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="lg:col-span-5"
            aria-label="Other ways to get in touch"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">Or reach me directly</h2>
            <div className="flex flex-col gap-3">
              <ContactLink href={contactPhoneHref} icon={Phone} label="Call" value={contactPhoneDisplay} />
              {hasWhatsApp && (
                <ContactLink href={whatsappHref()} icon={MessageCircle} label="WhatsApp" value={contactPhoneDisplay} external />
              )}
              <ContactLink href={contactHref} icon={Mail} label="Email" value={contactEmail} />
            </div>

            <h3 className="mt-10 text-xs font-bold tracking-[0.2em] uppercase text-gray-500">Social</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`Vaibhav Pasi on ${s.label}`}
                    className="inline-flex items-center gap-1.5 min-h-11 rounded-full border border-white/10 px-4 text-sm font-semibold hover:border-brand-yellow/40 hover:text-accent transition-colors"
                  >
                    <SocialIcon label={s.label} className="w-4 h-4 text-accent" /> {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.aside>
        </div>
      </section>

      <HowItWorks />
      <FAQ />
      <NextPage page="contact" />
    </main>
  );
}
