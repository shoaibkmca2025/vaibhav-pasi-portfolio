import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from 'react';

export type Route = { page: 'home' } | { page: 'blog' } | { page: 'post'; slug: string };

// Real paths so every page is indexable: /, /blog, /blog/<slug>
export function parseRoute(pathname: string): Route {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/blog') return { page: 'blog' };
  const match = path.match(/^\/blog\/([^/]+)$/);
  if (match) return { page: 'post', slug: decodeURIComponent(match[1]) };
  return { page: 'home' };
}

const NAVIGATE_EVENT = 'app:navigate';

export function navigate(href: string) {
  window.history.pushState({}, '', href);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}

// `initialPath` lets the build-time prerender render any page without a browser
export function useRoute(initialPath?: string) {
  const [path, setPath] = useState(() => initialPath ?? window.location.pathname);

  useEffect(() => {
    // Old hash links (#/blog/...) from before the switch to real paths
    if (window.location.hash.startsWith('#/blog')) {
      window.history.replaceState({}, '', window.location.hash.slice(1));
    }
    const sync = () => setPath(window.location.pathname);
    sync();
    window.addEventListener('popstate', sync);
    window.addEventListener(NAVIGATE_EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(NAVIGATE_EVENT, sync);
    };
  }, []);

  return parseRoute(path);
}

// Click handler for internal <a> tags: switches pages without a full reload,
// while the href stays a real link for crawlers, new tabs and no-JS visitors
export function onLinkClick(e: MouseEvent<HTMLAnchorElement>) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const url = new URL(e.currentTarget.href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
  e.preventDefault();
  navigate(url.pathname + url.hash);
}

export function Link({ onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        onLinkClick(e);
      }}
    />
  );
}
