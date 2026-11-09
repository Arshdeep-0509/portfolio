import { expect, test } from "./fixtures";

const homeLink = 'header a[aria-label="Polestride home"]';

test("the header logo is inline, named, and follows the theme", async ({ page }) => {
  await page.goto("/");
  const logo = page.locator(homeLink).first();
  await expect(logo.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await expect(logo.locator("img")).toHaveCount(0);
  await expect(logo.locator(".logo-star")).toHaveAttribute("fill", "var(--accent)");
});

test("the wordmark gives way to the mark under 380px", async ({ page }) => {
  await page.setViewportSize({ width: 379, height: 700 });
  await page.goto("/");
  const logo = page.locator(homeLink).first();
  await expect(logo.getByText("Polestride")).toBeHidden();
  await expect(logo.locator("svg")).toBeVisible();

  await page.setViewportSize({ width: 380, height: 700 });
  await expect(logo.getByText("Polestride")).toBeVisible();
});

test("the footer logo carries the tagline", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("footer")).toContainText("Business automation that frees you to grow.");
});

test.describe("star rotation", () => {
  test("turns 45 degrees on hover", async ({ page, isMobile }) => {
    test.skip(isMobile, "needs a pointer");
    await page.goto("/");
    await page.locator(homeLink).first().hover();
    await expect(page.locator(`${homeLink} .logo-star`).first()).toHaveCSS("rotate", "45deg");
  });

  test("stays still under reduced motion", async ({ page, isMobile }) => {
    test.skip(isMobile, "needs a pointer");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.locator(homeLink).first().hover();
    await expect(page.locator(`${homeLink} .logo-star`).first()).toHaveCSS("rotate", "none");
  });
});

test("icons are served through the file conventions", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveCount(1);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  for (const path of ["/favicon.ico", "/icon.svg", "/apple-icon.png"]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }

  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.name).toBe("Polestride");
  expect(manifest.short_name).toBe("Polestride");
  for (const icon of manifest.icons) {
    expect((await request.get(icon.src)).status(), icon.src).toBe(200);
  }
});

test("/press offers every file, stays out of search and out of the navigation", async ({
  page,
  request,
}) => {
  await page.goto("/press");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('header a[href="/press"], footer a[href="/press"]')).toHaveCount(0);

  const downloads = await page
    .locator("main a[download]")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
  expect(downloads.length).toBeGreaterThan(0);
  for (const href of downloads) expect((await request.get(href)).status(), href).toBe(200);

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("/press");
});
