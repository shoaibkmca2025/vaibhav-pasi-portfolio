// Analytics: one `track()` call for every conversion event, sent to Google Analytics 4 when
// VITE_GA_ID is set, and always pushed to window.dataLayer (Google Tag Manager-ready).
// Never send personal data (names, emails, phone numbers) in event parameters.

export type AnalyticsEvent =
  | 'page_view'
  | 'cta_click'
  | 'hire_me_click'
  | 'whatsapp_click'
  | 'form_start'
  | 'form_submit'
  | 'growth_score_start'
  | 'growth_score_complete'
  | 'audit_purchase'
  | 'product_purchase'
  | 'booking_start'
  | 'booking_complete'
  | 'tool_use'
  | 'checkout_start';

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

export function initAnalytics() {
  if (typeof window === 'undefined' || !GA_ID || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  // Page views are sent manually on every route change (this is a single-page app)
  window.gtag('config', GA_ID, { send_page_view: false });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

export function track(event: AnalyticsEvent, params: Params = {}) {
  if (typeof window === 'undefined') return;
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...clean });
  if (window.gtag && GA_ID) window.gtag('event', event, clean);
  if (import.meta.env.DEV) console.debug('[analytics]', event, clean);
}

export function trackPageView(path: string) {
  track('page_view', { page_path: path, page_title: typeof document !== 'undefined' ? document.title : '' });
}

// Any element with data-track="event_name" (and optional data-track-label) is tracked on click,
// so CTAs don't each need their own onClick handler
export function initClickTracking() {
  if (typeof document === 'undefined') return;
  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as HTMLElement)?.closest<HTMLElement>('[data-track]');
      if (!el) return;
      const event = el.dataset.track as AnalyticsEvent;
      const label = el.dataset.trackLabel || el.textContent?.trim().slice(0, 60);
      track(event, { label, location: el.dataset.trackLocation, page_path: window.location.pathname });
      if (event !== 'cta_click') track('cta_click', { label, type: event, page_path: window.location.pathname });
    },
    { capture: true },
  );
}
