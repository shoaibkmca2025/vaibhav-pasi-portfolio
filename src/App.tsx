/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
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
import Blog, { BlogIndex } from './components/Blog';
import BlogPost from './components/BlogPost';
import ScrollProgress from './components/ScrollProgress';
import InstagramGallery from './components/InstagramGallery';
import WhatsAppButton from './components/WhatsAppButton';
import BackToTop from './components/BackToTop';
import { AboutPage, ClientWinsPage, ContactPage, PrivacyPage, ServicesPage, TermsPage, WorkPage } from './pages/Pages';
import TeamPage from './pages/TeamPage';
import NotFoundPage from './pages/NotFoundPage';
import TeamMemberPage from './pages/TeamMemberPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import SitemapPage from './pages/SitemapPage';
import { useRoute, type Route } from './router';
import { applySeo, getSeo } from './seo';
import { initScrollReveal } from './lib/scrollReveal';
import { initTilt } from './lib/tilt';

// Home is the overview; each nav item has its own detailed page.
// Order follows the site brief: hero, proof, services, work, about, process,
// testimonials, Instagram, insights, FAQ, final call to action.
function HomePage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <section id="home">
        <Hero />
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

function PageContent({ route }: { route: Route; key?: string }) {
  switch (route.page) {
    case 'about':
      return <AboutPage />;
    case 'team':
      return <TeamPage />;
    case 'member':
      return <TeamMemberPage slug={route.slug} />;
    case 'not-found':
      return <NotFoundPage />;
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
    case 'sitemap':
      return <SitemapPage />;
    case 'blog':
      return <BlogIndex />;
    default:
      return <HomePage />;
  }
}

// `initialPath` is passed when prerendering at build time; in the browser the URL is used
export default function App({ initialPath }: { initialPath?: string }) {
  const route = useRoute(initialPath);
  const routeKey =
    route.page === 'post' || route.page === 'service' || route.page === 'member' ? `${route.page}:${route.slug}` : route.page;
  const previousRoute = useRef(routeKey);

  // Scroll reveals arm after hydration has committed, so prerendered content is never hidden first
  useEffect(() => {
    initScrollReveal();
    initTilt();
  }, []);


  useEffect(() => {
    if (previousRoute.current === routeKey) return;
    previousRoute.current = routeKey;
    applySeo(getSeo(window.location.pathname));
    // A hash (e.g. /#faq) jumps to that section once the new page has rendered
    const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
    // Short page transition on client-side navigation (never on the first, prerendered load).
    // Opacity and a few pixels of movement only; the page is interactive throughout.
    const main = document.getElementById('main');
    if (main && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      main.animate(
        [
          { opacity: 0, transform: 'translate3d(0, 10px, 0)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 380, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      );
    }
  }, [routeKey]);

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-brand-black text-white font-sans selection:bg-brand-yellow selection:text-brand-black overflow-x-clip">
      <div className="noise" />
      <a href="#main" className="skip-link">Skip to content</a>

      {route.page === 'post' ? (
        <BlogPost key={route.slug} slug={route.slug} />
      ) : (
        <>
          <ScrollProgress />
          <Navigation route={route} />
          <PageContent key={routeKey} route={route} />
        </>
      )}

      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
    </MotionConfig>
  );
}

