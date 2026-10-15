import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, ImagePlus, Instagram, Loader2, Pin, Trash2, XCircle } from 'lucide-react';
import { INSTAGRAM_URL, isInstagramPostUrl, mergeGallery, type GalleryUpload } from '../../shared/gallery';
import { api, type GalleryData } from './api';
import { uploadImage } from './image';
import { Button, Notice, Panel, Spinner, Toggle, inputClass } from './ui';

const PREVIEW_LIMIT = 8;

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function GalleryManager() {
  const [data, setData] = useState<GalleryData | null>(null);
  const [uploads, setUploads] = useState<GalleryUpload[]>([]);
  const [baseline, setBaseline] = useState('');
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const fileInput = useRef<HTMLInputElement>(null);

  const dirty = baseline !== '' && JSON.stringify(uploads) !== baseline;

  const load = () => {
    setLoadError('');
    api
      .getGallery()
      .then((d) => {
        setData(d);
        setUploads(d.uploads);
        setBaseline(JSON.stringify(d.uploads));
      })
      .catch((e: Error) => setLoadError(e.message));
  };
  useEffect(load, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const update = (id: string, patch: Partial<GalleryUpload>) => {
    setSaved(false);
    setUploads((list) => list.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  };

  const move = (index: number, delta: number) => {
    setSaved(false);
    setUploads((list) => {
      const next = [...list];
      const [item] = next.splice(index, 1);
      next.splice(index + delta, 0, item);
      return next;
    });
  };

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError('');
    setSaved(false);
    for (const file of Array.from(files)) {
      setUploading((n) => n + 1);
      try {
        const { url, preview } = await uploadImage(file, 'gallery');
        setPreviews((p) => ({ ...p, [url]: preview }));
        setUploads((list) => [
          { id: Math.random().toString(36).slice(2, 10), image: url, caption: '', link: '', pinned: false, date: today() },
          ...list,
        ]);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setUploading((n) => n - 1);
      }
    }
  };

  const save = async () => {
    const badLink = uploads.find((u) => u.link && !isInstagramPostUrl(u.link));
    if (badLink) {
      setError(`"${badLink.link}" isn't an Instagram post link. Copy it from Instagram's Share → Copy link.`);
      return;
    }
    setSaving(true);
    setError('');
    try {
      const result = await api.saveGallery(uploads, data?.sha ?? null);
      setData((d) => (d ? { ...d, sha: result.sha } : d));
      setBaseline(JSON.stringify(uploads));
      setSaved(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const preview = useMemo(
    () => mergeGallery(uploads, data?.instagram.items ?? [], PREVIEW_LIMIT),
    [uploads, data],
  );
  const src = (image: string) => (previews as Record<string, string>)[image] ?? image;

  if (loadError) {
    return (
      <div className="max-w-xl space-y-4">
        <Notice tone="error">{loadError}</Notice>
        <Button onClick={load}>Try again</Button>
      </div>
    );
  }
  if (!data) return <Spinner label="Loading gallery…" />;

  const ig = data.instagram;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Instagram gallery</h1>
          <p className="mt-1 text-gray-400">The "Behind the Scenes" photos on your home page.</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button onClick={() => fileInput.current?.click()} disabled={uploading > 0} className="flex-1 sm:flex-none">
            {uploading > 0 ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <ImagePlus className="w-4 h-4" aria-hidden />}
            {uploading > 0 ? `Uploading ${uploading}…` : 'Add photos'}
          </Button>
          <Button variant="primary" onClick={save} busy={saving} disabled={!dirty || uploading > 0} className="flex-1 sm:flex-none">
            Save gallery
          </Button>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      <div className="space-y-4 mb-8">
        {error && <Notice tone="error">{error}</Notice>}
        {saved && <Notice tone="success">Gallery saved. The website updates in about a minute.</Notice>}
        {dirty && !saved && <Notice tone="warning">You have unsaved changes. Click <strong>Save gallery</strong> to publish them.</Notice>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        {/* Uploaded photos */}
        <div>
          {uploads.length === 0 ? (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
              className="w-full flex flex-col items-center justify-center text-center gap-3 py-16 rounded-2xl border border-dashed border-white/20 hover:border-accent/60 hover:bg-white/[0.03] transition-colors"
            >
              <ImagePlus className="w-8 h-8 text-gray-500" aria-hidden />
              <span className="text-lg font-bold">Add your first photos</span>
              <span className="text-sm text-gray-500 max-w-sm">
                Click or drop images. Save them from Instagram (or your camera roll), upload here, and paste each post's link.
              </span>
            </button>
          ) : (
            <ul className="space-y-3">
              {uploads.map((u, i) => (
                <li key={u.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <img src={src(u.image)} alt="" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} className="w-full sm:w-32 aspect-square object-cover rounded-xl border border-white/10 shrink-0" />
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <label htmlFor={`caption-${u.id}`} className="text-xs font-bold tracking-wider uppercase text-gray-300">Caption</label>
                      <textarea
                        id={`caption-${u.id}`}
                        rows={2}
                        value={u.caption}
                        onChange={(e) => update(u.id, { caption: e.target.value })}
                        placeholder="What's happening in this photo?"
                        className={`${inputClass} mt-1.5 resize-y`}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                      <div>
                        <label htmlFor={`link-${u.id}`} className="text-xs font-bold tracking-wider uppercase text-gray-300">
                          Instagram post link <span className="normal-case tracking-normal font-normal text-gray-500">(optional)</span>
                        </label>
                        <input
                          id={`link-${u.id}`}
                          type="url"
                          value={u.link}
                          onChange={(e) => update(u.id, { link: e.target.value.trim() })}
                          placeholder="https://www.instagram.com/p/…"
                          aria-invalid={Boolean(u.link) && !isInstagramPostUrl(u.link)}
                          className={`${inputClass} mt-1.5`}
                        />
                      </div>
                      <div>
                        <label htmlFor={`date-${u.id}`} className="text-xs font-bold tracking-wider uppercase text-gray-300">Date</label>
                        <input
                          id={`date-${u.id}`}
                          type="date"
                          value={u.date}
                          onChange={(e) => update(u.id, { date: e.target.value })}
                          className={`${inputClass} mt-1.5`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="w-56">
                        <Toggle id={`pin-${u.id}`} label="Pin to top" checked={u.pinned} onChange={(v) => update(u.id, { pinned: v })} />
                      </div>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="grid w-11 h-11 place-items-center rounded-full text-gray-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30">
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => move(i, 1)} disabled={i === uploads.length - 1} aria-label="Move down" className="grid w-11 h-11 place-items-center rounded-full text-gray-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30">
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSaved(false);
                            setUploads((list) => list.filter((x) => x.id !== u.id));
                          }}
                          aria-label="Remove photo"
                          className="grid w-11 h-11 place-items-center rounded-full text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Instagram connection + live preview */}
        <aside className="space-y-5 lg:sticky lg:top-24">
          <Panel title="Instagram auto-sync">
            {ig.configured && ig.ok ? (
              <p className="flex gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" aria-hidden />
                <span>
                  <strong className="text-white">Connected.</strong> Your {ig.items.length} latest posts appear automatically,
                  after any pinned photos.
                </span>
              </p>
            ) : ig.configured ? (
              <p className="flex gap-2 text-sm text-gray-300">
                <XCircle className="w-5 h-5 text-red-400 shrink-0" aria-hidden />
                <span>{ig.error ?? 'Instagram is not responding.'} Uploaded photos are still shown.</span>
              </p>
            ) : (
              <p className="text-sm text-gray-400 leading-relaxed">
                <strong className="text-white">Not connected.</strong> Only uploaded photos show for now. To show your latest posts
                automatically, add <code className="text-accent">INSTAGRAM_ACCESS_TOKEN</code> in Vercel (steps in the README).
              </p>
            )}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white">
              <Instagram className="w-4 h-4" aria-hidden /> Open your Instagram
            </a>
          </Panel>

          <Panel title="How it will look">
            {preview.length ? (
              <ul className="grid grid-cols-4 gap-1.5">
                {preview.map((item) => (
                  <li key={item.id} className="relative aspect-square overflow-hidden rounded-md bg-white/[0.05]">
                    <img src={src(item.image)} alt="" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} className="w-full h-full object-cover" />
                    {item.source === 'upload' && uploads.find((u) => u.id === item.id)?.pinned && (
                      <Pin className="absolute top-1 right-1 w-3 h-3 text-white drop-shadow" aria-label="Pinned" />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">The gallery stays hidden on the website until it has photos.</p>
            )}
            <p className="mt-3 text-xs text-gray-500">Pinned first, then newest. Up to {PREVIEW_LIMIT} photos on the home page.</p>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
