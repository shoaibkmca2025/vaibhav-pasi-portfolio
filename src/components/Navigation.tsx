import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Twitter, Instagram, Linkedin, Menu, X } from 'lucide-react';
import { contactHref, socialLinks } from '../contact';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = ['Home', 'About', 'Projects', 'Case Studies', 'How It Works', 'Testimonials', 'FAQ', 'Experience', 'Contact'];

  const socials = [
    { icon: Linkedin, ...socialLinks[0] },
    { icon: Twitter, ...socialLinks[2] },
    { icon: Instagram, ...socialLinks[1] },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] flex items-center justify-between py-6 px-6 md:px-12 backdrop-blur-md bg-brand-black/50 border-b border-white/5">
      <div className="text-xl font-bold tracking-tighter uppercase italic">
        Vaibhav Pasi
      </div>
      
      <div className="hidden lg:flex items-center gap-8">
        {navItems.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setActiveTab(item)}
            className={`text-[11px] font-bold tracking-widest uppercase transition-colors hover:text-brand-yellow relative ${
              activeTab === item ? 'text-brand-yellow' : 'text-gray-400'
            }`}
          >
            {item}
            {activeTab === item && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-1 left-0 w-full h-[1px] bg-brand-yellow"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden sm:flex items-center gap-4 mr-2 border-r border-white/10 pr-6">
          {socials.map((social, idx) => (
            <a 
              key={idx} 
              href={social.href} 
              aria-label={`Open Vaibhav Pasi on ${social.label}`}
              className="text-gray-400 hover:text-brand-yellow transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <social.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
        
        <a
          href={contactHref}
          className="hidden md:block bg-brand-yellow text-black px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all"
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-black z-[999] lg:hidden flex flex-col pt-32 px-6"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-yellow/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex flex-col gap-4 relative z-10">
              {navItems.map((item, idx) => (
                <motion.button
                  key={item}
                  type="button"
                  initial={{ opacity: 0, x: -30, rotate: -2 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ 
                    delay: idx * 0.05,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  onClick={() => {
                    setActiveTab(item);
                    setIsOpen(false);
                  }}
                  className={`text-5xl font-black tracking-tighter text-left uppercase italic leading-none ${
                    activeTab === item ? 'text-brand-yellow' : 'text-white/20'
                  }`}
                >
                  {item}
                </motion.button>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-auto pb-12 pt-10 border-t border-white/5 flex flex-col gap-10"
            >
              <div className="flex gap-8">
                {socials.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open Vaibhav Pasi on ${social.label}`}
                    className="text-gray-400 hover:text-brand-yellow transition-colors"
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
    </nav>
  );
}
