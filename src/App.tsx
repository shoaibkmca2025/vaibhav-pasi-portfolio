/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { MotionConfig } from 'motion/react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Credibility from './components/Credibility';
import CoreServices from './components/CoreServices';
import { FeaturedProjects } from './components/CaseStudies';
import AboutIntro from './components/AboutIntro';
import HowItWorks from './components/HowItWorks';
import FAQ from './components/FAQ';
import { Footer } from './components/Footer';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import CustomCursor from './components/CustomCursor';
import Blog, { BlogIndex } from './components/Blog';
import BlogPost from './components/BlogPost';
import ScrollProgress from './components/ScrollProgress';
import InstagramGallery from './components/InstagramGallery';
import WhatsAppButton from './components/WhatsAppButton';
import { AboutPage, ClientWinsPage, ContactPage, PrivacyPage, ServicesPage, TermsPage, WorkPage } from './pages/Pages';
import ServiceDetailPage from './pages/ServiceDetailPage';
import { useRoute, type Route } from './router';
import { applySeo, getSeo } from './seo';
import { SPLASH_DONE_EVENT } from './splash';

// Home is the overview; each nav item has its own detailed page.
// Order follows the site brief: hero, proof, services, work, about, process,
// testimonials, Instagram, insights, FAQ, final call to action.
function HomePage({ heroKey }: { heroKey: number }) {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <section id="home">
        <Hero key={heroKey} />
      </section>

      <Credibility />

      <section id="services">
        <CoreServices />
      </section>

      <section id="work">
        <FeaturedProjects />
      </section>

      <section id="about">
        <AboutIntro />
      </section>

      <section id="process">
        <HowItWorks />
      </section>

      <section id="testimonials">
        <Testimonials />
      </section>

      <section id="instagram">
        <InstagramGallery />
      </section>

      <section id="blog">
        <Blog />
      </section>

      <section id="faq">
        <FAQ />
      </section>

      <section id="contact">
        <CTASection />
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
    case 'service':
      return <ServiceDetailPage slug={route.slug} />;
    case 'work':
      return <WorkPage />;
    case 'client-wins':
      return <ClientWinsPage />;
    case 'contact':
      return <ContactPage />;
    case 'privacy':
      return <PrivacyPage />;
    case 'terms':
      return <TermsPage />;
    case 'blog':
      return <BlogIndex />;
    default:
      return <HomePage heroKey={heroKey} />;
  }
}

// `initialPath` is passed when prerendering at build time; in the browser the URL is used
export default function App({ initialPath }: { initialPath?: string }) {
  const route = useRoute(initialPath);
  const routeKey =
    route.page === 'post' ? `post:${route.slug}` : route.page === 'service' ? `service:${route.slug}` : route.page;
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
      <WhatsAppButton />
    </div>
    </MotionConfig>
  );
}

