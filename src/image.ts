// Unsplash resizes on the fly via the `w` query param, so phones can download
// a ~640px image instead of the 2000px+ original.
const DEFAULT_WIDTHS = [480, 800, 1200, 1600, 2070];

export function unsplashSrcSet(url: string, widths: number[] = DEFAULT_WIDTHS) {
  return widths
    .map((w) => `${url.replace(/([?&])w=\d+/, `$1w=${w}`)} ${w}w`)
    .join(', ');
}

export function unsplashAt(url: string, width: number) {
  return url.replace(/([?&])w=\d+/, `$1w=${width}`);
}
