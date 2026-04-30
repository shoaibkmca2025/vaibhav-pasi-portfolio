/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Framework from './components/Framework';
import Services from './components/Services';
import Scaling from './components/Scaling';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import FAQ from './components/FAQ';
import ContactCTA, { Footer } from './components/Footer';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Skills from './components/Skills';
import CaseStudies from './components/CaseStudies';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import CustomCursor from './components/CustomCursor';
import Marquee from './components/Marquee';
import { contactEmail, contactHref, socialLinks } from './contact';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');

  const scrollToSection = (tab: string) => {
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
      const sections = ['home', 'about', 'projects', 'casestudies', 'howitworks', 'testimonials', 'faq', 'experience', 'contact'];
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
              'faq': 'FAQ',
              'experience': 'Experience',
              'contact': 'Contact'
            };
            setActiveTab(tabMap[sectionId]);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-brand-black text-white font-sans selection:bg-brand-yellow selection:text-brand-black overflow-x-hidden">
      <div className="noise" />
      <CustomCursor />
      <Navigation activeTab={activeTab} setActiveTab={scrollToSection} />
      
      <main>
        <section id="home">
          <Hero />
          <Stats />
        </section>

        <Marquee />

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

        <section id="faq">
          <FAQ />
        </section>

        <CTASection />

        <section id="experience">
          <Experience />
        </section>

        <section id="contact" className="pt-32 pb-32 text-center bg-brand-dark-gray/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-12">Get in touch.</h1>
            <p className="text-gray-400 max-w-lg mx-auto mb-16 px-6">
              Looking to elevate your brand or discuss a potential project? I'm always open to new opportunities and strategic collaborations.
            </p>
            <a 
              href={contactHref}
              className="text-4xl md:text-6xl font-bold tracking-tighter text-brand-yellow hover:glow-yellow transition-all"
            >
              {contactEmail}
            </a>
            
            <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto px-6 pb-20">
               {socialLinks.map(social => (
                  <a 
                    key={social.label} 
                    href={social.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open Vaibhav Pasi on ${social.label}`}
                    className="p-8 border border-white/5 rounded-2xl hover:bg-brand-yellow hover:text-black transition-all group font-bold tracking-widest text-[10px]"
                  >
                     {social.label.toUpperCase()}
                  </a>
               ))}
            </div>
          </motion.div>
          <ContactCTA />
        </section>
      </main>

      <Footer />
    </div>
  );
}
