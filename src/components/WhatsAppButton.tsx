import { hasWhatsApp, whatsappHref } from '../lib/whatsapp';

// Floating "chat on WhatsApp" button, bottom-right on every page (only when a number is configured)
export default function WhatsAppButton() {
  if (!hasWhatsApp) return null;
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Vaibhav on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed z-[900] right-4 sm:right-6 bottom-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-6 grid w-14 h-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 hover:scale-105 active:scale-95 transition-transform"
    >
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden>
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.43 9.43 0 0 1-4.8-1.31l-.35-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.99 6.67 2.77a9.37 9.37 0 0 1 2.76 6.68c0 5.21-4.24 9.43-9.44 9.43zm8.04-17.47A11.3 11.3 0 0 0 12.04.7C5.78.7.68 5.8.68 12.07c0 2 .52 3.96 1.52 5.68L.6 23.3l5.69-1.49a11.3 11.3 0 0 0 5.75 1.47h.01c6.27 0 11.37-5.1 11.37-11.37 0-3.04-1.18-5.89-3.33-8.04z" />
      </svg>
    </a>
  );
}
