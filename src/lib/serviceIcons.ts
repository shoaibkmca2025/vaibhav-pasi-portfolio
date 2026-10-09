import { Bot, Code2, Compass, Database, Globe, GraduationCap, Linkedin, Megaphone, Search, UserRound, type LucideIcon } from 'lucide-react';
import type { Service } from '../content/services';

export const SERVICE_ICONS: Record<Service['icon'], LucideIcon> = {
  globe: Globe,
  megaphone: Megaphone,
  search: Search,
  bot: Bot,
  database: Database,
  code: Code2,
  compass: Compass,
  linkedin: Linkedin,
  user: UserRound,
  graduation: GraduationCap,
};
