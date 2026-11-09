import { test as plainTest } from "@playwright/test";
import { expect, test } from "./fixtures";

const POLAR_NIGHT = "rgb(11, 22, 48)";
const GLACIER = "rgb(234, 241, 251)";
const POLARIS_GOLD = "rgb(232, 184, 74)";
const SENT = "Sent. You'll hear back within one business day.";

test.describe("buttons", () => {
  test.use({ colorScheme: "dark" });

  test("primary and secondary follow the spec", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("section[aria-labelledby='home-title']");
    const primary = hero.getByRole("link", { name: "Book a free call" });
    await expect(primary).toHaveCSS("background-color", POLARIS_GOLD);
    await expect(primary).toHaveCSS("color", POLAR_NIGHT);
    await expect(primary).toHaveCSS("border-radius", "10px");
    await expect(primary).toHaveCSS("font-weight", "600");
    expect(await primary.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/sora/i);

    const secondary = hero.getByRole("link", { name: "See selected work" });
    await expect(secondary).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(secondary).toHaveCSS("border-top-width", "1px");
    await expect(secondary).toHaveCSS("color", GLACIER);
  });

  test("focus draws a 2px Aurora ring, offset 2px", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "Safari only tabs to links when the visitor turns that on");
    await page.goto("/");
    const primary = page
      .locator("section[aria-labelledby='home-title']")
      .getByRole("link", { name: "Book a free call" });
    await primary.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(primary).toHaveCSS("outline-width", "2px");
    await expect(primary).toHaveCSS("outline-offset", "2px");
    await expect(primary).toHaveCSS("outline-color", "rgb(95, 212, 194)");
  });

  test("no button carries a typed arrow", async ({ page }) => {
    await page.goto("/");
    const labels = await page
      .locator("button, a.rounded-button")
      .evaluateAll((els) => els.map((el) => el.textContent ?? ""));
    expect(labels.filter((label) => /[→←↗]/.test(label))).toEqual([]);
  });
});

test.describe("header", () => {
  test("is 85% surface with a real blur once scrolled", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
    const bar = page.locator(".site-bar");
    await expect(bar).toHaveCSS("backdrop-filter", /blur/);
    await expect
      .poll(() => bar.evaluate((el) => getComputedStyle(el).backgroundColor))
      .toMatch(/0\.85\)$/);
  });

  test("marks the current page with a star, not colour alone", async ({ page, isMobile }) => {
    test.skip(isMobile, "the bar links are desktop only");
    await page.goto("/work");
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav.locator(":scope > ul > li > svg")).toHaveCount(1);
    await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
  });
});

test("principles aren't numbered, and the project steps are", async ({ page }) => {
  await page.goto("/");
  const principles = page.locator("#principles");
  await expect(principles.locator("ol")).toHaveCount(0);
  await expect(principles.locator("ul li").first()).not.toContainText(/^0\d/);
  await expect(page.getByText("Step 01", { exact: true })).toBeVisible();
});

test.describe("star path", () => {
  test.use({ colorScheme: "dark" });

  test("lights the hovered step in gold", async ({ page, isMobile }) => {
    test.skip(isMobile, "no hover on phones");
    await page.goto("/");
    const stars = page.locator("#process nav li svg");
    await expect(stars).toHaveCount(6);
    const item = page.locator("#process nav li").nth(3);
    await item.scrollIntoViewIfNeeded();
    await item.hover();
    await expect(stars.nth(3)).toHaveCSS("color", POLARIS_GOLD);
  });
});

test.describe("FAQ accordion", () => {
  test("is a button and a region, and only animates once used", async ({ page }) => {
    await page.goto("/");
    const trigger = page
      .locator("section[aria-labelledby='faq-title'] button[aria-expanded]")
      .nth(1);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    const panel = page.locator(`[id="${await trigger.getAttribute("aria-controls")}"]`);
    await expect(panel).toHaveAttribute("role", "region");
    await expect(panel).toHaveCSS("transition-duration", "0s");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(panel).not.toHaveCSS("transition-duration", "0s");
    await expect(trigger.locator("svg")).toHaveClass(/rotate-180/);
  });
});

