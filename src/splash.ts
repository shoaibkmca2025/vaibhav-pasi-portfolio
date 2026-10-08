// Lifts the intro splash (markup and styles live in index.html) once the app is ready.
// It stays up just long enough for the name to finish animating, and any tap, click,
// key press or scroll skips it straight away, so nobody is made to wait.
const MIN_VISIBLE_MS = 1600;
const SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

export const SPLASH_DONE_EVENT = 'splash:done';

export function finishSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;

  if (document.documentElement.classList.contains('no-splash')) {
    splash.remove();
    return;
  }

  let done = false;
  const lift = () => {
    if (done) return;
    done = true;
    window.clearTimeout(timer);
    SKIP_EVENTS.forEach((type) => window.removeEventListener(type, lift));
    try {
      sessionStorage.setItem('vp-splash', '1');
    } catch {
      // Storage unavailable (private mode): the splash will simply show again next visit
    }
    splash.classList.add('exit');
    // Lets the hero replay its entrance as the curtain lifts
    window.dispatchEvent(new Event(SPLASH_DONE_EVENT));
    window.setTimeout(() => splash.remove(), 1000);
  };

  SKIP_EVENTS.forEach((type) => window.addEventListener(type, lift, { passive: true }));
  const timer = window.setTimeout(lift, Math.max(0, MIN_VISIBLE_MS - performance.now()));
}
