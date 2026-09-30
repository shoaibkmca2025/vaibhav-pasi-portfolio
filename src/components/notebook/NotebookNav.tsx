import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { navItems } from './data';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 12, behavior: 'smooth' });
}

// Fixed HUD: name ribbon, brutalist nav with a sliding indicator, and a "you've seen X%" tracker with a clock
export default function NotebookNav() {
  const [active, setActive] = useState<string>('home');
  const [seen, setSeen] = useState(0);
  const [time, setTime] = useState('--:--:--');
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pillRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-GB', { hour12: false, timeZone: 'Asia/Kolkata' }));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setSeen(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0);
      const probe = window.scrollY + window.innerHeight * 0.35;
      let current: string = navItems[0].id;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= probe) current = item.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useIsoLayoutEffect(() => {
    const measure = () => {
      const el = itemRefs.current[active];
      if (!el) return;
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
      const pill = pillRef.current;
      if (pill && pill.scrollWidth > pill.clientWidth) {
        pill.scrollTo({ left: el.offsetLeft - (pill.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  return (
    <>
      {/* Top ribbon */}
      <div className="fixed top-0 inset-x-0 z-[900] pointer-events-none pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between gap-4 px-4 md:px-8 py-2 bg-navy text-paper font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em]">
          <span className="truncate">
            <span className="text-marker">●</span> Vaibhav Pasi <span className="opacity-50">aka</span> VP
          </span>
          <span className="hidden md:block truncate opacity-70 normal-case tracking-normal font-hand text-sm">
            Started as a marketer. Ended up building the machines.
          </span>
          <span className="shrink-0">
            SYS.TRACK_ACTIVE <span className="opacity-50">//</span> VOL.2026
          </span>
        </div>
      </div>

      {/* Nav pill, bottom-centered on phones and top-centered on desktop */}
      <nav
        aria-label="Primary"
        className="fixed z-[900] left-1/2 -translate-x-1/2 bottom-[calc(14px+env(safe-area-inset-bottom))] md:bottom-auto md:top-12 max-w-[calc(100vw-24px)]"
      >
        <div ref={pillRef} className="relative flex bg-paper brutal p-1 md:p-1.5 overflow-x-auto no-scrollbar">
          <span
            aria-hidden
            className="absolute top-1 bottom-1 md:top-1.5 md:bottom-1.5 bg-ink transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ left: indicator.left, width: indicator.width }}
          />
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              ref={(el) => {
                itemRefs.current[item.id] = el;
              }}
              onClick={() => scrollToId(item.id)}
              aria-current={active === item.id ? 'true' : undefined}
              className={`relative z-10 shrink-0 px-2.5 md:px-5 py-2 text-[10px] md:text-xs font-extrabold uppercase tracking-[0.1em] transition-colors duration-300 ${
                active === item.id ? 'text-paper' : 'text-navy hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Progress tracker */}
      <div className="fixed z-[900] right-3 top-[calc(40px+env(safe-area-inset-top))] md:top-auto md:right-8 md:bottom-8 pointer-events-none">
        <div className="bg-paper brutal-sm px-2 py-1 md:px-3 md:py-2 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-navy">
          <div className="flex items-baseline gap-2">
            You've seen <span className="text-ink text-xs md:text-base font-bold tabular-nums">{seen}%</span>
          </div>
          <div className="hidden md:block mt-1 h-1.5 w-full border border-navy">
            <div className="h-full bg-ink transition-[width] duration-200" style={{ width: `${seen}%` }} />
          </div>
          <div className="hidden md:block mt-1 opacity-60 tabular-nums">{time} IST</div>
        </div>
      </div>
    </>
  );
}
