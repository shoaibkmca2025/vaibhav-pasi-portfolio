import { ArrowUp, ArrowUpRight, Mail } from 'lucide-react';
import { contactEmail, contactHref, socialLinks } from '../contact';
import { posts } from '../blog/posts';
import { onLinkClick } from '../router';
import { person } from '../site';

const exploreLinks = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Client Wins', href: '/client-wins' },
  { label: 'Press', href: '/#press' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/contact' },
];

const linkClass = 'text-sm text-gray-400 hover:text-brand-yellow transition-colors';
const headingClass = 'text-[0.6875rem] font-bold tracking-[0.3em] uppercase text-gray-500 mb-5';

export function Footer() {
  const year = new Date().getFullYear();
  const latest = posts.slice(0, 3);

  return (
    <footer className="relative border-t border-white/5 bg-brand-black overflow-hidden">
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[300px] md:w-[900px] md:h-[400px] bg-brand-yellow/5 blur-[100px] md:blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 md:px-12 lg:px-24 pt-16 md:pt-24 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-5">
            <a href="/" onClick={onLinkClick} className="text-2xl font-bold tracking-tighter uppercase italic">
              Vaibhav Pasi
            </a>
            <p className="mt-2 text-[0.6875rem] font-bold tracking-[0.3em] uppercase text-brand-yellow">Tech x Marketing</p>
            <p className="mt-6 text-sm text-gray-400 font-normal leading-relaxed max-w-sm">
              Digital marketing strategist, software developer and AI consultant. Co-Founder of{' '}
              {person.organization.name}, helping brands scale through growth marketing, AI and e-commerce.
            </p>
            <a
              href={contactHref}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-brand-yellow transition-colors break-all"
            >
              <Mail className="w-4 h-4 shrink-0 text-brand-yellow" /> {contactEmail}
            </a>
          </div>

          {/* Explore */}
          <nav aria-label="Footer" className="lg:col-span-2">
            <p className={headingClass}>Explore</p>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} onClick={onLinkClick} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Latest articles */}
          <div className="lg:col-span-3">
            <p className={headingClass}>Latest articles</p>
            <ul className="space-y-4">
              {latest.map((post) => (
                <li key={post.slug}>
                  <a href={`/blog/${post.slug}`} onClick={onLinkClick} className="group block">
                    <span className="text-sm text-gray-300 group-hover:text-brand-yellow transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </span>
                    <span className="mt-1 block text-[0.6875rem] font-bold tracking-widest uppercase text-gray-500">
                      {post.category} · {post.readingMinutes} min read
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/blog"
                  onClick={onLinkClick}
                  className="inline-flex items-center gap-1.5 text-[0.6875rem] font-bold tracking-[0.3em] uppercase text-brand-yellow hover:gap-2.5 transition-all"
                >
                  All articles <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="lg:col-span-2">
            <p className={headingClass}>Follow</p>
            <ul className="space-y-3">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className={`${linkClass} inline-flex items-center gap-1.5`}
                  >
                    {social.label} <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 md:mt-20 pt-8 pb-[env(safe-area-inset-bottom)] border-t border-white/5 flex flex-col-reverse sm:flex-row items-center justify-between gap-6">
          <p className="text-[0.6875rem] tracking-widest text-gray-500 uppercase font-bold text-center sm:text-left">
            © {year} Vaibhav Pasi. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex items-center gap-3 text-[0.6875rem] font-bold tracking-[0.3em] uppercase text-gray-400 hover:text-brand-yellow transition-colors"
          >
            Back to top
            <span className="w-11 h-11 rounded-full border border-white/10 group-hover:border-brand-yellow flex items-center justify-center transition-colors">
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
