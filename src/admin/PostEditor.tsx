import { useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { marked } from 'marked';
import {
  ArrowLeft,
  Bold,
  Heading2,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import { CATEGORIES, readingMinutes, slugify, validatePost, type PostMeta } from '../../shared/blog';
import { api, ApiError } from './api';
import type { DoneInfo } from './AdminApp';
import { uploadImage } from './image';
import { goTo } from './nav';
import { Button, Field, Notice, Panel, Spinner, Toggle, inputClass } from './ui';

const AUTOSAVE_KEY = 'vp-dashboard-new-article';
const SITE_HOST = 'vaibhavpasi.online';

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const emptyMeta = (): PostMeta => ({
  title: '',
  date: today(),
  category: CATEGORIES[0],
  excerpt: '',
  cover: '',
  tags: [],
  featured: false,
  draft: false,
});

type FieldErrors = Partial<Record<keyof PostMeta | 'body' | 'slug', string>>;

// localStorage can be unavailable (private mode); autosave is a convenience, never required
const storage = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(AUTOSAVE_KEY) ?? 'null') as { meta: PostMeta; body: string; slug: string } | null;
    } catch {
      return null;
    }
  },
  set(value: unknown) {
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  },
  clear() {
    try {
      localStorage.removeItem(AUTOSAVE_KEY);
    } catch {
      /* ignore */
    }
  },
};

