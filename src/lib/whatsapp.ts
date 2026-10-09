// WhatsApp chat links, using the number in src/contact.ts.
// VITE_WHATSAPP_NUMBER in Vercel (digits only, e.g. 918826406545) overrides it if ever needed.
import { contactPhone } from '../contact';

const number = String(import.meta.env.VITE_WHATSAPP_NUMBER || contactPhone).replace(/\D/g, '');

export const hasWhatsApp = number.length >= 8;

export const whatsappHref = (message = "Hi Vaibhav, I'd like to discuss a project.") =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
