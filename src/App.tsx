/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, MotionConfig } from 'motion/react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Framework from './components/Framework';
import Services from './components/Services';
import Scaling from './components/Scaling';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import FAQ from './components/FAQ';
import { Footer } from './components/Footer';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Skills from './components/Skills';
import CaseStudies from './components/CaseStudies';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import CustomCursor from './components/CustomCursor';
import Marquee from './components/Marquee';
import Press from './components/Press';
import Blog, { BlogIndex } from './components/Blog';
import BlogPost from './components/BlogPost';
import BlogHeader from './components/BlogHeader';
import ScrollProgress from './components/ScrollProgress';
import { contactEmail, contactHref, socialLinks } from './contact';
import { navigate, useRoute } from './router';
import { applySeo, getSeo } from './seo';
import { SPLASH_DONE_EVENT } from './splash';

// `initialPath` is passed when prerendering at build time; in the browser the URL is used
export default function App({ initialPath }: { initialPath?: string }) {
  const [activeTab, setActiveTab] = useState('Home');
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
    if (route.page !== 'home') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      // Back on the home page: the target section only exists after this render
      const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [routeKey]);

  const scrollToSection = (tab: string) => {
    if (tab === 'Blog') {
      navigate('/blog');
      return;
    }
    const id = tab.toLowerCase().replace(/\s+/g, '');
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveTab(tab);
    } else {
      // Fallback for "Contact" which might be in the footer area or specific section
      setActiveTab(tab);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'casestudies', 'howitworks', 'testimonials', 'blog', 'faq', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            const tabMap: Record<string, string> = {
              'home': 'Home',
              'about': 'About',
              'projects': 'Projects',
              'casestudies': 'Case Studies',
              'howitworks': 'How It Works',
              'testimonials': 'Testimonials',
              'blog': 'Blog',
              'faq': 'FAQ',
              'experience': 'Experience',
              'contact': 'Contact'
            };
            setActiveTab(tabMap[sectionId]);
          }
        }
      }
    };

    // Passive + one check per frame keeps scrolling smooth on phones
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        handleScroll();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-brand-black text-white font-sans selection:bg-brand-yellow selection:text-brand-black overflow-x-hidden">
      <div className="noise" />
      <CustomCursor />

      {route.page === 'post' ? (
        <BlogPost key={route.slug} slug={route.slug} />
      ) : route.page === 'blog' ? (
        <>
          <ScrollProgress />
          <BlogHeader backHref="/" backLabel="Home" />
          <BlogIndex />
        </>
      ) : (
      <>
      <ScrollProgress />
      <Navigation activeTab={activeTab} setActiveTab={scrollToSection} />

      <main>
        <section id="home">
          <Hero key={heroKey} />
          <Stats />
        </section>

        <Marquee />

        <section id="press">
          <Press />
        </section>

        <section id="about">
          <About />
          <Framework />
          <Services />
          <Scaling />
          <Skills />
        </section>

        <section id="projects">
          <Projects />
        </section>

        <section id="casestudies">
          <CaseStudies />
        </section>

        <section id="howitworks">
          <HowItWorks />
        </section>

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

        <section id="experience">
          <Experience />
        </section>

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
              className="inline-block px-5 text-2xl min-[400px]:text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter text-brand-yellow hover:glow-yellow transition-all break-all sm:break-normal"
            >
              {contactEmail}
            </a>
            
            <div className="mt-16 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-8 max-w-4xl mx-auto px-5 sm:px-6 pb-10 md:pb-20">
               {socialLinks.map(social => (
                  <a 
                    key={social.label} 
                    href={social.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open Vaibhav Pasi on ${social.label}`}
                    className="p-6 md:p-8 border border-white/5 rounded-2xl hover:bg-brand-yellow hover:text-black transition-all group font-bold tracking-widest text-[10px]"
                  >
                     {social.label.toUpperCase()}
                  </a>
               ))}
            </div>
          </motion.div>
        </section>
      </main>
      </>
      )}

      <Footer />
    </div>
    </MotionConfig>
  );
}
