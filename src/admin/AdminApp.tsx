import { useCallback, useEffect, useState } from 'react';
import { ExternalLink, LogOut } from 'lucide-react';
import { api, setUnauthorizedHandler, type Session } from './api';
import Login from './Login';
import PostList from './PostList';
import PostEditor from './PostEditor';
import { Button, Notice, Spinner } from './ui';
import { goTo } from './nav';
import ThemeToggle from '../components/ThemeToggle';
import GalleryManager from './GalleryManager';

export interface DoneInfo {
  message: string;
  // Published article to watch until it appears on the live site
  watchSlug?: string;
}

// After publishing, checks the live site every 8s until the new article responds (max ~4 min)
function LiveNotice({ info }: { info: DoneInfo }) {
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!info.watchSlug) return;
    let tries = 0;
    let timer = 0;
    const check = async () => {
      tries += 1;
      const res = await fetch(`/blog/${info.watchSlug}`, { method: 'HEAD', cache: 'no-store' }).catch(() => null);
      if (res?.ok) return setLive(true);
      if (tries < 30) timer = window.setTimeout(check, 8000);
    };
    timer = window.setTimeout(check, 8000);
    return () => window.clearTimeout(timer);
  }, [info.watchSlug]);

  return (
    <Notice tone="success">
      {info.message}{' '}
      {info.watchSlug &&
        (live ? (
          <a href={`/blog/${info.watchSlug}`} target="_blank" rel="noopener" className="font-bold underline underline-offset-4">
            Live ✓ View article
          </a>
        ) : (
          <span className="text-green-200/80">Going live… usually about a minute.</span>
        ))}
    </Notice>
  );
}

// Screens are kept in the URL hash so refreshing keeps your place:
//   #/            article list
//   #/new         new article
//   #/edit/<slug> edit an article
//   #/gallery     Instagram gallery
type View = { name: 'list' } | { name: 'new' } | { name: 'edit'; slug: string } | { name: 'gallery' };

function readView(): View {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash === '/new') return { name: 'new' };
  if (hash === '/gallery') return { name: 'gallery' };
  const edit = hash.match(/^\/edit\/([a-z0-9-]+)$/);
  if (edit) return { name: 'edit', slug: edit[1] };
  return { name: 'list' };
}

export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionError, setSessionError] = useState('');
  const [view, setView] = useState<View>(readView);
  const [notice, setNotice] = useState<DoneInfo | null>(null);

  const loadSession = useCallback(() => {
    setSessionError('');
    api
      .session()
      .then(setSession)
      .catch((e: Error) => setSessionError(e.message));
  }, []);

  useEffect(() => {
    loadSession();
    setUnauthorizedHandler(() => setSession((s) => (s ? { ...s, authenticated: false } : s)));
    const onHash = () => setView(readView());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [loadSession]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (view.name !== 'list') setNotice(null);
  }, [view]);

  const signOut = async () => {
    await api.logout().catch(() => {});
    setSession((s) => (s ? { ...s, authenticated: false } : s));
  };

  if (sessionError) {
    return (
      <main className="min-h-svh grid place-items-center p-6">
        <div className="max-w-sm w-full space-y-4">
          <Notice tone="error">{sessionError}</Notice>
          <Button onClick={loadSession}>Try again</Button>
        </div>
      </main>
    );
  }

  if (!session) return <Spinner label="Loading dashboard…" />;

  if (!session.authenticated) {
    return <Login setup={session.setup} onSignedIn={() => setSession({ ...session, authenticated: true })} />;
  }

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-black/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
          <a href="#/" className="flex items-baseline gap-3 min-h-11 items-center">
            <span className="text-lg font-bold tracking-tighter uppercase italic">Vaibhav Pasi</span>
            <span className="hidden sm:inline text-xs font-bold tracking-[0.2em] uppercase text-gray-500">Dashboard</span>
          </a>
          <nav className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <a
              href="/blog"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 min-h-11 px-3 sm:px-4 rounded-full text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <ExternalLink className="w-4 h-4" aria-hidden />
              <span className="hidden sm:inline">View blog</span>
              <span className="sm:hidden">Blog</span>
            </a>
            <Button variant="ghost" onClick={signOut}>
              <LogOut className="w-4 h-4" aria-hidden /> <span className="hidden sm:inline">Sign out</span>
            </Button>
          </nav>
        </div>

        {/* Section tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav aria-label="Dashboard sections" className="flex gap-1 -mb-px">
            {[
              { href: '#/', label: 'Articles', active: view.name !== 'gallery' },
              { href: '#/gallery', label: 'Gallery', active: view.name === 'gallery' },
            ].map((tab) => (
              <a
                key={tab.href}
                href={tab.href}
                aria-current={tab.active ? 'page' : undefined}
                className={`inline-flex items-center min-h-11 px-4 border-b-2 text-sm font-semibold transition-colors ${
                  tab.active ? 'border-accent text-white' : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {!session.setup.github && (
          <div className="mb-6">
            <Notice tone="warning">
              <strong>Publishing isn't connected yet.</strong> Add a <code>GITHUB_TOKEN</code> in Vercel → Settings →
              Environment Variables (see the README), then redeploy. Until then, articles can't be loaded or saved.
            </Notice>
          </div>
        )}
        {notice && view.name === 'list' && (
          <div className="mb-6">
            <div key={notice.watchSlug ?? notice.message}>
              <LiveNotice info={notice} />
            </div>
          </div>
        )}

        {view.name === 'list' && <PostList />}
        {view.name === 'gallery' && <GalleryManager />}
        {view.name === 'new' && <PostEditor key="new" onDone={(info) => { setNotice(info); goTo('/'); }} />}
        {view.name === 'edit' && (
          <PostEditor key={view.slug} slug={view.slug} onDone={(info) => { setNotice(info); goTo('/'); }} />
        )}
      </main>
    </div>
  );
}
