// WhatsApp deep links with context-aware pre-filled messages.
// Set VITE_WHATSAPP_NUMBER (digits only, with country code, e.g. 919876543210).
export const WHATSAPP_NUMBER = ((import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? '').replace(/\D/g, '');

export const DEFAULT_WHATSAPP_MESSAGE = "Hi Vaibhav, I found your website and I'd like to discuss a project.";

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

// Without a number, wa.me opens WhatsApp with the message and lets the visitor pick a chat,
// so the link still works while the number is being configured
export const whatsappHref = (message = DEFAULT_WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
