#!/usr/bin/env node
/**
 * WCAG contrast check for the Skylamp palette: `pnpm contrast`.
 *
 * Reads the colour tokens from src/styles/globals.css, then checks every text/background pairing
 * the design system actually uses (see the TONES block in globals.css). Body text needs 4.5:1,
 * large text and UI parts (focus rings, input borders, icons) need 3:1. It also prints the pairings
 * that are deliberately NOT allowed — such as --lamp-500 text on ivory — so the reason they're
 * banned stays visible. Exits with code 1 if any allowed pairing fails.
 */
import fs from "node:fs";

const css = fs.readFileSync("src/styles/globals.css", "utf8");
const tokens = Object.fromEntries(
  [...css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})\b/gi)].map((m) => [m[1], m[2]]),
);

const channel = (hex, i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
const linear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = (hex) =>
  0.2126 * linear(channel(hex, 0)) +
  0.7152 * linear(channel(hex, 1)) +
  0.0722 * linear(channel(hex, 2));
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [foreground, background, minimum, where it's used]
const allowed = [
  // Paper: ivory
  ["ink-900", "ivory-50", 4.5, "body text and headings on ivory"],
  ["ink-600", "ivory-50", 4.5, "muted text on ivory"],
  ["lamp-700", "ivory-50", 4.5, "accent text, labels and links on ivory"],
  ["danger-700", "ivory-50", 4.5, "error text on ivory"],
  ["success-700", "ivory-50", 4.5, "success text on ivory"],
  ["lamp-700", "ivory-50", 3, "focus ring on ivory"],
  // Paper: sand
  ["ink-900", "sand-100", 4.5, "body text on sand"],
  ["ink-600", "sand-100", 4.5, "muted text on sand"],
  ["lamp-800", "sand-100", 4.5, "accent text on sand (AA tint)"],
  ["danger-700", "sand-100", 4.5, "error text on sand"],
  ["success-700", "sand-100", 4.5, "success text on sand"],
  // Night
  ["ivory-50", "night-950", 4.5, "text on night-950"],
  ["ivory-50", "night-900", 4.5, "text on night-900"],
  ["ivory-50", "night-800", 4.5, "text on cards on dark"],
  ["mist-300", "night-950", 4.5, "muted text on night-950"],
  ["mist-300", "night-900", 4.5, "muted text on night-900"],
  ["mist-300", "night-800", 4.5, "muted text on cards on dark"],
  ["lamp-400", "night-950", 4.5, "accent text on night-950"],
  ["lamp-400", "night-900", 4.5, "accent text on night-900"],
  ["lamp-400", "night-800", 4.5, "accent text on cards on dark"],
  ["starlight", "night-950", 4.5, "labels on night-950"],
  ["danger-300", "night-950", 4.5, "error text on night"],
  ["success", "night-950", 4.5, "success text on night"],
  ["success", "night-800", 4.5, "'ok' marks in the build log"],
  // Fills
  ["ink-900", "lamp-500", 4.5, "flame button text (gradient start)"],
  ["ink-900", "lamp-400", 4.5, "flame button text (gradient light end)"],
  ["ink-900", "ember-500", 4.5, "flame button text (gradient end)"],
  ["ivory-50", "ink-900", 4.5, "solid-ink button text"],
];

// Pairings the system never uses, kept here to document why.
const banned = [
  ["lamp-500", "ivory-50", "lamp-500 is a fill, never text on paper"],
  ["lamp-700", "sand-100", "below AA on sand; use lamp-800 there"],
  ["danger", "ivory-50", "use danger-700 for error text on paper"],
  ["success", "ivory-50", "use success-700 for text on paper"],
  ["mist-300", "ivory-50", "dark-only muted colour"],
];

let failures = 0;
console.log("Allowed pairings");
for (const [fg, bg, min, use] of allowed) {
  if (!tokens[fg] || !tokens[bg]) {
    console.log(`  ?    missing token --${fg} or --${bg}`);
    failures++;
    continue;
  }
  const value = ratio(tokens[fg], tokens[bg]);
  const ok = value >= min;
  if (!ok) failures++;
  console.log(
    `  ${ok ? "pass" : "FAIL"} ${value.toFixed(2).padStart(5)}:1 (needs ${min})  --${fg} on --${bg}  · ${use}`,
  );
}
console.log("\nBanned pairings (for reference)");
for (const [fg, bg, why] of banned) {
  console.log(
    `  ${ratio(tokens[fg], tokens[bg]).toFixed(2).padStart(5)}:1  --${fg} on --${bg}  · ${why}`,
  );
}
if (failures) {
  console.error(`\n${failures} pairing(s) below their minimum.`);
  process.exit(1);
}
console.log("\nAll allowed pairings meet WCAG AA.");
