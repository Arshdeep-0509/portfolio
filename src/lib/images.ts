/**
 * SVGs (the placeholder art) bypass the Next.js image optimiser, which only handles raster
 * formats. Real covers and screenshots (PNG, JPG, WebP, AVIF) are optimised as usual.
 */
export function isUnoptimized(src: string) {
  return src.toLowerCase().endsWith(".svg");
}
