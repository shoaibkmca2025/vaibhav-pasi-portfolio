/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, MotionConfig } from 'motion/react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Stats from './components/Stats';
import FAQ from './components/FAQ';
import { Footer } from './components/Footer';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import CustomCursor from './components/CustomCursor';
import Marquee from './components/Marquee';
import Press from './components/Press';
import Blog, { BlogIndex } from './components/Blog';
import BlogPost from './components/BlogPost';
import ScrollProgress from './components/ScrollProgress';
import HomeExplore from './pages/HomeExplore';
import { AboutPage, ClientWinsPage, ContactPage, ServicesPage, WorkPage } from './pages/Pages';
import { contactEmail, contactHref, socialLinks } from './contact';
import { useRoute, type Route } from './router';
import { applySeo, getSeo } from './seo';
import { SPLASH_DONE_EVENT } from './splash';

// Home is the overview; each nav item has its own detailed page
function HomePage({ heroKey }: { heroKey: number }) {
  return (
    <main>
      <section id="home">
        <Hero key={heroKey} />
        <Stats />
      </section>

      <Marquee />

      <section id="press">
        <Press />
      </section>

      <HomeExplore />

      <section id="testimonials">
        <Testimonials />
      </section>

      <section id="blog">
        <Blog />
      </section>

      <section id="faq">
        <FAQ />
      </section>

      <CTASection />

      <section id="contact" className="pt-20 md:pt-32 pb-16 md:pb-32 text-center bg-brand-dark-gray/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-8 md:mb-12 px-5">Get in touch.</h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-10 md:mb-16 px-6">
            Looking to elevate your brand or discuss a potential project? I'm always open to new opportunities and strategic collaborations.
          </p>
          <a
            href={contactHref}
            className="inline-block px-5 text-[6.4vw] sm:text-4xl md:text-6xl font-bold tracking-tighter text-brand-yellow hover:glow-yellow transition-all whitespace-nowrap"
          >
            {contactEmail}
          </a>

          <div className="mt-16 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-8 max-w-4xl mx-auto px-5 sm:px-6 pb-10 md:pb-20">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open Vaibhav Pasi on ${social.label}`}
                className="p-6 md:p-8 border border-white/5 rounded-2xl hover:bg-brand-yellow hover:text-black transition-all group font-bold tracking-widest text-[0.6875rem]"
              >
                {social.label.toUpperCase()}
              </a>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}

function PageContent({ route, heroKey }: { route: Route; heroKey: number; key?: string }) {
  switch (route.page) {
    case 'about':
      return <AboutPage />;
    case 'services':
      return <ServicesPage />;
    case 'work':
      return <WorkPage />;
    case 'client-wins':
      return <ClientWinsPage />;
    case 'contact':
      return <ContactPage />;
    case 'blog':
      return <BlogIndex />;
    default:
      return <HomePage heroKey={heroKey} />;
  }
}

// `initialPath` is passed when prerendering at build time; in the browser the URL is used
export default function App({ initialPath }: { initialPath?: string }) {
  const route = useRoute(initialPath);
  const routeKey = route.page === 'post' ? `post:${route.slug}` : route.page;
  const previousRoute = useRef(routeKey);
  // Bumped when the intro splash lifts, remounting the hero so its entrance plays in view
  const [heroKey, setHeroKey] = useState(0);

  useEffect(() => {
    const replayHero = () => setHeroKey((k) => k + 1);
    window.addEventListener(SPLASH_DONE_EVENT, replayHero);
    return () => window.removeEventListener(SPLASH_DONE_EVENT, replayHero);
  }, []);

  useEffect(() => {
    if (previousRoute.current === routeKey) return;
    previousRoute.current = routeKey;
    applySeo(getSeo(window.location.pathname));
    // A hash (e.g. /#faq) jumps to that section once the new page has rendered
    const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [routeKey]);

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-brand-black text-white font-sans selection:bg-brand-yellow selection:text-brand-black overflow-x-hidden">
      <div className="noise" />
      <a href="#main" className="skip-link">Skip to content</a>
      <CustomCursor />

      {route.page === 'post' ? (
        <BlogPost key={route.slug} slug={route.slug} />
      ) : (
        <>
          <ScrollProgress />
          <Navigation route={route} />
          <PageContent key={routeKey} route={route} heroKey={heroKey} />
        </>
      )}

      <Footer />
    </div>
    </MotionConfig>
  );
}

