import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { contactHref } from '../contact';
import { onLinkClick } from '../router';

interface BlogHeaderProps {
  backHref: string;
  backLabel: string;
  // Optional action on the right (e.g. share); defaults to a contact link
  action?: ReactNode;
}

// Slim top bar used on the blog page and article pages in place of the main navigation
export default function BlogHeader({ backHref, backLabel, action }: BlogHeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-[1000] grid grid-cols-[1fr_auto_1fr] items-center py-4 px-5 sm:px-6 md:px-12 backdrop-blur-md bg-brand-black/60 border-b border-white/5">
      <a
        href={backHref}
        onClick={onLinkClick}
        className="justify-self-start inline-flex items-center gap-2 py-2 text-[0.6875rem] font-bold tracking-widest uppercase text-gray-300 hover:text-brand-yellow transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {backLabel}
      </a>
      <a href="/" onClick={onLinkClick} className="text-base sm:text-lg font-bold tracking-tighter uppercase italic whitespace-nowrap">
        Vaibhav Pasi
      </a>
      <div className="justify-self-end">
        {action ?? (
          <a
            href={contactHref}
            className="hidden sm:inline-block bg-brand-yellow text-black px-5 py-2.5 text-[0.6875rem] font-bold uppercase tracking-widest hover:brightness-110 transition-all"
          >
            Let's collaborate
          </a>
        )}
      </div>
    </header>
  );
}
