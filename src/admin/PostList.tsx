import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, FileText, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { api, type PostSummary } from './api';
import { goTo } from './nav';
import { Button, ConfirmDialog, Notice, Spinner, inputClass } from './ui';

type Filter = 'all' | 'published' | 'drafts';

const formatDate = (date: string) => {
  const d = new Date(`${date}T00:00:00`);
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Status shown with a word, not just a colour
function Status({ draft }: { draft: boolean }) {
  return draft ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-xs font-bold text-gray-300">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" aria-hidden /> Draft
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-400/10 px-2.5 py-1 text-xs font-bold text-green-300">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400" aria-hidden /> Published
    </span>
  );
}

export default function PostList() {
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [toDelete, setToDelete] = useState<PostSummary | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setError('');
    api
      .listPosts()
      .then((r) => setPosts(r.posts))
      .catch((e: Error) => setError(e.message));
  };
  useEffect(load, []);

  const counts = useMemo(
    () => ({
      all: posts?.length ?? 0,
      published: posts?.filter((p) => !p.draft).length ?? 0,
      drafts: posts?.filter((p) => p.draft).length ?? 0,
    }),
    [posts],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (posts ?? []).filter(
      (p) =>
        (filter === 'all' || (filter === 'drafts' ? p.draft : !p.draft)) &&
        (!q || [p.title, p.excerpt, p.category, ...p.tags].some((s) => s.toLowerCase().includes(q))),
    );
  }, [posts, query, filter]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.deletePost(toDelete.slug, toDelete.sha);
      setPosts((list) => list?.filter((p) => p.slug !== toDelete.slug) ?? null);
      setToDelete(null);
    } catch (e) {
      setError((e as Error).message);
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Articles</h1>
          <p className="mt-1 text-gray-400">Write, edit and publish posts for your blog.</p>
        </div>
        <Button variant="primary" onClick={() => goTo('/new')}>
          <Plus className="w-4 h-4" aria-hidden /> New article
        </Button>
      </div>

      {error && (
        <div className="mb-6 space-y-3">
          <Notice tone="error">{error}</Notice>
          <Button onClick={load}>Try again</Button>
        </div>
      )}

      {!posts && !error && <Spinner label="Loading articles…" />}

      {posts && (
        <>
          <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
            <div role="tablist" aria-label="Filter articles" className="flex gap-1 p-1 rounded-full bg-white/[0.04] border border-white/10 self-start">
              {(['all', 'published', 'drafts'] as Filter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={`min-h-10 px-4 rounded-full text-sm font-semibold capitalize transition-colors ${
                    filter === f ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {f} <span className={filter === f ? 'text-black/60' : 'text-gray-600'}>{counts[f]}</span>
                </button>
              ))}
            </div>
            <label className="relative md:ml-auto md:w-80">
              <span className="sr-only">Search articles</span>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                className={`${inputClass} pl-11 rounded-full`}
              />
            </label>
          </div>

          {visible.length === 0 ? (
            <div className="flex flex-col items-center text-center py-20 rounded-2xl border border-dashed border-white/15">
              <FileText className="w-8 h-8 text-gray-500 mb-4" aria-hidden />
              <p className="text-lg font-bold">{posts.length ? 'No articles match.' : 'No articles yet.'}</p>
              <p className="text-gray-500 mt-1 mb-6">
                {posts.length ? 'Try another search or filter.' : 'Your first article is a click away.'}
              </p>
              {!posts.length && (
                <Button variant="primary" onClick={() => goTo('/new')}>
                  <Plus className="w-4 h-4" aria-hidden /> Write your first article
                </Button>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              {visible.map((post) => (
                <li key={post.slug} className="group flex items-center gap-4 p-4 sm:p-5 hover:bg-white/[0.03] transition-colors">
                  <div className="hidden sm:block w-24 aspect-[16/10] shrink-0 rounded-lg overflow-hidden bg-white/[0.05] border border-white/10">
                    {post.cover && <img src={post.cover} alt="" loading="lazy" className="w-full h-full object-cover" />}
                  </div>
                  <a href={`#/edit/${post.slug}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Status draft={post.draft} />
                      {post.featured && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-yellow">
                          <Star className="w-3.5 h-3.5 fill-current" aria-hidden /> Featured
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-white group-hover:text-brand-yellow transition-colors truncate">{post.title || post.slug}</p>
                    <p className="text-sm text-gray-500 mt-0.5 truncate">
                      {post.category} · {formatDate(post.date)} · {post.words.toLocaleString()} words
                    </p>
                  </a>
                  <div className="flex items-center gap-1 shrink-0">
                    {!post.draft && (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener"
                        aria-label={`View "${post.title}" on the website`}
                        className="hidden sm:grid w-11 h-11 place-items-center rounded-full text-gray-400 hover:text-white hover:bg-white/[0.06]"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <a
                      href={`#/edit/${post.slug}`}
                      aria-label={`Edit "${post.title}"`}
                      className="grid w-11 h-11 place-items-center rounded-full text-gray-400 hover:text-white hover:bg-white/[0.06]"
                    >
                      <Pencil className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setToDelete(post)}
                      aria-label={`Delete "${post.title}"`}
                      className="grid w-11 h-11 place-items-center rounded-full text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this article?"
        message={
          <>
            <strong className="text-white">"{toDelete?.title}"</strong> will be removed from your website within about a
            minute. Its history stays in GitHub, so it can be restored if needed.
          </>
        }
        confirmLabel="Delete article"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
