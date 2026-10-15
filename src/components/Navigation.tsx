import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Twitter, Instagram, Linkedin, Menu, X } from 'lucide-react';
import { socialLinks } from '../contact';
import { bookingExternal, bookingHref } from '../lib/booking';
import ThemeToggle from './ThemeToggle';
import { navPages, onLinkClick, type Route } from '../router';

const navItems = [{ key: 'home', path: '/', label: 'Home' }, ...navPages];

// Articles live under the Blog tab
// Article pages highlight Blog; individual service pages highlight Services
// Sub-pages highlight their section: articles → Insights, services → Services, profiles → 4AM Team
const activeKey = (route: Route) =>
  route.page === 'post' ? 'blog' : route.page === 'service' ? 'services' : route.page === 'member' ? 'team' : route.page;

export default function Navigation({ route }: { route: Route }) {
  const [isOpen, setIsOpen] = useState(false);
  const active = activeKey(route);

  const socials = [
    { icon: Linkedin, ...socialLinks[0] },
    { icon: Twitter, ...socialLinks[2] },
    { icon: Instagram, ...socialLinks[1] },
  ];

  // Lock page scroll and allow Escape to close while the mobile menu is open
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  // Close the menu whenever the page changes
  useEffect(() => setIsOpen(false), [active]);

  // Header state from scroll position: a denser bar once the page moves, and the bar slides away
  // while reading downwards (back on any upward scroll). One passive listener, rAF-throttled;
  // React skips the re-render when a value hasn't changed.
  const [scrolled, setScrolled] = useState(false);
  const [tucked, setTucked] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      // Never hide while the menu is open or while focus is inside the bar (keyboard users)
      const focusInside = navRef.current?.contains(document.activeElement) ?? false;
      if (Math.abs(y - lastY) > 6) {
        setTucked(y > lastY && y > 480 && !focusInside);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Home page: which section is in view (visual hint only; aria-current stays with the real page)
  const [section, setSection] = useState<string | null>(null);
  useEffect(() => {
    if (route.page !== 'home') {
      setSection(null);
      return;
    }
    const targets = ['services', 'work', 'about', 'contact']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    let frame = 0;
    // The section crossing a line ~45% down the viewport is current; at the very bottom of the
    // page the last section wins even if it can't reach that line
    const pick = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let current: string | null = null;
      for (const el of targets) {
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) current = el.id;
      }
      const last = targets[targets.length - 1];
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom && last && last.getBoundingClientRect().top < window.innerHeight) current = last.id;
      setSection(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(pick);
    };
    pick();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [route.page]);

  return (
    <>
    <nav
      ref={navRef}
      aria-label="Primary"
      data-scrolled={scrolled || undefined}
      data-tucked={(tucked && !isOpen) || undefined}
      className="site-header fixed top-0 left-0 w-full z-[1000] flex items-center justify-between gap-6 lg:gap-4 xl:gap-6 py-4 md:py-6 px-5 sm:px-6 md:px-12 lg:px-8 xl:px-12 backdrop-blur-md bg-brand-black/85 border-b border-white/5"
    >
      <a href="/" onClick={onLinkClick} className="text-xl font-bold tracking-tighter uppercase italic whitespace-nowrap">
        Vaibhav Pasi
      </a>

      <ul className="hidden lg:flex items-center gap-4 xl:gap-9">
        {navItems.map((item) => (
          <li key={item.key}>
            <a
              href={item.path}
              onClick={onLinkClick}
              aria-current={active === item.key ? 'page' : undefined}
              className={`relative whitespace-nowrap text-sm xl:text-[0.9375rem] font-medium transition-colors hover:text-accent ${
                active === item.key ? 'text-accent' : section === item.key ? 'text-white' : 'text-gray-400'
              }`}
            >
              {item.label}
              <span
                aria-hidden
                className={`section-tick absolute -bottom-1.5 left-0 w-full h-px rounded-full bg-accent/60 ${section === item.key ? 'is-on' : ''}`}
              />
              {active === item.key && (
                <motion.span layoutId="activeTab" className="absolute -bottom-1.5 left-0 w-full h-[2px] rounded-full bg-accent" />
              )}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4 md:gap-6 lg:gap-4 xl:gap-6">
        <div className="hidden sm:flex lg:hidden 2xl:flex items-center gap-4 mr-2 border-r border-white/10 pr-6">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={`Open Vaibhav Pasi on ${social.label}`}
              className="p-1.5 -m-1.5 text-gray-400 hover:text-accent transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <social.icon className="w-4 h-4" />
            </a>
          ))}
        </div>

        <ThemeToggle className="-mx-2 md:mx-0" />

        <a
          href={bookingHref}
          data-cta="book"
          {...(bookingExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="hidden md:inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-yellow text-black px-5 py-2.5 text-sm font-semibold hover:brightness-105 hover:shadow-lg hover:shadow-brand-yellow/20 transition-all"
        >
          Book a Strategy Call <ArrowUpRight className="w-4 h-4" aria-hidden />
        </a>

        <button
          type="button"
          className="lg:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </nav>

      {/* Rendered outside <nav>: its backdrop-blur would otherwise become the containing block for this fixed overlay */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-black z-[999] lg:hidden flex flex-col pt-24 px-6 overflow-y-auto overscroll-contain"
          >
            {/* Background Accent */}
            <div className="pointer-events-none absolute top-0 right-0 w-[300px] h-[300px] bg-brand-yellow/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

            <ul className="flex flex-col gap-4 relative z-10">
              {navItems.map((item, idx) => (
                <motion.li
                  key={item.key}
                  initial={{ opacity: 0, x: -30, rotate: -2 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    delay: idx * 0.05,
                    type: 'spring',
                    stiffness: 100,
                    damping: 15,
                  }}
                >
                  <a
                    href={item.path}
                    onClick={(e) => {
                      onLinkClick(e);
                      setIsOpen(false);
                    }}
                    aria-current={active === item.key ? 'page' : undefined}
                    className={`block text-4xl sm:text-5xl font-black tracking-tighter uppercase italic leading-none py-1 ${
                      active === item.key ? 'text-accent' : 'text-white/45 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-auto pb-[max(3rem,env(safe-area-inset-bottom))] pt-8 mt-10 border-t border-white/5 flex flex-col gap-10"
            >
              <div className="flex gap-8">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open Vaibhav Pasi on ${social.label}`}
                    className="p-2.5 -m-2.5 text-gray-400 hover:text-accent transition-colors"
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>

              <a
                href={bookingHref}
          data-cta="book"
          {...(bookingExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-yellow text-black py-4 text-base font-semibold"
              >
                Book a Strategy Call <ArrowUpRight className="w-4 h-4" aria-hidden />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
