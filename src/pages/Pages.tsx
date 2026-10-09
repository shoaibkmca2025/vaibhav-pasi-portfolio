import { motion } from 'motion/react';
import { ArrowUpRight, Check, Mail } from 'lucide-react';
import About from '../components/About';
import Press from '../components/Press';
import ServiceShowcase from '../components/ServiceShowcase';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import HowItWorks from '../components/HowItWorks';
import Projects from '../components/Projects';
import CaseStudies from '../components/CaseStudies';
import ClientWins from '../components/ClientWins';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CTASection from '../components/CTASection';
import { contactEmail, contactHref, socialLinks } from '../contact';
import { person } from '../site';
import { hasDetailPage, services } from '../content/services';
import { NextPage, PageHero } from './PageParts';
import { onLinkClick } from '../router';

/* ─────────────── About ─────────────── */
export function AboutPage() {
  return (
    <main>
      <PageHero
        page="about"
        title={
          <>
            The Person <br />
            <span className="text-accent glow-yellow">Behind the Growth.</span>
          </>
        }
        intro={
          <>
            Digital marketing strategist, software developer and AI consultant. Co-Founder of{' '}
            <span className="text-white font-medium">{person.organization.name}</span>, helping brands scale where technology
            and marketing meet.
          </>
        }
        facts={[
          { value: '100+', label: 'Brands scaled' },
          { value: '30M+', label: 'Reach generated' },
          { value: '200+', label: 'Projects delivered' },
          { value: '15+', label: 'Press features' },
        ]}
      />
      <About />
      <Press />
      <Skills />
      <Experience />
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
                  href={detail ? s.href : '/contact'}
                  onClick={onLinkClick}
                  className="group grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] items-center gap-2 sm:gap-6 px-6 md:px-8 py-5 hover:bg-white/[0.03] transition-colors"
                >
                  <span>
                    <span className="block font-bold text-lg tracking-tight group-hover:text-accent transition-colors">{s.title}</span>
                    <span className="block text-sm text-gray-400 mt-0.5">{s.short}</span>
                  </span>
                  <span className="font-semibold whitespace-nowrap">{s.price}</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent whitespace-nowrap">
                    {detail ? 'View details' : 'Book a call'} <ArrowUpRight className="w-4 h-4" aria-hidden />
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
    <main>
      <PageHero
        page="services"
        title={
          <>
            Everything to <br />
            <span className="text-accent glow-yellow">Scale a Brand.</span>
          </>
        }
        intro="Growth marketing, paid ads, content, websites, AI automation and marketplace onboarding, planned and run as one system instead of ten separate vendors."
      />
      <ServiceShowcase />
      <ServicesCompare />
      <HowItWorks />
      <CTASection />
      <NextPage page="services" />
    </main>
  );
}

/* ─────────────── Work ─────────────── */
export function WorkPage() {
  return (
    <main>
      <PageHero
        page="work"
        title={
          <>
            Selected <br />
            <span className="text-accent glow-yellow">Work.</span>
          </>
        }
        intro="Brand growth, viral campaigns, e-commerce rebuilds and influencer strategy, followed by in-depth case studies with the goals, the plan and the results."
      />
      <Projects />
      <CaseStudies />
      <CTASection />
      <NextPage page="work" />
    </main>
  );
}

/* ─────────────── Client Wins ─────────────── */
export function ClientWinsPage() {
  return (
    <main>
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
const firstMessageTips = [
  { title: 'Your brand', text: 'What you sell, who buys it, and where you sell today.' },
  { title: 'The goal', text: 'More reach, more sales, a new website, a marketplace launch, or automating the busywork.' },
  { title: 'Timeline', text: 'When you want to start and any launch dates to plan around.' },
  { title: 'Budget range', text: 'A rough range is enough to suggest the right plan.' },
];

export function ContactPage() {
  return (
    <main>
      <PageHero
        page="contact"
        title={
          <>
            Let's Build <br />
            <span className="text-accent glow-yellow">Something.</span>
          </>
        }
        intro="Looking to grow your brand, launch on a marketplace, build a website or bring AI into your business? Send a message. No forms, no friction."
      />

      {/* Email + socials */}
      <section className="section-padding border-b border-white/5">
        <div className="max-w-7xl mx-auto grid gap-6 lg:grid-cols-12">
          <motion.a
            href={contactHref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group lg:col-span-7 p-8 md:p-12 rounded-3xl bg-brand-yellow text-black flex flex-col justify-between gap-10 glow-box"
          >
            <div className="flex items-center justify-between">
              <span className="text-[0.6875rem] font-bold tracking-[0.4em] uppercase text-black/60">Email</span>
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[5.4vw] sm:text-4xl md:text-5xl font-black tracking-tighter whitespace-nowrap">
                {contactEmail}
              </span>
              <span className="mt-6 inline-flex items-center gap-2 text-[0.6875rem] font-black tracking-[0.2em] uppercase">
                Write to me <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </div>
          </motion.a>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {socialLinks.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={`Open Vaibhav Pasi on ${s.label}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group p-6 md:p-8 rounded-3xl border border-white/5 bg-brand-dark-gray/20 hover:bg-brand-yellow hover:text-black transition-all flex flex-col justify-between gap-8"
              >
                <ArrowUpRight className="w-5 h-5 text-accent group-hover:text-black self-end" />
                <span className="font-bold tracking-widest text-[0.6875rem] uppercase">{s.label}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* What to include + what I help with */}
      <section className="section-padding border-b border-white/5">
        <div className="max-w-7xl mx-auto grid gap-16 lg:grid-cols-2">
          <div>
            <span className="eyebrow font-bold tracking-[0.4em] uppercase text-[0.6875rem] mb-5 block">Before you write</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.9] mb-10">
              What to <span className="text-accent">Include.</span>
            </h2>
            <ol className="space-y-4">
              {firstMessageTips.map((t, i) => (
                <li key={t.title} className="flex gap-5 p-6 rounded-2xl border border-white/5 bg-brand-dark-gray/10">
                  <span className="text-accent font-black italic text-2xl leading-none">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="block font-bold text-lg tracking-tight">{t.title}</span>
                    <span className="block mt-1 text-gray-400 font-normal">{t.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <span className="eyebrow font-bold tracking-[0.4em] uppercase text-[0.6875rem] mb-5 block">I can help with</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.9] mb-10">
              Areas of <span className="text-accent">Work.</span>
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {person.knowsAbout.map((area) => (
                <li key={area} className="flex items-start gap-3 p-4 rounded-2xl border border-white/5 text-sm text-gray-300">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <HowItWorks />
      <FAQ />
      <NextPage page="contact" />
    </main>
  );
}
