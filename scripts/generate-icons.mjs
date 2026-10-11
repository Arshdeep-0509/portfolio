#!/usr/bin/env node
/**
 * Regenerates the icon set from the Skylamp mark: public/icons/icon.svg plus the PNG sizes,
 * the maskable icon, the Apple touch icon and src/app/favicon.ico (16/32/48 in one ICO).
 *
 * Rendering uses Playwright's Chromium (already a dev dependency for the E2E tests):
 *   pnpm exec playwright install chromium   # once
 *   node scripts/generate-icons.mjs
 *
 * The geometry mirrors <LogoMark> in src/components/layout/Logo.tsx (a 40-unit grid).
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const NIGHT = "#0A0A12";
const DUSK = "#2E2A4F";
const IVORY = "#FBF8F2";
const LAMP = "#F5A524";
const GLOW = "#FFC15E";

/**
 * The mark on a night square. `scale` sizes the 40-unit mark inside a 512 canvas; the maskable
 * variant uses a smaller scale so everything sits inside the 80% safe zone.
 */
function iconSvg({ size = 512, scale = 11, title = true, small = false } = {}) {
  // Tiny sizes get a bolder mark: thicker strokes and a larger lamp, or the dot vanishes at 16px.
  const stroke = small ? 4.2 : 3;
  const dot = small ? 4.4 : 2.6;
  const tx = 256 - 20 * scale;
  const ty = 256 - 17 * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">${
    title ? "<title>Arshdeep Singh</title>" : ""
  }
  <defs>
    <radialGradient id="sky" cx="50%" cy="105%" r="80%">
      <stop offset="0%" stop-color="${LAMP}" stop-opacity="0.22"/>
      <stop offset="45%" stop-color="${DUSK}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${NIGHT}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="lamp">
      <stop offset="0%" stop-color="${GLOW}" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="${LAMP}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${LAMP}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" fill="${NIGHT}"/>
  <rect width="512" height="512" fill="url(#sky)"/>
  <g transform="translate(${tx} ${ty}) scale(${scale})">
    <circle cx="20" cy="6.5" r="7.5" fill="url(#lamp)"/>
    <circle cx="20" cy="6.5" r="${dot}" fill="${LAMP}"/>
    <path d="M7.5 35 20 13.5 32.5 35" fill="none" stroke="${IVORY}" stroke-width="${stroke}" stroke-linejoin="miter" stroke-miterlimit="10"/>
  </g>
</svg>`;
}

/**
 * A 32-bit BMP (DIB) icon entry from raw RGBA pixels: bottom-up BGRA rows plus an empty AND
 * mask. BMP entries decode everywhere, including Next.js's image pipeline, which rejects
 * RGB-only PNGs inside .ico files.
 */
function toDib(size, rgba) {
  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0);
  header.writeInt32LE(size, 4);
  header.writeInt32LE(size * 2, 8); // XOR bitmap + AND mask
  header.writeUInt16LE(1, 12);
  header.writeUInt16LE(32, 14);
  const pixels = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const from = (y * size + x) * 4;
      const to = ((size - 1 - y) * size + x) * 4;
      pixels[to] = rgba[from + 2];
      pixels[to + 1] = rgba[from + 1];
      pixels[to + 2] = rgba[from];
      pixels[to + 3] = rgba[from + 3];
    }
  }
  const mask = Buffer.alloc(Math.ceil(size / 32) * 4 * size);
  return Buffer.concat([header, pixels, mask]);
}

function toIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((image) => image.data)]);
}

const root = process.cwd();
const icons = path.join(root, "public", "icons");
fs.mkdirSync(icons, { recursive: true });
fs.writeFileSync(path.join(icons, "icon.svg"), `${iconSvg({ size: 512 })}\n`);

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

async function render(size, options) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<!doctype html><html><body style="margin:0">${iconSvg({ size, ...options, title: false })}</body></html>`,
  );
  return page.screenshot({ clip: { x: 0, y: 0, width: size, height: size } });
}

/** Raw RGBA pixels of the mark at `size`, drawn through a canvas. */
async function renderPixels(size, options) {
  const svg = iconSvg({ size, ...options, title: false });
  const data = await page.evaluate(
    async ({ svg, size }) => {
      const image = new Image();
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, size, size);
      return Array.from(context.getImageData(0, 0, size, size).data);
    },
    { svg, size },
  );
  return Buffer.from(data);
}

const outputs = [
  ["icon-16.png", 16, { scale: 12.5, small: true }],
  ["icon-32.png", 32, { scale: 12.5, small: true }],
  ["icon-192.png", 192, {}],
  ["icon-512.png", 512, {}],
  ["apple-touch-icon.png", 180, { scale: 9.5 }],
  ["icon-maskable-512.png", 512, { scale: 8 }],
];
for (const [name, size, options] of outputs) {
  fs.writeFileSync(path.join(icons, name), await render(size, options));
  console.log(`public/icons/${name}`);
}

const ico = [];
for (const size of [16, 32, 48]) {
  const pixels = await renderPixels(size, { scale: 12.5, small: true });
  ico.push({ size, data: toDib(size, pixels) });
}
fs.writeFileSync(path.join(root, "src", "app", "favicon.ico"), toIco(ico));
console.log("src/app/favicon.ico");

await browser.close();
