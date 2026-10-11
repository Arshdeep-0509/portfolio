#!/usr/bin/env node
/**
 * Broken-link check across the built site. Crawls from the sitemap (and "/"), follows every
 * internal link, and fails if any page returns an error status or an #anchor points at an id
 * that doesn't exist on its page. External links are listed, not fetched (they're flaky in CI).
 *
 * Usage: start the production server, then `pnpm test:links` (BASE_URL defaults to :3100).
 */

const BASE = (process.env.BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");
const MAX_PAGES = Number(process.env.MAX_PAGES ?? 500);

const pages = new Map(); // path -> { status, ids: Set }
const links = []; // { from, href }
const external = new Set();

function normalise(href, from) {
  if (
    !href ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("javascript:")
  ) {
    return null;
  }
  const url = new URL(href, BASE + from);
  if (url.origin !== new URL(BASE).origin) {
    if (/^https?:$/.test(url.protocol)) external.add(url.origin + url.pathname);
    return null;
  }
  return { path: url.pathname, hash: url.hash.slice(1) };
}

async function fetchPage(path) {
  if (pages.has(path)) return pages.get(path);
  const response = await fetch(BASE + path, { redirect: "follow" });
  const type = response.headers.get("content-type") ?? "";
  const entry = { status: response.status, ids: new Set(), html: "" };
  if (type.includes("text/html")) {
    entry.html = await response.text();
    for (const match of entry.html.matchAll(/\sid="([^"]+)"/g)) entry.ids.add(match[1]);
  }
  pages.set(path, entry);
  return entry;
}

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const queue = [
  "/",
  ...[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname),
];
const seen = new Set();

while (queue.length && seen.size < MAX_PAGES) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  const page = await fetchPage(path);
  if (!page.html) continue;
  for (const match of page.html.matchAll(/<a\s[^>]*href="([^"]*)"/g)) {
    const href = match[1].replace(/&amp;/g, "&");
    const target = normalise(href, path);
    if (!target) continue;
    links.push({ from: path, href, ...target });
    // Only crawl pages, not assets or API routes.
    if (!/\.[a-z0-9]{2,5}$/i.test(target.path) && !target.path.startsWith("/api/")) {
      queue.push(target.path);
    }
  }
}

const broken = [];
for (const link of links) {
  const page = await fetchPage(link.path);
  if (page.status >= 400) broken.push(`${link.from} → ${link.href} (HTTP ${page.status})`);
  else if (link.hash && page.html && !page.ids.has(decodeURIComponent(link.hash))) {
    broken.push(`${link.from} → ${link.href} (missing #${link.hash})`);
  }
}

const unique = [...new Set(broken)];
console.log(`Crawled ${seen.size} pages, checked ${links.length} internal links.`);
console.log(`External links (not fetched): ${external.size}`);
if (unique.length) {
  console.error(`\n${unique.length} broken link(s):\n  ${unique.join("\n  ")}`);
  process.exit(1);
}
console.log("No broken internal links or anchors.");
