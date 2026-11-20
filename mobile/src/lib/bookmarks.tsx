// Saved articles, on the device. Readers are anonymous, so bookmarks need no account.
// A copy of each article's summary is kept, so the Saved tab works offline.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ArticleSummary } from './feed';
import { KEYS, readJson, writeJson } from './storage';

export interface Bookmark extends ArticleSummary {
  savedAt: string;
}

interface BookmarksValue {
  bookmarks: Bookmark[];
  isSaved: (slug: string) => boolean;
  toggle: (article: ArticleSummary) => boolean; // returns the new saved state
}

const BookmarksContext = createContext<BookmarksValue>({ bookmarks: [], isSaved: () => false, toggle: () => false });

const summaryOf = (a: ArticleSummary): ArticleSummary => ({
  slug: a.slug,
  url: a.url,
  title: a.title,
  date: a.date,
  category: a.category,
  excerpt: a.excerpt,
  cover: a.cover,
  tags: a.tags,
  featured: a.featured,
  readingMinutes: a.readingMinutes,
  wordCount: a.wordCount,
});

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    readJson<Bookmark[]>(KEYS.bookmarks, []).then(setBookmarks);
  }, []);

  const isSaved = useCallback((slug: string) => bookmarks.some((b) => b.slug === slug), [bookmarks]);

  const toggle = useCallback(
    (article: ArticleSummary) => {
      const saved = bookmarks.some((b) => b.slug === article.slug);
      const next = saved
        ? bookmarks.filter((b) => b.slug !== article.slug)
        : [{ ...summaryOf(article), savedAt: new Date().toISOString() }, ...bookmarks];
      setBookmarks(next);
      writeJson(KEYS.bookmarks, next);
      return !saved;
    },
    [bookmarks],
  );

  const value = useMemo(() => ({ bookmarks, isSaved, toggle }), [bookmarks, isSaved, toggle]);
  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
}

export const useBookmarks = () => useContext(BookmarksContext);
