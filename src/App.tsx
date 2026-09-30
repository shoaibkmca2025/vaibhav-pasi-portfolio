/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { MotionConfig } from 'motion/react';
import { Footer } from './components/Footer';
import CustomCursor from './components/CustomCursor';
import { BlogIndex } from './components/Blog';
import BlogPost from './components/BlogPost';
import BlogHeader from './components/BlogHeader';
import ScrollProgress from './components/ScrollProgress';
import NotebookNav from './components/notebook/NotebookNav';
import NotebookHero from './components/notebook/NotebookHero';
import Origin from './components/notebook/Origin';
import ProjectDeck from './components/notebook/ProjectDeck';
import MetroRoute from './components/notebook/MetroRoute';
import Visuals from './components/notebook/Visuals';
import Notes from './components/notebook/Notes';
import ContactEnd from './components/notebook/ContactEnd';
import CaseModal from './components/notebook/CaseModal';
import type { CaseFile } from './components/notebook/data';
import { useRoute } from './router';
import { applySeo, getSeo } from './seo';
import { SPLASH_DONE_EVENT } from './splash';

// `initialPath` is passed when prerendering at build time; in the browser the URL is used
export default function App({ initialPath }: { initialPath?: string }) {
  const [openCase, setOpenCase] = useState<CaseFile | null>(null);
  const route = useRoute(initialPath);
  const routeKey = route.page === 'post' ? `post:${route.slug}` : route.page;
  const previousRoute = useRef(routeKey);
  // Bumped when the intro splash lifts, remounting the hero so its entrance plays in view
  const [heroKey, setHeroKey] = useState(0);

  useEffect(() => {
    const replayHero = () => setHeroKey((k) => k + 1);
    window.addEventListener(SPLASH_DONE_EVENT, replayHero);
    return () => window.removeEventListener(SPLASH_DONE_EVENT, replayHero);
  }, []);

  useEffect(() => {
    if (previousRoute.current === routeKey) return;
    previousRoute.current = routeKey;
    applySeo(getSeo(window.location.pathname));
    if (route.page !== 'home') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      // Back on the home page: the target section only exists after this render
      const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [routeKey]);

  const isHome = route.page === 'home';

  return (
    <MotionConfig reducedMotion="user">
      {isHome ? (
        <div className="nb-root min-h-screen overflow-x-clip">
          <CustomCursor tone="ink" />
          <NotebookNav />
          <main>
            <NotebookHero key={heroKey} />
            <Origin />
            <ProjectDeck onOpen={setOpenCase} />
            <MetroRoute onOpen={setOpenCase} />
            <Visuals />
            <Notes />
            <ContactEnd />
          </main>
          <CaseModal file={openCase} onClose={() => setOpenCase(null)} />
        </div>
      ) : (
        <div className="min-h-screen bg-brand-black text-white font-sans selection:bg-brand-yellow selection:text-brand-black overflow-x-hidden">
          <div className="noise" />
          <CustomCursor />
          {route.page === 'post' ? (
            <BlogPost key={route.slug} slug={route.slug} />
          ) : (
            <>
              <ScrollProgress />
              <BlogHeader backHref="/" backLabel="Home" />
              <BlogIndex />
            </>
          )}
          <Footer />
        </div>
      )}
    </MotionConfig>
  );
}
