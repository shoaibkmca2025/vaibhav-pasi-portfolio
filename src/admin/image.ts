// Shrinks photos in the browser before upload: max 1600px, WebP (or JPEG where WebP isn't
// supported). A 6 MB phone photo usually ends up around 200-400 KB, so pages stay fast.
import { api } from './api';

const MAX_SIDE = 1600;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

async function shrink(file: File): Promise<Blob> {
  // GIFs may be animated; resizing on a canvas would keep only the first frame
  if (file.type === 'image/gif') return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let blob = await toBlob(canvas, 'image/webp', 0.82);
  if (!blob || blob.type !== 'image/webp') blob = await toBlob(canvas, 'image/jpeg', 0.85);
  // Keep the original if it was already smaller (e.g. a well-optimised small image)
  return blob && blob.size < file.size ? blob : file;
}

function toBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

// Returns the public URL (/blog/... or /gallery/...) plus a local preview URL, because the uploaded file
// only appears on the live site after the next deploy (about a minute)
export async function uploadImage(file: File, folder: 'blog' | 'gallery' = 'blog') {
  if (!ACCEPTED.includes(file.type)) throw new Error('Upload a JPG, PNG, WebP, GIF or AVIF image.');
  const blob = await shrink(file);
  if (blob.size > 3 * 1024 * 1024) throw new Error('That image is still over 3 MB after resizing. Try a smaller one.');
  const { url } = await api.uploadImage({ filename: file.name, contentType: blob.type, data: await toBase64(blob), folder });
  return { url, preview: URL.createObjectURL(blob) };
}
