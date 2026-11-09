import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { brandColors } from "@/lib/brandColors";

const css = fs.readFileSync("src/styles/globals.css", "utf8");

/** The hex tokens declared in the first block that starts with `selector`. */
function tokensIn(selector: string) {
  const start = css.indexOf(`${selector} {`);
  const body = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries(
    [...body.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})\b/gi)].map((match) => [
      match[1],
      match[2]?.toUpperCase(),
    ]),
  );
}

const toCss = (key: string) => key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

describe("brandColors", () => {
  it.each([
    ["light", ":root"],
    ["dark", '[data-theme="dark"]'],
  ] as const)("matches the %s tokens in globals.css", (theme, selector) => {
    const tokens = tokensIn(selector);
    for (const [key, value] of Object.entries(brandColors[theme])) {
      expect(tokens[toCss(key)], key).toBe(value);
    }
  });
});
