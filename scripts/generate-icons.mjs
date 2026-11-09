#!/usr/bin/env node
/**
 * Regenerates every icon from the brand files in public/brand: `pnpm icons`.
 *
 *   src/app/icon.svg             a copy of polestride-icon.svg
 *   src/app/favicon.ico          16 and 32 in one ICO
 *   src/app/apple-icon.png       180, full-bleed: iOS shows transparent corners as black
 *   public/icons/icon-*.png      192 and 512, for the manifest
 *   public/icons/icon-maskable-* 192 and 512, full-bleed with the mark inside the safe zone
 *
 * Uses Playwright's Chromium, already installed for the E2E tests.
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = process.cwd();
const brand = path.join(root, "public", "brand");
const iconSource = fs.readFileSync(path.join(brand, "polestride-icon.svg"), "utf8").trim();
const markSource = fs.readFileSync(path.join(brand, "polestride-mark.svg"), "utf8").trim();

const NIGHT = "#0B1630";
const GLACIER = "#EAF1FB";

/** The icon with square corners, for platforms that apply their own mask. */
const squareIcon = iconSource.replace(' rx="24"', "");

/**
 * The mark's extreme points in its own 104-unit box. A maskable icon can be cut to a circle whose
 * radius is 40% of the icon, so the mark has to fit inside that, not just inside a square margin.
 */
const MARK_CENTRE = { x: 52, y: 54 };
const MARK_POINTS = [
  [21, 8],
  [21, 100],
  [83, 36],
];
const SAFE_RADIUS = 0.4;
/** The brief's minimum padding on each side. */
const MIN_PADDING = 0.12;

function maskableSvg() {
  const reach = Math.max(
    ...MARK_POINTS.map(([x, y]) => Math.hypot(x - MARK_CENTRE.x, y - MARK_CENTRE.y)),
  );
  const scale = (SAFE_RADIUS * 104) / reach;
  const height = (92 * scale) / 104;
  if ((1 - height) / 2 < MIN_PADDING) throw new Error("Maskable icon has too little padding");

  const inner = markSource
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>$/, "")
    .replace('fill="currentColor"', `fill="${GLACIER}"`);
  const tx = 52 - MARK_CENTRE.x * scale;
  const ty = 52 - MARK_CENTRE.y * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104 104"><rect width="104" height="104" fill="${NIGHT}"/><g transform="translate(${tx} ${ty}) scale(${scale})">${inner}</g></svg>`;
}

const sized = (svg, size) => svg.replace("<svg ", `<svg width="${size}" height="${size}" `);

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
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((image) => image.data)]);
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

async function render(svg, size) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<!doctype html><html><body style="margin:0;background:transparent">${sized(svg, size)}</body></html>`,
  );
  return page.screenshot({
    clip: { x: 0, y: 0, width: size, height: size },
    omitBackground: true,
  });
}

/** Raw RGBA pixels at `size`, drawn through a canvas. */
async function renderPixels(svg, size) {
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
    { svg: sized(svg, size), size },
  );
  return Buffer.from(data);
}

const app = path.join(root, "src", "app");
const icons = path.join(root, "public", "icons");
fs.mkdirSync(icons, { recursive: true });

fs.writeFileSync(path.join(app, "icon.svg"), `${iconSource}\n`);
console.log("src/app/icon.svg");

fs.writeFileSync(path.join(app, "apple-icon.png"), await render(squareIcon, 180));
console.log("src/app/apple-icon.png");

const maskable = maskableSvg();
for (const [name, svg, size] of [
  ["icon-192.png", iconSource, 192],
  ["icon-512.png", iconSource, 512],
  ["icon-maskable-192.png", maskable, 192],
  ["icon-maskable-512.png", maskable, 512],
]) {
  fs.writeFileSync(path.join(icons, name), await render(svg, size));
  console.log(`public/icons/${name}`);
}

const ico = [];
for (const size of [16, 32]) {
  ico.push({ size, data: toDib(size, await renderPixels(iconSource, size)) });
}
fs.writeFileSync(path.join(app, "favicon.ico"), toIco(ico));
console.log("src/app/favicon.ico");

await browser.close();
