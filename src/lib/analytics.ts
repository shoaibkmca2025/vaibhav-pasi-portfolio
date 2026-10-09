// Google Analytics 4. Off unless VITE_GA_ID (e.g. G-XXXXXXX) is set in Vercel; the ID is public by design.
// Tracked events:
//   generate_lead      a form was submitted successfully (failed submissions are never counted)
//   whatsapp_click     any wa.me link
//   book_call_click    the "Book a Strategy Call" buttons
//   cta_click          any element with data-track="<name>" (e.g. service page CTAs)
// Page views on in-app navigation are picked up by GA4's enhanced measurement (history changes).
import { bookingHref, hasBooking } from './booking';

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const GA_ID = String(import.meta.env.VITE_GA_ID ?? '').trim();
const enabled = /^G-[A-Z0-9]+$/.test(GA_ID);

export function track(event: string, params: Record<string, string | number> = {}) {
  if (!enabled || typeof window === 'undefined') return;
  window.gtag?.('event', event, { page_path: window.location.pathname, ...params });
}

export function initAnalytics() {
  if (!enabled || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag expects the arguments object itself, not an array
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  // One listener for every link on the site, including ones added later
  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('a, button, [data-track]');
      if (!el) return;
      const href = el instanceof HTMLAnchorElement ? el.href : '';
      if (el.dataset.track) track('cta_click', { cta: el.dataset.track });
      if (href.includes('wa.me/')) track('whatsapp_click', { link_url: href });
      else if (el.dataset.cta === 'book' || (hasBooking && href === bookingHref)) track('book_call_click');
    },
    { capture: true },
  );
}
