import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Clock, PenLine, Search } from 'lucide-react';
import { posts, categories, formatDate, type Post } from '../blog/posts';
import { responsiveImage } from '../image';
import { onLinkClick } from '../router';

const PAGE_SIZE = 9;

function PostMeta({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-3 text-[0.6875rem] font-bold tracking-widest uppercase text-gray-500">
      <span>{formatDate(post.date)}</span>
      <span className="w-1 h-1 rounded-full bg-gray-700" />
      <span className="inline-flex items-center gap-1.5">
        <Clock className="w-3 h-3" />
        {post.readingMinutes} min read
      </span>
    </div>
  );
}

// `key` is listed because this project has no @types/react, so TS doesn't know about it
function PostCard({ post, index }: { post: Post; index: number; key?: string }) {
  return (
    <motion.a
      layout
      href={`/blog/${post.slug}`} onClick={onLinkClick}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col rounded-[1.5rem] md:rounded-[2rem] bg-brand-dark-gray/30 border border-white/5 hover:border-accent/30 overflow-hidden transition-colors duration-500"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-muted">
        {post.cover && (
          <img
            {...responsiveImage(post.cover, '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw')}
            alt=""
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="theme-dark absolute top-4 left-4 text-[0.6875rem] font-bold tracking-widest uppercase text-accent bg-black/60 backdrop-blur-md border border-accent/20 px-3 py-1 rounded-full">
          {post.category}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-6 md:p-7">
        <PostMeta post={post} />
        <h3 className="mt-4 text-xl md:text-2xl font-bold tracking-tight leading-snug group-hover:text-accent transition-colors duration-300">
          {post.title}
        </h3>
        <p className="mt-3 text-sm text-gray-400 font-normal leading-relaxed line-clamp-3">{post.excerpt}</p>
        <span className="mt-auto pt-6 inline-flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.3em] uppercase text-gray-300 group-hover:text-accent group-hover:gap-3 transition-all">
          Read article <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.a>
  );
}

function FeaturedPost({ post }: { post: Post }) {
  return (
    <motion.a
      href={`/blog/${post.slug}`} onClick={onLinkClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative grid grid-cols-1 lg:grid-cols-2 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-accent/30 bg-brand-dark-gray/30 transition-colors duration-500 mb-6 md:mb-8"
    >
      <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-brand-muted">
        {post.cover && (
          <img
            {...responsiveImage(post.cover, '(min-width: 1024px) 50vw, 100vw')}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      <div className="relative flex flex-col justify-center p-6 sm:p-8 md:p-12">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-yellow/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="flex flex-wrap items-center gap-3 mb-5 md:mb-6">
          <span className="text-[0.6875rem] font-black tracking-widest uppercase text-black bg-brand-yellow px-3 py-1 rounded-full">
            Featured
          </span>
          <span className="text-[0.6875rem] font-bold tracking-widest uppercase text-accent border border-accent/20 px-3 py-1 rounded-full">
            {post.category}
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-[1.05] group-hover:text-accent transition-colors duration-300">
          {post.title}
        </h3>
        <p className="mt-5 text-gray-400 font-normal leading-relaxed md:text-lg line-clamp-3">{post.excerpt}</p>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <PostMeta post={post} />
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-yellow text-black group-hover:rotate-45 transition-transform duration-500">
            <ArrowUpRight className="w-5 h-5" />
          </span>
        </div>
      </div>
    </motion.a>
  );
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center text-center py-16 md:py-20 px-6 rounded-[2rem] border border-dashed border-white/10">
      <PenLine className="w-8 h-8 text-accent mb-4" />
      <p className="text-lg font-bold">{title}</p>
      <p className="text-sm text-gray-400 mt-2">{hint}</p>
    </div>
  );
}

function PostGrid({ items }: { items: Post[] }) {
  return (
    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <AnimatePresence mode="popLayout">
        {items.map((post, idx) => (
          <PostCard key={post.slug} post={post} index={idx} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function featuredPost() {
  return posts.find((p) => p.featured) ?? posts[0];
}

/* ─── Home page preview: featured article + latest three ─── */
export default function Blog() {
  const featured = featuredPost();
  const latest = posts.filter((p) => p !== featured).slice(0, 3);

  return (
    <section className="section-padding bg-brand-black relative overflow-hidden border-t border-white/5">
      <div className="absolute top-1/3 -left-32 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-brand-yellow/5 blur-[80px] md:blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow font-bold tracking-[0.4em] uppercase text-[0.6875rem] mb-5 block">Insights</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter italic uppercase leading-[0.9] mb-6">
              The <span className="text-gray-500">Journal.</span>
            </h2>
            <p className="text-gray-400 font-normal leading-relaxed md:text-lg">
              Playbooks, experiments and lessons from the front lines of growth marketing, AI and e-commerce.
            </p>
          </div>
          {posts.length > 0 && (
            <a
              href="/blog" onClick={onLinkClick}
              className="group self-start md:self-auto inline-flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.3em] uppercase text-gray-300 hover:text-accent border-b border-white/10 hover:border-accent pb-2 transition-colors"
            >
              All {posts.length} articles
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}
        </div>

        {posts.length === 0 ? (
          <EmptyState title="Fresh articles are on the way." hint="Check back soon." />
        ) : (
          <>
            {featured && <FeaturedPost post={featured} />}
            {latest.length > 0 && <PostGrid items={latest} />}

            <div className="mt-10 md:mt-14 flex justify-center">
              <a href="/blog" onClick={onLinkClick} className="btn-primary rounded-full inline-flex items-center gap-2">
                View all articles <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ─── Full blog page (/blog): search, filters, every article ─── */
export function BlogIndex() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const q = query.trim().toLowerCase();
  const matches = posts.filter(
    (p) =>
      (category === 'All' || p.category === category) &&
      (!q || [p.title, p.excerpt, p.category, ...p.tags].some((s) => s.toLowerCase().includes(q))),
  );

  // The big featured card only makes sense on the unfiltered view
  const featured = category === 'All' && !q ? featuredPost() : undefined;
  const rest = matches.filter((p) => p !== featured);
  const shown = rest.slice(0, visible);

  const resetPaging = () => setVisible(PAGE_SIZE);

  return (
    <main id="main" tabIndex={-1} className="relative overflow-hidden outline-none">
      <div className="absolute top-0 right-0 w-[320px] h-[320px] md:w-[600px] md:h-[600px] bg-brand-yellow/5 blur-[80px] md:blur-[160px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      {/* Page hero */}
      <section className="pt-32 md:pt-44 pb-10 md:pb-16 px-5 sm:px-6 md:px-12 lg:px-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2.5 text-[0.6875rem] font-extrabold tracking-[0.4em] uppercase text-accent px-5 py-2.5 border border-accent/20 bg-brand-yellow/5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
            </span>
            <h1 className="text-5xl min-[400px]:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter italic uppercase leading-[0.85]">
              The <span className="text-accent glow-yellow">Journal.</span>
            </h1>
            <p className="mt-6 md:mt-8 text-gray-400 font-normal text-base md:text-xl leading-relaxed max-w-2xl">
              Playbooks, experiments and hard-won lessons on growth marketing, AI, e-commerce and building brands that
              scale.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-5 sm:px-6 md:px-12 lg:px-24 pb-20 md:pb-32 relative z-10">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <EmptyState title="Fresh articles are on the way." hint="Check back soon." />
          ) : (
            <>
              {/* Search + filters */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 mb-8 md:mb-12">
                <label className="relative lg:w-80 shrink-0">
                  <span className="sr-only">Search articles</span>
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      resetPaging();
                    }}
                    placeholder="Search articles…"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-accent/50 rounded-full pl-12 pr-5 py-3.5 text-base md:text-sm text-white placeholder:text-gray-500 outline-none transition-colors"
                  />
                </label>

                {categories.length > 1 && (
                  <div
                    role="tablist"
                    aria-label="Filter articles by category"
                    className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0"
                  >
                    {['All', ...categories].map((c) => (
                      <button
                        key={c}
                        type="button"
                        role="tab"
                        aria-selected={category === c}
                        onClick={() => {
                          setCategory(c);
                          resetPaging();
                        }}
                        className={`relative shrink-0 min-h-11 px-5 py-2.5 rounded-full text-[0.6875rem] font-bold tracking-widest uppercase border transition-colors ${
                          category === c
                            ? 'text-black border-accent'
                            : 'text-gray-400 border-white/10 hover:text-white hover:border-white/30'
                        }`}
                      >
                        {category === c && (
                          <motion.span
                            layoutId="blog-filter"
                            className="absolute inset-0 rounded-full bg-brand-yellow"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                        <span className="relative">{c}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {featured && <FeaturedPost post={featured} />}

              {matches.length === 0 ? (
                <EmptyState title="No articles match that search." hint="Try a different keyword or category." />
              ) : (
                <PostGrid items={shown} />
              )}

              {visible < rest.length && (
                <div className="mt-10 md:mt-14 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="btn-secondary rounded-full"
                  >
                    Load more articles
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
