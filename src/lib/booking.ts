// "Book a Strategy Call": set VITE_BOOKING_URL in Vercel (your Cal.com / Calendly / Google Calendar
// booking page) and redeploy. Until then, the button opens the enquiry form instead.
const url = String(import.meta.env.VITE_BOOKING_URL ?? '').trim();

export const hasBooking = /^https:\/\//.test(url);
export const bookingHref = hasBooking ? url : '/contact#enquire';
export const bookingExternal = hasBooking;
