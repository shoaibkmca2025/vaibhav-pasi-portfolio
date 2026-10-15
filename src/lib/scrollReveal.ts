// Scroll-reveal system for the whole site. Content is visible by default: the hidden
// "before" states in index.css only apply once <html> has .motion-ready, which this
// module adds after it has marked everything already on screen as revealed. If the
// script never runs (or throws), nothing is ever hidden.
//
// Markup API (all plain attributes, so they survive React re-renders):
//   data-reveal="up" | "scale" | "mask" | "heading" | "line"   reveal one element
//   data-reveal-stagger                                         reveal direct children in sequence
//   data-count                                                  count a number up once (e.g. "3.1M", "+67,471%")
//
// Section headers (.section-head) are wired up automatically, so headings, eyebrows
// and intro paragraphs share one treatment without per-component changes.

const REVEALED = 'data-revealed';
const MAX_STAGGER = 6;

// Auto-registered selectors → reveal type
const AUTO: [string, string][] = [
  ['.section-head .eyebrow', 'up'],
  ['.section-head h2', 'heading'],
  ['.section-head p', 'up'],
];

let observer: IntersectionObserver | null = null;
let started = false;

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function inViewport(el: Element) {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight * 0.92 && r.bottom > 0;
}

function reveal(el: Element) {
  if (el.hasAttribute(REVEALED)) return;
  el.setAttribute(REVEALED, '');
  observer?.unobserve(el);
  if (el.hasAttribute('data-count')) countUp(el as HTMLElement);
  el.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);
  // Items in a horizontal swipe row (e.g. testimonials on phones) arrive together: the ones
  // still off to the side would otherwise stay hidden until swiped into view
  const row = el.parentElement;
  if (row && row.scrollWidth > row.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(row).overflowX)) {
    row.querySelectorAll(':scope > [data-reveal]').forEach(reveal);
  }
}

// Prepare one element: index stagger children, then either reveal now (on screen) or observe
function register(el: Element, armed: boolean) {
  if (el.hasAttribute(REVEALED) || el.hasAttribute('data-reveal-registered')) return;
  el.setAttribute('data-reveal-registered', '');
  if (el.hasAttribute('data-reveal-stagger')) {
    Array.from(el.children).forEach((child, i) => {
      (child as HTMLElement).style.setProperty('--i', String(Math.min(i, MAX_STAGGER)));
    });
  }
  // Before arming, anything already visible is shown as-is (no flash, no re-animation)
  if (!armed && inViewport(el)) {
    el.setAttribute(REVEALED, '');
    return;
  }
  observer?.observe(el);
}

function scan(root: ParentNode, armed: boolean) {
  for (const [selector, type] of AUTO) {
    root.querySelectorAll(selector).forEach((el) => {
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', type);
    });
  }
  root.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach((el) => register(el, armed));
  // Counters outside any reveal wrapper still count when they scroll in
  root.querySelectorAll('[data-count]').forEach((el) => {
    if (!el.closest('[data-reveal], [data-reveal-stagger]')) register(el, armed);
  });
}

// Animates the number inside an element's text from 0, keeping prefix, suffix,
// decimals and thousands separators; ends on the exact original text
function countUp(el: HTMLElement) {
  if (el.dataset.counted || reduceMotion()) return;
  el.dataset.counted = '1';
  const original = el.textContent ?? '';
  const match = original.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  if (!match) return;
  const [, prefix, numText, suffix] = match;
  const target = parseFloat(numText.replace(/,/g, ''));
  // Years and other bare four-digit labels read oddly when counted, so they stay put
  if (!isFinite(target) || (/^\d{4}$/.test(numText) && !prefix && !suffix)) return;
  const decimals = numText.includes('.') ? numText.split('.')[1].length : 0;
  const grouped = numText.includes(',');
  const format = (n: number) =>
    prefix +
    n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouped }) +
    suffix;
  const duration = 1400;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = t < 1 ? format(target * eased) : original;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function initScrollReveal() {
  // Safe to call more than once (React StrictMode runs effects twice in development)
  if (started || typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  started = true;
  const root = document.documentElement;
  // Reduced motion: leave everything visible and static
  if (reduceMotion()) return;
  // Smaller, quicker movement on phones and low-powered devices (read by index.css)
  const nav = navigator as Navigator & { deviceMemory?: number };
  if ((nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 2) root.classList.add('motion-lite');

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
    },
    // The trigger zone runs from ~18% up the viewport to far above it. Elements reveal as they
    // rise past the 18% line, and anything already scrolled past counts too: during a fast flick
    // an element can jump from below the viewport to above it between frames, and a zone that
    // ended at the top edge would never report it.
    { rootMargin: '100000px 0px -18% 0px', threshold: 0 },
  );

  try {
    scan(document, false);
    root.classList.add('motion-ready');
  } catch (err) {
    // Never leave content hidden because of an animation bug
    root.classList.remove('motion-ready');
    console.error(err);
    return;
  }

  // Pages rendered later (client-side navigation) are picked up as they mount
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        const el = node as Element;
        if (el.matches('[data-reveal], [data-reveal-stagger], [data-count]')) register(el, true);
        scan(el, true);
      });
    }
  });
  mo.observe(document.getElementById('root') ?? document.body, { childList: true, subtree: true });

  // Printing or jumping to an anchor should never show half-hidden content
  window.addEventListener('beforeprint', () => document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach(reveal));
}
