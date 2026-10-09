import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Check, Clock, Linkedin, Link2, Share2, Twitter } from 'lucide-react';
import { posts, getPost, formatDate } from '../blog/posts';
import { responsiveImage } from '../image';
import { onLinkClick } from '../router';
import { contactHref } from '../contact';
import { absoluteUrl, person } from '../site';
import ScrollProgress from './ScrollProgress';
import BlogHeader from './BlogHeader';

export default function BlogPost({ slug }: { slug: string; key?: string }) {
  const post = getPost(slug);
  const [copied, setCopied] = useState(false);

  if (!post) {
    return (
      <>
        <BlogHeader backHref="/blog" backLabel="All articles" />
        <main id="main" tabIndex={-1} className="outline-none min-h-svh flex flex-col items-center justify-center text-center px-5">
          <p className="eyebrow font-bold tracking-[0.4em] uppercase text-[0.6875rem] mb-4">404</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">Article not found.</h1>
          <a href="/blog" onClick={onLinkClick} className="btn-primary rounded-full">Back to the journal</a>
        </main>
      </>
    );
  }

  const url = absoluteUrl(`/blog/${post.slug}`);
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.excerpt, url });
      } catch {
        // User dismissed the share sheet
      }
      return;
    }
    await copyLink();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context)
    }
  };

  return (
    <>
      <ScrollProgress />

      <BlogHeader
        backHref="/blog"
        backLabel="All articles"
        action={
          <button
            type="button"
            onClick={share}
            aria-label="Share this article"
            className="p-3 -m-3 text-gray-300 hover:text-accent transition-colors"
          >
            {copied ? <Check className="w-5 h-5 text-accent" /> : <Share2 className="w-5 h-5" />}
          </button>
        }
      />

      <main id="main" tabIndex={-1} className="outline-none">
        <article className="pt-28 md:pt-40 pb-16 md:pb-24">
          {/* Title block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto px-5 sm:px-6 text-center"
          >
            <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
              <ol className="flex items-center justify-center gap-2 text-[0.6875rem] font-bold tracking-widest uppercase text-gray-500">
                <li>
                  <a href="/" onClick={onLinkClick} className="hover:text-accent transition-colors">Home</a>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <a href="/blog" onClick={onLinkClick} className="hover:text-accent transition-colors">Blog</a>
                </li>
                <li aria-hidden>/</li>
                <li className="text-accent border border-accent/20 bg-brand-yellow/5 px-3 py-1 rounded-full">
                  {post.category}
                </li>
              </ol>
            </nav>
            <h1 className="text-3xl min-[400px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.02]">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-6 md:mt-8 text-gray-400 font-normal text-base md:text-xl leading-relaxed max-w-2xl mx-auto">
                {post.excerpt}
              </p>
            )}
            <div className="mt-8 md:mt-10 flex items-center justify-center gap-4">
              <img
                src="/vaibhav-pasi.jpg"
                alt={person.name}
                width={44}
                height={44}
                className="w-11 h-11 rounded-full object-cover border border-white/10"
              />
              <div className="text-left">
                <a href="/about" onClick={onLinkClick} rel="author" className="text-sm font-bold hover:text-accent transition-colors">
                  {person.name}
                </a>
                <div className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-widest uppercase text-gray-500 mt-0.5">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span className="w-1 h-1 rounded-full bg-gray-700" />
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readingMinutes} min read
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cover */}
          {post.cover && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-6xl mx-auto px-5 sm:px-6 mt-10 md:mt-16"
            >
              <div className="aspect-[16/10] md:aspect-[21/9] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/10">
                <img
                  {...responsiveImage(post.cover, '(min-width: 1152px) 1104px, 100vw')}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          )}

          {/* Body */}
          <div
            className="prose-blog max-w-2xl mx-auto px-5 sm:px-6 mt-12 md:mt-20"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {/* Tags + share */}
          <div className="max-w-2xl mx-auto px-5 sm:px-6 mt-12 md:mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[0.6875rem] font-bold tracking-wider text-gray-400 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[0.6875rem] font-bold tracking-widest uppercase text-gray-500 mr-2">Share</span>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:bg-brand-yellow hover:text-black hover:border-accent transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:bg-brand-yellow hover:text-black hover:border-accent transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={copyLink}
                aria-label="Copy link"
                className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:bg-brand-yellow hover:text-black hover:border-accent transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Author box: tells readers (and search/AI engines) who wrote this and why to trust it */}
          <aside className="max-w-2xl mx-auto px-5 sm:px-6 mt-10">
            <div className="flex flex-col sm:flex-row gap-5 p-6 md:p-8 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent">
              <img
                src="/vaibhav-pasi.jpg"
                alt={person.name}
                width={72}
                height={72}
                loading="lazy"
                className="w-[72px] h-[72px] rounded-2xl object-cover border border-white/10 shrink-0"
              />
              <div>
                <p className="text-[0.6875rem] font-bold tracking-[0.3em] uppercase text-accent mb-2">Written by</p>
                <p className="text-lg font-bold">{person.name}</p>
                <p className="mt-2 text-sm text-gray-400 font-normal leading-relaxed">
                  Co-Founder of {person.organization.name}. Digital marketing strategist, software developer and AI
                  consultant helping startups, SMEs and enterprises scale with data-driven growth, AI automation and
                  marketplace onboarding.
                </p>
                <a
                  href="/about"
                  onClick={onLinkClick}
                  className="mt-4 inline-flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.3em] uppercase text-gray-300 hover:text-accent transition-colors"
                >
                  More about Vaibhav <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </aside>
        </article>

        {/* Keep reading */}
        {more.length > 0 && (
          <section className="section-padding border-t border-white/5 bg-brand-dark-gray/20">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-10 md:mb-14">
                Keep <span className="text-accent">Reading.</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {more.map((p) => (
                  <a
                    key={p.slug}
                    href={`/blog/${p.slug}`} onClick={onLinkClick}
                    className="group flex gap-4 sm:gap-5 p-3 sm:p-4 rounded-[1.5rem] border border-white/5 bg-brand-black hover:border-accent/30 transition-colors"
                  >
                    {p.cover && (
                      <div className="w-24 sm:w-32 aspect-square shrink-0 rounded-xl overflow-hidden bg-brand-muted">
                        <img
                          {...responsiveImage(p.cover, '128px')}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <div className="flex flex-col justify-center min-w-0">
                      <span className="text-[0.6875rem] font-bold tracking-widest uppercase text-accent mb-2">{p.category}</span>
                      <h3 className="font-bold leading-snug line-clamp-3 group-hover:text-accent transition-colors">{p.title}</h3>
                      <span className="mt-2 text-[0.6875rem] font-bold tracking-widest uppercase text-gray-500">
                        {p.readingMinutes} min read
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter mb-6">Want results like these?</h2>
            <p className="text-gray-400 font-normal mb-10 max-w-lg mx-auto">
              Let's talk about what a growth system could look like for your brand.
            </p>
            <a href={contactHref} className="btn-primary rounded-full inline-flex items-center gap-2">
              Start a project <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