test.describe("forms", () => {
  test("inputs sit on the surface with a 1px border and a 10px radius", async ({ page }) => {
    await page.goto("/services");
    await page.locator("#quick-start-title").scrollIntoViewIfNeeded();
    const input = page.locator("#quick-name");
    await expect(input).toHaveCSS("border-radius", "10px");
    await expect(input).toHaveCSS("border-top-width", "1px");
    const [surface, fill] = await input.evaluate((el) => [
      getComputedStyle(document.documentElement).getPropertyValue("--surface").trim(),
      getComputedStyle(el).backgroundColor,
    ]);
    expect(surface).toBeTruthy();
    expect(fill).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("the newsletter says what happens next", async ({ page }) => {
    await page.route("**/api/newsletter", (route) => route.fulfill({ json: { ok: true } }));
    await page.goto("/services");
    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();
    await footer.getByLabel("Your email").fill("nope");
    await footer.getByRole("button", { name: "Subscribe" }).click();
    await expect(footer.locator("[id$='-error'] svg")).toBeVisible();
    await footer.getByLabel("Your email").fill("me@example.com");
    await footer.getByRole("button", { name: "Subscribe" }).click();
    await expect(footer.getByText("The next note will land in your inbox.")).toBeVisible();
  });

  test("quick contact confirms in the agreed words", async ({ page }) => {
    await page.route("**/api/contact", (route) => route.fulfill({ json: { ok: true } }));
    await page.goto("/services");
    await page.locator("#quick-start-title").scrollIntoViewIfNeeded();
    const form = page.getByRole("form", { name: "Quick enquiry" });
    await form.getByLabel(/Your name/).fill("Ravi Kumar");
    await form.getByLabel(/^Email/).fill("ravi@example.com");
    await form.getByLabel(/The idea, in one line/).fill("A delivery tracker for our shop");
    await form.getByRole("checkbox").check();
    await form.getByRole("button", { name: "Send it over" }).click();
    await expect(page.getByRole("heading", { name: SENT })).toBeVisible();
  });
});

test.describe("footer", () => {
  test.use({ colorScheme: "light" });

  test("stays Polar Night with Glacier text in the light theme", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toHaveCSS("background-color", POLAR_NIGHT);
    await expect(footer.getByRole("link", { name: "Approach" })).toHaveCSS("color", GLACIER);
    // The legal line's rule runs the full width of the container, like the one under the logo.
    const rule = await footer.getByText("All rights reserved").locator("xpath=..").boundingBox();
    const logoRule = await footer.locator(".grid.border-t").first().boundingBox();
    expect(rule?.width).toBe(logoRule?.width);
  });
});

plainTest("the cookie banner is a compact card at the bottom left", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const banner = page.getByRole("region", { name: /Cookies/ });
  await expect(banner).toBeVisible();
  await expect
    .poll(async () => {
      const box = await banner.boundingBox();
      return box && [Math.round(box.x), Math.round(box.width)];
    })
    .toEqual([24, 384]);
  const box = (await banner.boundingBox())!;
  expect(box.y + box.height).toBeCloseTo(900 - 24, 0);
});

for (const route of ["/", "/services", "/work", "/about", "/contact", "/privacy-policy"]) {
  test(`${route}: no shadows, and 44px targets at phone width`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(route);
    const result = await page.evaluate(() => {
      const shown = (el: Element) => {
        const box = el.getBoundingClientRect();
        return box.width > 0 && box.height > 0 && !el.closest("[inert], [aria-hidden='true']");
      };
      // Links inside a sentence are exempt, as is a control whose whole label is the target.
      const inSentence = (el: Element) =>
        el.tagName === "A" &&
        [...el.parentElement!.childNodes].some(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent!.trim().length > 0,
        );
      const small = [
        ...document.querySelectorAll("a[href], button, summary, select, textarea, input"),
      ]
        .filter((el) => shown(el) && !el.matches(".sr-only, [tabindex='-1']"))
        .filter((el) => !inSentence(el) && !el.closest(".prose, label"))
        .filter((el) => {
          const box = el.getBoundingClientRect();
          return box.height < 44 || box.width < 24;
        })
        .map((el) => `${el.tagName} ${(el.textContent ?? "").trim().slice(0, 30)}`);
      const shadows = [...document.querySelectorAll("body *")].filter(
        (el) => getComputedStyle(el).boxShadow !== "none",
      ).length;
      return { small, shadows };
    });
    expect(result.shadows).toBe(0);
    expect(result.small).toEqual([]);
  });
}

test("every keyboard stop on the home page shows the ring", async ({ page }) => {
  await page.goto("/");
  const missing = new Set<string>();
  for (let stop = 0; stop < 40; stop++) {
    await page.keyboard.press("Tab");
    const name = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      return getComputedStyle(el).outlineWidth === "2px" ? null : el.tagName;
    });
    if (name) missing.add(name);
  }
  expect([...missing]).toEqual([]);
});
