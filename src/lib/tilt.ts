// Subtle pointer tilt for cards marked data-tilt (desktop mouse/trackpad only).
// One delegated, rAF-throttled listener for the whole site. The tilt is written as an inline
// transform after the card's scroll reveal has finished, so the two never fight; leaving the
// card clears it. Off for touch, Reduce Motion, narrow screens and low-powered devices.

const MAX_DEG = 3;

let started = false;

export function initTilt() {
  if (started || typeof window === 'undefined') return;
  started = true;
  const ok = () =>
    window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !document.documentElement.classList.contains('motion-lite');

  let current: HTMLElement | null = null;
  let frame = 0;
  let x = 0;
  let y = 0;

  const release = () => {
    if (!current) return;
    current.style.transform = '';
    const el = current;
    current = null;
    // Keep the quick transition until the card has settled back
    window.setTimeout(() => el !== current && el.classList.remove('is-tilting'), 450);
  };

  const apply = () => {
    frame = 0;
    if (!current) return;
    const r = current.getBoundingClientRect();
    const px = (x - r.left) / r.width - 0.5;
    const py = (y - r.top) / r.height - 0.5;
    current.style.transform = `perspective(1000px) rotateX(${(-py * MAX_DEG * 2).toFixed(2)}deg) rotateY(${(px * MAX_DEG * 2).toFixed(2)}deg) translate3d(0, -4px, 0)`;
  };

  document.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      const card = (e.target as Element | null)?.closest?.<HTMLElement>('[data-tilt]') ?? null;
      // Wait for the reveal so the inline transform doesn't cut the entrance short
      const target = card && (!card.hasAttribute('data-reveal') || card.hasAttribute('data-revealed')) && ok() ? card : null;
      if (target !== current) {
        release();
        current = target;
        current?.classList.add('is-tilting');
      }
      x = e.clientX;
      y = e.clientY;
      if (current && !frame) frame = requestAnimationFrame(apply);
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', release);
  window.addEventListener('blur', release);
}
