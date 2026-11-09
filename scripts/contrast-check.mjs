#!/usr/bin/env node
/**
 * WCAG contrast check for the Polestride themes: `pnpm contrast`.
 *
 * Reads the tokens for both themes from src/styles/globals.css and measures every text/background
 * pairing the design uses. Text needs 4.5:1; large text and UI parts (focus rings, control borders,
 * the gold accent) need 3:1. --border is decorative hairline only, so it isn't listed: anything
 * that must be seen, such as a form field's edge, uses --ink-muted. Exits with code 1 on a failure.
 */
import fs from "node:fs";

const css = fs.readFileSync("src/styles/globals.css", "utf8");

function tokensIn(selector) {
  const start = css.indexOf(`${selector} {`);
  const body = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries(
    [...body.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})\b/gi)].map((m) => [m[1], m[2]]),
  );
}

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

const surfaces = ["bg", "surface", "surface-raised"];
const pairs = [
  ...["ink", "ink-muted", "link", "success", "danger"].flatMap((fg) =>
    surfaces.map((bg) => [fg, bg, 4.5, "text"]),
  ),
  ["accent-ink", "accent", 4.5, "primary CTA text"],
  ["bg", "link", 4.5, "selected control text"],
  ["bg", "ink", 4.5, "solid button text"],
  ...surfaces.map((bg) => ["accent", bg, 3, "star, active nav, highlight"]),
  ...surfaces.map((bg) => ["focus", bg, 3, "focus ring"]),
  ...surfaces.map((bg) => ["ink-muted", bg, 3, "form control border"]),
];

let failures = 0;
for (const [name, selector] of [
  ["Dark", '[data-theme="dark"]'],
  ["Light", ":root"],
]) {
  const tokens = tokensIn(selector);
  console.log(`\n${name} theme`);
  console.log("| Foreground | Background | Ratio | Needs | Result | Use |");
  console.log("| --- | --- | --- | --- | --- | --- |");
  for (const [fg, bg, min, use] of pairs) {
    if (!tokens[fg] || !tokens[bg]) {
      console.log(`| --${fg} | --${bg} | ? | ${min} | MISSING | ${use} |`);
      failures++;
      continue;
    }
    const value = ratio(tokens[fg], tokens[bg]);
    const ok = value >= min;
    if (!ok) failures++;
    console.log(
      `| --${fg} ${tokens[fg]} | --${bg} ${tokens[bg]} | ${value.toFixed(2)} | ${min} | ${ok ? "pass" : "FAIL"} | ${use} |`,
    );
  }
}

if (failures) {
  console.error(`\n${failures} pairing(s) below their minimum.`);
  process.exit(1);
}
console.log("\nEvery pairing meets WCAG AA.");
