// WhatsApp chat links. Set VITE_WHATSAPP_NUMBER in Vercel (international format, digits only,
// e.g. 919876543210) and redeploy; until then, WhatsApp buttons are hidden and CTAs use /contact.
const number = String(import.meta.env.VITE_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');

export const hasWhatsApp = number.length >= 8;

export const whatsappHref = (message = "Hi Vaibhav, I'd like to discuss a project.") =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
