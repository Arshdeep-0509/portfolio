#!/usr/bin/env node
/**
 * Lists every unfilled [PLACEHOLDER] left in the site, grouped by token, with the files it appears
 * in. Run before launch: `pnpm placeholders` (add --markdown for a checklist table).
 *
 * Counted as placeholders:
 * - words starting with two capitals or a single capital: [EMAIL], [ADD DETAILS — …], [X]
 * - bare numbers in content files only: [24], [30–50]
 * Markdown links like [label](/path), Tailwind arbitrary values and code are ignored.
 */
import fs from "node:fs";
import path from "node:path";

// Content files, components (fallback copy) and placeholder images.
const ROOTS = ["src/content", "src/components", "content", "public"];
const SKIP = [/node_modules/, /\.(png|jpe?g|webp|avif|ico|woff2?)$/i];
const TOKEN = /\[([A-Z0-9][^\]\n]{0,80})\](?!\()/g;
const WORD = /^([A-Z][A-Z0-9_]|[A-Z]$)/;
const NUMBER = /^\d+(\.\d+)?([–-]\d+)?$/;
const CODE_CHARS = /[{}$`=<>[(]/;
const CONTENT = /^(src[\\/]content|content)[\\/]/;
// Words that describe placeholders rather than being one.
const META = new Set([
  "PLACEHOLDER",
  "PLACEHOLDERS",
  "SQUARE_BRACKETS",
  "BRACKETS",
  "COOKIE_SETTINGS_SECTION",
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (SKIP.some((re) => re.test(full))) continue;
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

const found = new Map();
for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    const text = fs.readFileSync(file, "utf8");
    const rel = file.replaceAll("\\", "/");
    for (const match of text.matchAll(TOKEN)) {
      const inner = match[1];
      const isWord = WORD.test(inner) && !CODE_CHARS.test(inner) && !META.has(inner);
      const isNumber = NUMBER.test(inner) && CONTENT.test(file);
      if (!isWord && !isNumber) continue;
      const token = `[${inner}]`;
      const files = found.get(token) ?? new Map();
      files.set(rel, (files.get(rel) ?? 0) + 1);
      found.set(token, files);
    }
  }
}

const sorted = [...found.entries()].sort((a, b) => a[0].localeCompare(b[0]));
if (process.argv.includes("--markdown")) {
  console.log("| Placeholder | Where |\n| --- | --- |");
  for (const [token, files] of sorted) {
    console.log(`| \`${token}\` | ${[...files.keys()].map((f) => `\`${f}\``).join(", ")} |`);
  }
} else {
  for (const [token, files] of sorted) {
    const total = [...files.values()].reduce((a, b) => a + b, 0);
    console.log(`${token}  (${total}×)  ${[...files.keys()].join(", ")}`);
  }
  console.log(`\n${sorted.length} distinct placeholders.`);
}
