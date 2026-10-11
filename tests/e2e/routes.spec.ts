import { expect, siteRoutes, test } from "./fixtures";

test("every route returns 200 with exactly one h1", async ({ page, request }) => {
  test.setTimeout(180_000);
  const routes = await siteRoutes(request);
  expect(routes.length).toBeGreaterThan(20);
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1"), route).toHaveCount(1);
    await expect(page.locator("main#main"), route).toHaveCount(1);
  }
});

test("unknown pages return a real 404 with a helpful page", async ({ page }) => {
  for (const path of [
    "/this-page-does-not-exist",
    "/services/not-a-service",
    "/work/not-a-case-study",
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("wrong turn");
  }
});

test("robots, sitemap, manifest and health endpoints", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /api");
  expect(robots).toContain("Disallow: /pay");
  expect(robots).toContain("Sitemap:");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("<lastmod>");
  expect(sitemap).not.toContain("/pay<");
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.theme_color).toBe("#0B2545");
  const health = await request.get("/api/health");
  expect(health.status()).toBe(200);
  expect((await health.json()).status).toBe("ok");
});
