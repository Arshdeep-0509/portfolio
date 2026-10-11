import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

// The full-site axe sweep is part of the launch checklist; this guards the key pages in CI.
const pages = [
  "/",
  "/services",
  "/services/ai-integration",
  "/approach",
  "/about",
  "/work",
  "/work/ima-banjara-hills",
  "/work/trading-platform",
  "/work/avior-convent-school",
  "/contact",
  "/collaborate",
  "/privacy-policy",
  "/this-page-does-not-exist",
];

for (const path of pages) {
  test(`no WCAG 2.2 AA violations on ${path}`, async ({ page }) => {
    // Every page loads in parallel with the rest of the suite; axe itself takes a few seconds.
    test.setTimeout(60_000);
    await page.goto(path);
    // Let scroll-reveal animations finish so colours are measured at full opacity.
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
    });
    await page.waitForTimeout(1000);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`),
    ).toEqual([]);
  });
}