// `key` is listed because this project has no @types/react, so TypeScript doesn't know about it
export default function PostEditor({ slug: editSlug, onDone }: { slug?: string; onDone: (info: DoneInfo) => void; key?: string }) {
  const isNew = !editSlug;
  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState('');
  const [meta, setMeta] = useState<PostMeta>(emptyMeta);
  const [body, setBody] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [sha, setSha] = useState<string | undefined>();
  const [wasPublished, setWasPublished] = useState(false);
  const [baseline, setBaseline] = useState('');
  const [restored, setRestored] = useState(false);

  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [saving, setSaving] = useState<'draft' | 'publish' | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState<'cover' | 'body' | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [tagDraft, setTagDraft] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bodyImageInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);

  const snapshot = (m: PostMeta, b: string, s: string) => JSON.stringify([m, b, s]);
  const dirty = baseline !== '' && snapshot(meta, body, slug) !== baseline;

  // Load the article (edit) or any unsaved new article from this browser (new)
  useEffect(() => {
    if (isNew) {
      const saved = storage.get();
      if (saved && (saved.meta.title || saved.body)) {
        setMeta(saved.meta);
        setBody(saved.body);
        setSlug(saved.slug);
        setSlugTouched(Boolean(saved.slug) && saved.slug !== slugify(saved.meta.title));
        setRestored(true);
      }
      setBaseline(snapshot(emptyMeta(), '', ''));
      return;
    }
    api
      .getPost(editSlug!)
      .then(({ post }) => {
        setMeta(post.meta);
        setBody(post.body.trimStart());
        setSlug(post.slug);
        setSha(post.sha);
        setWasPublished(!post.meta.draft);
        setBaseline(snapshot(post.meta, post.body.trimStart(), post.slug));
      })
      .catch((e: Error) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, [editSlug]);

  // New articles: keep the web address in step with the title until it's edited by hand
  useEffect(() => {
    if (isNew && !slugTouched) setSlug(slugify(meta.title));
  }, [isNew, slugTouched, meta.title]);

  // New articles: autosave to this browser so a closed tab doesn't lose work
  useEffect(() => {
    if (!isNew || !baseline) return;
    const t = window.setTimeout(() => {
      if (meta.title || body) storage.set({ meta, body, slug });
    }, 600);
    return () => window.clearTimeout(t);
  }, [isNew, baseline, meta, body, slug]);

  // Warn before leaving the page with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const update = <K extends keyof PostMeta>(key: K, value: PostMeta[K]) => {
    setMeta((m) => ({ ...m, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const previewHtml = useMemo(() => {
    let html = marked.parse(body || '*Nothing to preview yet.*', { async: false });
    // Freshly uploaded images aren't on the live site until the next deploy: show the local copy
    for (const [url, local] of Object.entries(previews as Record<string, string>)) html = html.split(url).join(local);
    return html;
  }, [body, previews]);

  // ── Markdown toolbar ──
  const edit = (transform: (selected: string) => { text: string; cursorStart?: number; cursorEnd?: number }) => {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const { text, cursorStart, cursorEnd } = transform(body.slice(start, end));
    const next = body.slice(0, start) + text + body.slice(end);
    setBody(next);
    setErrors((e) => ({ ...e, body: undefined }));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + (cursorStart ?? text.length), start + (cursorEnd ?? cursorStart ?? text.length));
    });
  };

  const wrap = (before: string, after: string, placeholder: string) =>
    edit((sel) => {
      const inner = sel || placeholder;
      return { text: before + inner + after, cursorStart: before.length, cursorEnd: before.length + inner.length };
    });

  const prefixLines = (prefix: (i: number) => string, placeholder: string) =>
    edit((sel) => {
      const lines = (sel || placeholder).split('\n');
      const text = lines.map((line, i) => prefix(i) + line.replace(/^(#{1,6} |> |- |\d+\. )/, '')).join('\n');
      return { text: `\n${text}\n`, cursorStart: 1, cursorEnd: text.length + 1 };
    });

  const insertLink = () =>
    edit((sel) => {
      const label = sel || 'link text';
      return { text: `[${label}](https://)`, cursorStart: label.length + 3, cursorEnd: label.length + 11 };
    });

  const onEditorKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.metaKey || e.ctrlKey)) return;
    const key = e.key.toLowerCase();
    const shortcuts: Record<string, () => void> = {
      b: () => wrap('**', '**', 'bold text'),
      i: () => wrap('_', '_', 'italic text'),
      k: insertLink,
    };
    if (shortcuts[key]) {
      e.preventDefault();
      shortcuts[key]();
    }
  };

  // ── Images ──
  const handleUpload = async (file: File | undefined, target: 'cover' | 'body') => {
    if (!file) return;
    setUploading(target);
    setMessage('');
    try {
      const { url, preview } = await uploadImage(file);
      setPreviews((p) => ({ ...p, [url]: preview }));
      if (target === 'cover') update('cover', url);
      else {
        const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
        edit(() => ({ text: `\n![${alt}](${url})\n` }));
      }
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setUploading(null);
    }
  };

  // ── Tags ──
  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/,$/, '').slice(0, 40);
    if (tag && !meta.tags.some((t) => t.toLowerCase() === tag.toLowerCase()) && meta.tags.length < 12) {
      update('tags', [...meta.tags, tag]);
    }
    setTagDraft('');
  };

  const onTagKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagDraft);
    } else if (e.key === 'Backspace' && !tagDraft && meta.tags.length) {
      update('tags', meta.tags.slice(0, -1));
    }
  };

  // ── Save ──
  const save = async (asDraft: boolean) => {
    const next = { ...meta, draft: asDraft, tags: tagDraft.trim() ? [...meta.tags, tagDraft.trim()] : meta.tags };
    const clientErrors: FieldErrors = validatePost(next, body);
    if (isNew && !slug) clientErrors.slug = 'Add a web address.';
    setErrors(clientErrors);
    setMessage('');
    if (Object.keys(clientErrors).length) {
      setMessage('Please fix the highlighted fields.');
      return;
    }

    setSaving(asDraft ? 'draft' : 'publish');
    try {
      const result = await api.savePost({ slug, sha, meta: next, body });
      if (isNew) storage.clear();
      setBaseline(snapshot(next, body, result.slug));
      const url = `/blog/${result.slug}`;
      onDone(
        asDraft
          ? { message: `Saved "${next.title}" as a draft. It's not visible on the website.` }
          : isNew || !wasPublished
            ? { message: `Published "${next.title}" at ${url}.`, watchSlug: result.slug }
            : { message: `Updated "${next.title}". Changes appear on the website in about a minute.` },
      );
    } catch (e) {
      const err = e as ApiError;
      setErrors(err.fields ?? {});
      setMessage(err.message);
      setSaving(null);
    }
  };

  const leave = () => {
    if (dirty && !window.confirm('Leave without saving? Your changes to this article will be lost.')) return;
    if (isNew) storage.clear();
    goTo('/');
  };

  const discardRestored = () => {
    storage.clear();
    setMeta(emptyMeta());
    setBody('');
    setSlug('');
    setSlugTouched(false);
    setRestored(false);
  };

  if (loading) return <Spinner label="Opening article…" />;
  if (loadError) {
    return (
      <div className="max-w-xl space-y-4">
        <Notice tone="error">{loadError}</Notice>
        <Button onClick={() => goTo('/')}>
          <ArrowLeft className="w-4 h-4" aria-hidden /> Back to articles
        </Button>
      </div>
    );
  }

  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  const excerptLength = meta.excerpt.length;
  const coverSrc = meta.cover ? previews[meta.cover] ?? meta.cover : '';

  const toolbar: { label: string; icon: typeof Bold; action: () => void }[] = [
    { label: 'Heading', icon: Heading2, action: () => prefixLines(() => '## ', 'Heading') },
    { label: 'Bold (Ctrl+B)', icon: Bold, action: () => wrap('**', '**', 'bold text') },
    { label: 'Italic (Ctrl+I)', icon: Italic, action: () => wrap('_', '_', 'italic text') },
    { label: 'Link (Ctrl+K)', icon: Link2, action: insertLink },
    { label: 'Quote', icon: Quote, action: () => prefixLines(() => '> ', 'Quote') },
    { label: 'Bulleted list', icon: List, action: () => prefixLines(() => '- ', 'List item') },
    { label: 'Numbered list', icon: ListOrdered, action: () => prefixLines((i) => `${i + 1}. `, 'List item') },
  ];

  const primaryLabel = isNew || !wasPublished ? 'Publish' : 'Update';

  return (
    <div>
      {/* Title bar with the main actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={leave}
            aria-label="Back to all articles"
            className="grid w-11 h-11 shrink-0 place-items-center rounded-full border border-white/10 text-gray-300 hover:text-white hover:bg-white/[0.06]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate">{isNew ? 'New article' : 'Edit article'}</h1>
            <p className="text-sm text-gray-500" aria-live="polite">
              {dirty ? 'Unsaved changes' : isNew ? 'Not saved yet' : wasPublished ? 'Published · all changes saved' : 'Draft · all changes saved'}
            </p>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3">
          {wasPublished ? (
            <Button busy={saving === 'draft'} disabled={Boolean(saving)} onClick={() => save(true)} className="flex-1 sm:flex-none">
              Unpublish
            </Button>
          ) : (
            <Button busy={saving === 'draft'} disabled={Boolean(saving)} onClick={() => save(true)} className="flex-1 sm:flex-none">
              Save draft
            </Button>
          )}
          <Button variant="primary" busy={saving === 'publish'} disabled={Boolean(saving)} onClick={() => save(false)} className="flex-1 sm:flex-none">
            {primaryLabel}
          </Button>
        </div>
      </div>

      {restored && (
        <div className="mb-6">
          <Notice>
            We restored the article you were writing before.{' '}
            <button type="button" onClick={discardRestored} className="font-bold underline underline-offset-4">
              Start fresh instead
            </button>
          </Notice>
        </div>
      )}
      {message && (
        <div className="mb-6">
          <Notice tone="error">{message}</Notice>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        {/* ── Writing area ── */}
        <div className="space-y-5 min-w-0">
          <div>
            <label htmlFor="title" className="sr-only">
              Title
            </label>
            <textarea
              id="title"
              rows={1}
              value={meta.title}
              onChange={(e) => update('title', e.target.value.replace(/\n/g, ''))}
              placeholder="Article title"
              aria-invalid={Boolean(errors.title)}
              className="w-full resize-none bg-transparent text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-white placeholder:text-gray-600 outline-none [field-sizing:content] min-h-12"
            />
            {errors.title && <p className="text-sm text-red-400 mt-1" role="alert">{errors.title}</p>}
          </div>

          <div className={`rounded-2xl border bg-white/[0.02] overflow-hidden ${errors.body ? 'border-red-400/60' : 'border-white/10'}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-white/10 px-2 py-1.5">
              <div role="tablist" aria-label="Editor mode" className="flex gap-1 mr-2">
                {(['write', 'preview'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={`min-h-10 px-3 rounded-lg text-sm font-semibold capitalize transition-colors ${
                      tab === t ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {tab === 'write' && (
                <>
                  <span className="w-px h-6 bg-white/10 mx-1" aria-hidden />
                  {toolbar.map(({ label, icon: Icon, action }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={action}
                      aria-label={label}
                      title={label}
                      className="grid w-10 h-10 place-items-center rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06]"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => bodyImageInput.current?.click()}
                    disabled={uploading === 'body'}
                    aria-label="Insert image"
                    title="Insert image"
                    className="grid w-10 h-10 place-items-center rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-60"
                  >
                    {uploading === 'body' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                  </button>
                  <input
                    ref={bodyImageInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      handleUpload(e.target.files?.[0], 'body');
                      e.target.value = '';
                    }}
                  />
                </>
              )}
            </div>

            {tab === 'write' ? (
              <>
                <label htmlFor="body" className="sr-only">
                  Article
                </label>
                <textarea
                  id="body"
                  ref={textareaRef}
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                    setErrors((er) => ({ ...er, body: undefined }));
                  }}
                  onKeyDown={onEditorKey}
                  placeholder={'Start writing…\n\nUse the toolbar for headings, bold, links, lists and images.'}
                  className="block w-full min-h-[55vh] resize-y bg-transparent px-5 py-4 font-mono text-[0.95rem] leading-7 text-gray-100 placeholder:text-gray-600 outline-none [field-sizing:content]"
                />
              </>
            ) : (
              <div className="prose-blog px-5 sm:px-8 py-6 min-h-[55vh]" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            )}

            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-2 text-xs text-gray-500">
              <span>
                {words.toLocaleString()} words{words > 0 && ` · ${readingMinutes(body)} min read`}
              </span>
              <span className="hidden sm:inline">Markdown supported</span>
            </div>
          </div>
          {errors.body && <p className="text-sm text-red-400 -mt-2" role="alert">{errors.body}</p>}
        </div>

        {/* ── Settings sidebar ── */}
        <aside className="space-y-5 lg:sticky lg:top-24">
          <Panel title="Publishing">
            <div className="space-y-4">
              <Field label="Publish date" htmlFor="date" error={errors.date} hint="Newest articles are shown first.">
                <input id="date" type="date" value={meta.date} onChange={(e) => update('date', e.target.value)} className={`${inputClass} [color-scheme:dark]`} />
              </Field>
              <Field label="Category" htmlFor="category" error={errors.category}>
                <select id="category" value={meta.category} onChange={(e) => update('category', e.target.value)} className={`${inputClass} [color-scheme:dark]`}>
                  {[...new Set([...CATEGORIES, meta.category])].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Toggle
                id="featured"
                label="Featured"
                description="Show as the large card at the top of the blog."
                checked={meta.featured}
                onChange={(v) => update('featured', v)}
              />
            </div>
          </Panel>

          <Panel title="Web address">
            {isNew ? (
              <Field label="URL" htmlFor="slug" error={errors.slug} hint="Can't be changed after publishing, so links keep working.">
                <div className="flex items-center rounded-xl bg-white/[0.04] border border-white/10 focus-within:border-brand-yellow/60">
                  <span className="pl-4 text-sm text-gray-500 shrink-0">/blog/</span>
                  <input
                    id="slug"
                    value={slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSlug(slugify(e.target.value) || e.target.value.toLowerCase());
                      setErrors((er) => ({ ...er, slug: undefined }));
                    }}
                    onBlur={() => setSlug((s) => slugify(s))}
                    className="flex-1 min-w-0 min-h-11 bg-transparent pr-4 text-base text-white outline-none"
                  />
                </div>
              </Field>
            ) : (
              <p className="text-sm text-gray-300 break-all">
                {SITE_HOST}/blog/<strong className="text-white">{slug}</strong>
              </p>
            )}
          </Panel>

          <Panel>
            <Field
              label="Summary"
              htmlFor="excerpt"
              error={errors.excerpt}
              aside={
                <span className={`text-xs ${excerptLength > 160 ? 'text-brand-yellow' : 'text-gray-500'}`}>{excerptLength}/160</span>
              }
              hint="Shown on the blog card and in Google results. Aim for 120–160 characters."
            >
              <textarea
                id="excerpt"
                rows={3}
                value={meta.excerpt}
                onChange={(e) => update('excerpt', e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </Field>
          </Panel>

          <Panel title="Cover image">
            {coverSrc ? (
              <div className="space-y-3">
                <img src={coverSrc} alt="" className="w-full aspect-[16/10] object-cover rounded-xl border border-white/10" />
                <div className="flex gap-2">
                  <Button onClick={() => coverInput.current?.click()} busy={uploading === 'cover'} className="flex-1">
                    Replace
                  </Button>
                  <Button variant="ghost" onClick={() => update('cover', '')} aria-label="Remove cover image">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInput.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleUpload(e.dataTransfer.files?.[0], 'cover');
                }}
                disabled={uploading === 'cover'}
                className="w-full aspect-[16/10] rounded-xl border border-dashed border-white/20 hover:border-brand-yellow/60 hover:bg-white/[0.03] flex flex-col items-center justify-center gap-2 text-gray-400 transition-colors"
              >
                {uploading === 'cover' ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
                <span className="text-sm font-semibold">{uploading === 'cover' ? 'Uploading…' : 'Upload or drop an image'}</span>
                <span className="text-xs text-gray-500">Landscape works best. Resized automatically.</span>
              </button>
            )}
            {errors.cover && <p className="text-sm text-red-400 mt-2">{errors.cover}</p>}
            <input
              ref={coverInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                handleUpload(e.target.files?.[0], 'cover');
                e.target.value = '';
              }}
            />
          </Panel>

          <Panel>
            <Field label="Tags" htmlFor="tags" error={errors.tags} hint="Press Enter or comma to add. Up to 12.">
              <div className="flex flex-wrap gap-2 rounded-xl bg-white/[0.04] border border-white/10 focus-within:border-brand-yellow/60 p-2">
                {meta.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-white/10 pl-3 pr-1 py-1 text-sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => update('tags', meta.tags.filter((t) => t !== tag))}
                      aria-label={`Remove tag ${tag}`}
                      className="grid w-6 h-6 place-items-center rounded-full hover:bg-white/15"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  id="tags"
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={onTagKey}
                  onBlur={() => tagDraft && addTag(tagDraft)}
                  placeholder={meta.tags.length ? '' : 'e.g. Instagram'}
                  className="flex-1 min-w-24 min-h-8 bg-transparent px-2 text-base text-white placeholder:text-gray-600 outline-none"
                />
              </div>
            </Field>
          </Panel>

          <Panel title="Google preview">
            <div className="rounded-xl bg-[#202124] p-4">
              <p className="text-xs text-[#bdc1c6] truncate">
                {SITE_HOST} › blog › {slug || 'your-article'}
              </p>
              <p className="mt-1 text-[1.05rem] leading-snug text-[#8ab4f8] line-clamp-2">
                {(meta.title || 'Your article title') + ' | Vaibhav Pasi'}
              </p>
              <p className="mt-1 text-sm leading-snug text-[#bdc1c6] line-clamp-3">
                {meta.excerpt || 'Your excerpt appears here. Write one so Google shows a helpful summary.'}
              </p>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
