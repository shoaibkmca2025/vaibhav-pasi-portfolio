import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Instagram, Layers, Play, X } from 'lucide-react';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, mergeGallery, type GalleryItem, type GalleryUpload } from '../../shared/gallery';
import uploadsData from '../content/gallery.json';

const LIMIT = 8;
const uploads = uploadsData as GalleryUpload[];

const altText = (item: GalleryItem) =>
  item.caption ? item.caption.replace(/\s+/g, ' ').slice(0, 120) : `Instagram post by Vaibhav Pasi`;

const formatDate = (date: string) => {
  const d = new Date(`${date}T00:00:00`);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Full-screen view: Escape closes, arrow keys move between photos, tap outside closes
function Lightbox({
  items,
  index,
  onClose,
  onMove,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onMove: (delta: number) => void;
}) {
  const item = items[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onMove(1);
      else if (e.key === 'ArrowLeft') onMove(-1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, onMove]);

  const navButton = 'grid w-11 h-11 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Instagram photo"
      className="theme-dark fixed inset-0 z-[5000] flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm text-gray-400">
          {index + 1} / {items.length}
        </span>
        <button type="button" onClick={onClose} autoFocus aria-label="Close" className={navButton}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="relative flex-1 min-h-0 flex items-center justify-center px-4" onClick={onClose}>
        <img
          src={item.image}
          alt={altText(item)}
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain rounded-xl"
          onClick={(e) => e.stopPropagation()}
        />
        {items.length > 1 && (
          <>
            <button type="button" aria-label="Previous photo" onClick={(e) => {
                e.stopPropagation();
                onMove(-1);
              }} className={`${navButton} absolute left-3 sm:left-6`}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button type="button" aria-label="Next photo" onClick={(e) => {
                e.stopPropagation();
                onMove(1);
              }} className={`${navButton} absolute right-3 sm:right-6`}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      <div className="px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] max-w-3xl w-full mx-auto" onClick={(e) => e.stopPropagation()}>
        {item.caption && <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 whitespace-pre-line">{item.caption}</p>}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold tracking-widest uppercase text-gray-500">{formatDate(item.date)}</span>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-11 px-5 rounded-full bg-brand-yellow text-black text-sm font-bold hover:brightness-110"
            >
              <Instagram className="w-4 h-4" aria-hidden /> View on Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InstagramGallery() {
  // Uploaded photos render straight away (and in the prebuilt page); live posts merge in after load
  const [items, setItems] = useState<GalleryItem[]>(() => mergeGallery(uploads, [], LIMIT));
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/instagram')
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data: { items?: GalleryItem[] }) => {
        if (!cancelled && data.items?.length) setItems(mergeGallery(uploads, data.items, LIMIT));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const move = useCallback(
    (delta: number) => setOpen((i) => (i === null ? i : (i + delta + items.length) % items.length)),
    [items.length],
  );
  const close = useCallback(() => setOpen(null), []);

  // Nothing to show yet (no uploads, Instagram not connected): leave the section out entirely
  if (!items.length) return null;

  return (
    <section className="section-padding bg-brand-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-2xl">
            <span className="eyebrow font-bold tracking-[0.4em] uppercase text-[0.6875rem] mb-5">Instagram</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter italic uppercase leading-[0.9] mb-6">
              Behind the <span className="text-gray-500">Scenes.</span>
            </h2>
            <p className="text-gray-400 font-normal leading-relaxed md:text-lg">
              Campaigns, workshops and everyday moments from the work, straight from Instagram.
            </p>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start md:self-auto inline-flex items-center gap-2 min-h-11 px-5 rounded-full border border-white/15 hover:border-accent text-sm font-bold transition-colors"
          >
            <Instagram className="w-4 h-4" aria-hidden /> Follow @{INSTAGRAM_HANDLE}
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </a>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {items.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Open photo: ${altText(item)}`}
                className="theme-dark group relative block w-full aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-brand-muted"
              >
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {item.kind !== 'image' && (
                  <span className="absolute top-2.5 right-2.5 grid w-7 h-7 place-items-center rounded-full bg-black/55 text-white" aria-hidden>
                    {item.kind === 'video' ? <Play className="w-3.5 h-3.5 fill-current" /> : <Layers className="w-3.5 h-3.5" />}
                  </span>
                )}
                {item.caption && (
                  <span className="pointer-events-none absolute inset-0 flex items-end p-3 sm:p-4 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                    <span className="text-left text-xs sm:text-sm text-white leading-snug line-clamp-3">{item.caption}</span>
                  </span>
                )}
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      {open !== null && items[open] && <Lightbox items={items} index={open} onClose={close} onMove={move} />}
    </section>
  );
}
