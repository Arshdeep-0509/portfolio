import { expect, test } from "./fixtures";

const theme = (page: import("@playwright/test").Page) =>
  page.evaluate(() => document.documentElement.getAttribute("data-theme"));

test.describe("system preference, no saved choice", () => {
  test.describe("dark", () => {
    test.use({ colorScheme: "dark" });
    test("uses the dark theme", async ({ page }) => {
      await page.goto("/");
      expect(await theme(page)).toBe("dark");
    });
  });

  test.describe("light", () => {
    test.use({ colorScheme: "light" });
    test("uses the light theme", async ({ page }) => {
      await page.goto("/");
      expect(await theme(page)).toBe("light");
    });
  });
});

test.describe("theme toggle", () => {
  test.use({ colorScheme: "dark" });

  test("switches, then keeps the choice across a reload", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: "Switch to light theme" })
      .filter({ visible: true })
      .click();
    expect(await theme(page)).toBe("light");
    await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute(
      "content",
      "#EAF1FB",
    );

    await page.reload();
    expect(await theme(page)).toBe("light");
    await expect(
      page.getByRole("button", { name: "Switch to dark theme" }).filter({ visible: true }),
    ).toBeVisible();
  });

  test("sets the theme before first paint", async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem("theme", "light"));
    const response = await page.goto("/");
    const html = (await response?.text()) ?? "";
    // The script is in <head>, ahead of the stylesheet-dependent body.
    expect(html.indexOf("data-theme")).toBeLessThan(html.indexOf("<body"));
    expect(await theme(page)).toBe("light");
  });
});

test("night-sky islands stay dark in the light theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const log = page.locator("figure[data-theme='dark']").first();
  await expect(log).toBeVisible();
  const ink = await log.evaluate((el) => getComputedStyle(el).getPropertyValue("--ink").trim());
  expect(ink.toLowerCase()).toBe("#eaf1fb");
});

for (const [saved, system, expected] of [
  ["light", "dark", "rgb(234, 241, 251)"],
  ["dark", "light", "rgb(11, 22, 48)"],
] as const) {
  test(`no flash: a saved ${saved} theme is in place before the first paint`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: system });
    await page.goto("/about");
    await page.evaluate((value) => localStorage.setItem("theme", value), saved);
    // Records the page colour at the moment <body> first exists, before anything is painted.
    await page.addInitScript(() => {
      const watch = new MutationObserver(() => {
        if (!document.body) return;
        watch.disconnect();
        (window as unknown as { firstBg: string }).firstBg = getComputedStyle(
          document.documentElement,
        ).getPropertyValue("--bg");
        (window as unknown as { firstTheme: string | null }).firstTheme =
          document.documentElement.getAttribute("data-theme");
      });
      watch.observe(document, { childList: true, subtree: true });
    });
    await page.reload();
    const first = await page.evaluate(() => {
      const w = window as unknown as { firstBg: string; firstTheme: string | null };
      return { bg: w.firstBg, theme: w.firstTheme };
    });
    expect(first.theme).toBe(saved);
    await expect(page.locator("body")).toHaveCSS("background-color", expected);
  });
}
