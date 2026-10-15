import { Linkedin } from 'lucide-react';
import { siGithub, siInstagram, siX } from 'simple-icons';
import { BrandIcon } from './ToolLogos';

// Logo for each profile in contact.ts socialLinks (LinkedIn isn't in Simple Icons, so lucide's glyph is used)
const ICONS = { Instagram: siInstagram, Twitter: siX, GitHub: siGithub } as const;

export default function SocialIcon({ label, className = 'w-4 h-4' }: { label: string; className?: string }) {
  if (label === 'LinkedIn') return <Linkedin className={className} aria-hidden />;
  const icon = ICONS[label as keyof typeof ICONS];
  return icon ? (
    <span aria-hidden>
      <BrandIcon icon={icon} className={className} />
    </span>
  ) : null;
}
