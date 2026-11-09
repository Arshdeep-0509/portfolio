import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { services } from "@/content/services";
import { expect, test } from "./fixtures";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const pages = [
  "/",
  "/services",
  ...services.map((service) => `/services/${service.slug}`),
  "/approach",
  "/about",
  "/work",
  "/work/ima-banjara-hills",
  "/work/trading-platform",
  "/work/avior-convent-school",
  "/contact",
  "/collaborate",
  "/pay",
  "/press",
  "/privacy-policy",
  "/terms-and-conditions",
  "/cookie-policy",
  "/refund-policy",
  "/this-page-does-not-exist",
];

async function violations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return results.violations.map(
    (v) => `${v.impact} ${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`,
  );
}

/** Walks the page, so scroll reveals finish and colours are measured at full opacity. */
async function settle(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
  });
  await page.waitForTimeout(1000);
}

for (const colorScheme of ["dark", "light"] as const) {
  test.describe(`${colorScheme} theme`, () => {
    test.use({ colorScheme });

    for (const path of pages) {
      test(`no WCAG 2.2 AA violations on ${path}`, async ({ page }) => {
        // Every page loads in parallel with the rest of the suite; axe itself takes a few seconds.
        test.setTimeout(90_000);
        await page.goto(path);
        await settle(page);
        expect(await violations(page)).toEqual([]);
      });
    }

    test("no violations with the mega menu open", async ({ page, isMobile }) => {
      test.skip(isMobile, "desktop navigation");
      test.setTimeout(90_000);
      await page.goto("/services");
      await page.getByRole("button", { name: "Services" }).first().click();
      await expect(page.locator("#services-menu")).toBeVisible();
      await page.waitForTimeout(400);
      expect(await violations(page)).toEqual([]);
    });

    test("no violations with the mobile menu open", async ({ page, isMobile }) => {
      test.skip(!isMobile, "mobile navigation");
      test.setTimeout(90_000);
      await page.goto("/services");
      await page.getByRole("button", { name: "Menu" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.waitForTimeout(600);
      expect(await violations(page)).toEqual([]);
    });

    test("no violations with form errors showing", async ({ page }) => {
      test.setTimeout(90_000);
      await page.goto("/services");
      await page.locator("#quick-start-title").scrollIntoViewIfNeeded();
      const form = page.getByRole("form", { name: "Quick enquiry" });
      await form.getByRole("button", { name: "Send it over" }).click();
      await expect(page.locator("#quick-name-error")).toBeVisible();
      await settle(page);
      expect(await violations(page)).toEqual([]);
    });
  });
}
