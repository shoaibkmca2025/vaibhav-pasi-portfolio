// Instagram gallery: shared by the website (src/components/InstagramGallery.tsx), the dashboard
// (src/admin/GalleryManager.tsx) and the API (api/instagram.ts, api/admin-gallery.ts).
//
// Two sources are merged:
//   1. Uploaded photos, saved in src/content/gallery.json from the dashboard (always available)
//   2. Latest posts from Instagram's API, when INSTAGRAM_ACCESS_TOKEN is set (auto-updating)

export const GALLERY_FILE = 'src/content/gallery.json';
export const GALLERY_MEDIA_DIR = 'public/gallery';
export const INSTAGRAM_HANDLE = 'vaibhavpasi_';
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;
export const MAX_UPLOADS = 60;

// A photo uploaded from the dashboard
export interface GalleryUpload {
  id: string;
  image: string; // /gallery/<file>
  caption: string;
  link: string; // optional Instagram post URL
  pinned: boolean; // pinned photos always show first, before the live feed
  date: string; // YYYY-MM-DD
}

// What the gallery renders, from either source
export interface GalleryItem {
  id: string;
  image: string;
  caption: string;
  link: string;
  date: string;
  kind: 'image' | 'video' | 'carousel';
  source: 'upload' | 'instagram';
}

export const isInstagramPostUrl = (url: string) =>
  /^https:\/\/(www\.)?instagram\.com\/(p|reel|reels|tv)\/[\w-]+\/?(\?.*)?$/.test(url);

// Same post linked with/without "www", trailing slash or tracking query counts as one
const postKey = (url: string) => url.replace(/^https:\/\/(www\.)?/, '').replace(/[?#].*$/, '').replace(/\/$/, '').toLowerCase();

export function validateUpload(item: GalleryUpload) {
  const errors: string[] = [];
  if (!/^\/gallery\/[\w.-]+$/.test(item.image)) errors.push('Each photo needs an uploaded image.');
  if (item.caption.length > 300) errors.push('Keep captions under 300 characters.');
  if (item.link && !isInstagramPostUrl(item.link)) errors.push(`"${item.link}" isn't an Instagram post link.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) errors.push('Each photo needs a date.');
  return errors;
}

const fromUpload = (u: GalleryUpload): GalleryItem => ({
  id: u.id,
  image: u.image,
  caption: u.caption,
  link: u.link,
  date: u.date,
  kind: 'image',
  source: 'upload',
});

// Order: pinned uploads, then the newest of everything else (Instagram posts + other uploads).
// An upload that links to a post already in the live feed replaces that post (yours wins).
export function mergeGallery(uploads: GalleryUpload[], instagram: GalleryItem[], limit: number) {
  const pinned = uploads.filter((u) => u.pinned).map(fromUpload);
  const linked = new Set(uploads.filter((u) => u.link).map((u) => postKey(u.link)));
  const rest = [
    ...uploads.filter((u) => !u.pinned).map(fromUpload),
    ...instagram.filter((p) => !linked.has(postKey(p.link))),
  ].sort((a, b) => b.date.localeCompare(a.date));
  return [...pinned, ...rest].slice(0, limit);
}
