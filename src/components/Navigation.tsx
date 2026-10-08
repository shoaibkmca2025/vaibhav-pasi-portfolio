import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Twitter, Instagram, Linkedin, Menu, X } from 'lucide-react';
import { contactHref, socialLinks } from '../contact';
import { onLinkClick, sitePages, type Route } from '../router';

const navItems = [{ key: 'home', path: '/', label: 'Home' }, ...sitePages];

// Articles live under the Blog tab
const activeKey = (route: Route) => (route.page === 'post' ? 'blog' : route.page);

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

  return (
    <>
    <nav
      aria-label="Primary"
      className="fixed top-0 left-0 w-full z-[1000] flex items-center justify-between gap-6 py-4 md:py-6 px-5 sm:px-6 md:px-12 backdrop-blur-md bg-brand-black/50 border-b border-white/5"
    >
      <a href="/" onClick={onLinkClick} className="text-xl font-bold tracking-tighter uppercase italic whitespace-nowrap">
        Vaibhav Pasi
      </a>

      <ul className="hidden lg:flex items-center gap-6 xl:gap-9">
        {navItems.map((item) => (
          <li key={item.key}>
            <a
              href={item.path}
              onClick={onLinkClick}
              aria-current={active === item.key ? 'page' : undefined}
              className={`relative whitespace-nowrap text-[0.6875rem] font-bold tracking-widest uppercase transition-colors hover:text-brand-yellow ${
                active === item.key ? 'text-brand-yellow' : 'text-gray-400'
              }`}
            >
              {item.label}
              {active === item.key && (
                <motion.span layoutId="activeTab" className="absolute -bottom-1.5 left-0 w-full h-[1px] bg-brand-yellow" />
              )}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden sm:flex lg:hidden 2xl:flex items-center gap-4 mr-2 border-r border-white/10 pr-6">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={`Open Vaibhav Pasi on ${social.label}`}
              className="p-1.5 -m-1.5 text-gray-400 hover:text-brand-yellow transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <social.icon className="w-4 h-4" />
            </a>
          ))}
        </div>

        <a
          href={contactHref}
          className="hidden md:block whitespace-nowrap bg-brand-yellow text-black px-6 py-2.5 text-[0.6875rem] font-bold uppercase tracking-widest hover:brightness-110 transition-all"
        >
          LET'S COLLABORATE
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
                      active === item.key ? 'text-brand-yellow' : 'text-white/45 hover:text-white'
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
                    className="p-2.5 -m-2.5 text-gray-400 hover:text-brand-yellow transition-colors"
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>

              <a
                href={contactHref}
                className="w-full bg-brand-yellow text-black py-5 font-black uppercase tracking-widest text-xs text-center"
              >
                LET'S COLLABORATE
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
