import { useEffect, useState } from 'react';
import { Moon, Sun, SunMoon } from 'lucide-react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'vp-theme';
const META_COLORS: Record<Theme, string> = { light: '#f6f6f3', dark: '#050505' };

// The theme on screen: an explicit choice (html[data-theme]) or the device setting
function currentTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === 'light' || chosen === 'dark') return chosen;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', META_COLORS[theme]));
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage unavailable (private mode): the choice lasts until the page is closed
  }
}

// Sun/moon button. By default the site follows the device's light/dark setting;
// pressing this switches theme and remembers the choice on this device.
export default function ThemeToggle({ className = '' }: { className?: string }) {
  // Unknown until mounted, so the prerendered HTML and the first render match
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(currentTheme());
    // Keep the icon right if the device switches appearance (e.g. automatic at sunset)
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const sync = () => setTheme(currentTheme());
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const next: Theme = theme === 'light' ? 'dark' : 'light';
  const Icon = theme === null ? SunMoon : theme === 'light' ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next);
        setTheme(next);
      }}
      aria-label={theme ? `Switch to ${next} mode` : 'Switch colour theme'}
      title={theme ? `Switch to ${next} mode` : 'Switch colour theme'}
      className={`grid w-11 h-11 shrink-0 place-items-center rounded-full text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors ${className}`}
    >
      <Icon className="w-[1.15rem] h-[1.15rem]" aria-hidden />
    </button>
  );
}
