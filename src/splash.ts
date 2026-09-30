// Lifts the intro splash (markup and styles live in index.html) once the app is ready,
// keeping it up long enough for the name animation to finish.
const MIN_VISIBLE_MS = 2000;

export const SPLASH_DONE_EVENT = 'splash:done';

export function finishSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;

  if (document.documentElement.classList.contains('no-splash')) {
    splash.remove();
    return;
  }

  const wait = Math.max(0, MIN_VISIBLE_MS - performance.now());
  window.setTimeout(() => {
    try {
      sessionStorage.setItem('vp-splash', '1');
    } catch {
      // Storage unavailable (private mode): the splash will simply show again next visit
    }
    splash.classList.add('exit');
    // Lets the hero replay its entrance as the curtain lifts
    window.dispatchEvent(new Event(SPLASH_DONE_EVENT));
    window.setTimeout(() => splash.remove(), 1000);
  }, wait);
}
