import { getServiceByPath } from './content/services';
import { useEffect, useState, type MouseEvent } from 'react';

// Standalone pages, in the order the nav and the "next page" links walk through them
// `nav: false` pages are real routes that aren't in the top menu (linked from elsewhere).
// Paths stay as they were (/work, /blog) so existing links keep working; only the labels changed.
export const sitePages = [
  { key: 'about', path: '/about', label: 'About', nav: true },
  { key: 'services', path: '/services', label: 'Services', nav: true },
  { key: 'work', path: '/work', label: 'Portfolio', nav: true },
  { key: 'client-wins', path: '/client-wins', label: 'Client Wins', nav: false },
  { key: 'blog', path: '/blog', label: 'Insights', nav: true },
  { key: 'contact', path: '/contact', label: 'Contact', nav: true },
  { key: 'team', path: '/team', label: '4AM Team', nav: true },
  { key: 'privacy', path: '/privacy', label: 'Privacy Policy', nav: false },
  { key: 'terms', path: '/terms', label: 'Terms of Service', nav: false },
] as const;

export const navPages = sitePages.filter((p) => p.nav);

// Old addresses that now live elsewhere. The server sends a 301 for these (vercel.json);
// this map keeps in-app navigation and the dev server consistent with it.
export const redirects: Record<string, string> = {
  '/faces-behind-4am-global-media': '/team',
};

export type PageKey = Exclude<(typeof sitePages)[number]['key'], 'blog'>;

export type Route =
  | { page: 'home' }
  | { page: 'blog' }
  | { page: 'post'; slug: string }
  | { page: 'service'; slug: string }
  | { page: PageKey }
  | { page: 'not-found' };

// Real paths so every page is indexable: /, /about, /services, /services/<slug>, ..., /blog, /blog/<slug>
export function parseRoute(pathname: string): Route {
  const trimmed = pathname.replace(/\/+$/, '') || '/';
  const path = redirects[trimmed] ?? trimmed;
  if (path === '/') return { page: 'home' };
  if (path === '/blog') return { page: 'blog' };
  const standalone = sitePages.find((p) => p.path === path && p.key !== 'blog');
  if (standalone) return { page: standalone.key as PageKey };
  const service = path.match(/^\/services\/([^/]+)$/);
  if (service) return { page: 'service', slug: decodeURIComponent(service[1]) };
  // Services with their own top-level address, e.g. /linkedin-marketing-services
  const custom = getServiceByPath(path);
  if (custom) return { page: 'service', slug: custom.slug };
  const match = path.match(/^\/blog\/([^/]+)$/);
  if (match) return { page: 'post', slug: decodeURIComponent(match[1]) };
  return { page: 'not-found' };
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
    const sync = () => {
      const old = window.location.pathname.replace(/\/+$/, '');
      if (redirects[old]) window.history.replaceState({}, '', redirects[old] + window.location.hash);
      setPath(window.location.pathname);
    };
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
  navigate(url.pathname + url.search + url.hash);
}
