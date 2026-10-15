// WhatsApp chat links, using the number in src/contact.ts.
// VITE_WHATSAPP_NUMBER in Vercel (digits only, e.g. 918826406545) overrides it if ever needed.
import { contactPhone } from '../contact';

export const WHATSAPP_NUMBER = String(import.meta.env.VITE_WHATSAPP_NUMBER || contactPhone).replace(/\D/g, '');
const number = WHATSAPP_NUMBER;

export const hasWhatsApp = number.length >= 8;

export const DEFAULT_WHATSAPP_MESSAGE = "Hi Vaibhav, I'd like to discuss a project.";

// Message used by the floating button, chosen from the page being viewed
export function messageForPath(path: string, serviceMessage?: string) {
  if (serviceMessage) return serviceMessage;
  if (path.startsWith('/digital-products')) return "Hi Vaibhav, I have a question about one of your digital products.";
  if (path.startsWith('/consulting')) return "Hi Vaibhav, I'd like to book a strategy call.";
  if (path.startsWith('/tools') || path.startsWith('/growth-score')) return "Hi Vaibhav, I used one of your free tools and I'd like help implementing it for my business.";
  if (path.startsWith('/case-studies')) return "Hi Vaibhav, I saw your case studies and I'd like similar results for my business.";
  if (path.startsWith('/blog')) return "Hi Vaibhav, I read your blog and I'd like to discuss my business.";
  return DEFAULT_WHATSAPP_MESSAGE;
}

export const whatsappHref = (message = DEFAULT_WHATSAPP_MESSAGE) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
