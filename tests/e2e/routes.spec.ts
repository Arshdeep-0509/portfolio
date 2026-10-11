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
    // The journal is switched off (siteConfig.featureFlags.blog) for now.
    "/journal",
    "/journal/how-to-scope-an-mvp",
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("off the map");
  }
});

test("renamed routes redirect permanently to their new address", async ({ request }) => {
  const cases: [string, string][] = [
    ["/why-me", "/approach"],
    ["/insights", "/journal"],
    ["/insights/how-to-scope-an-mvp", "/journal/how-to-scope-an-mvp"],
    ["/careers", "/collaborate"],
    ["/careers?role=general", "/collaborate?role=general"],
    ["/rss.xml", "/journal/rss.xml"],
  ];
  for (const [from, to] of cases) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(308);
    expect(response.headers().location, from).toBe(to);
  }
});

test("robots, sitemap, feed, manifest and health endpoints", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /api");
  expect(robots).toContain("Disallow: /pay");
  expect(robots).toContain("Sitemap:");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("<lastmod>");
  expect(sitemap).toContain("/approach<");
  expect(sitemap).toContain("/collaborate<");
  expect(sitemap).not.toContain("/pay<");
  expect(sitemap).not.toMatch(/why-me|insights|careers|journal/);
  const feed = await request.get("/journal/rss.xml");
  expect(feed.status()).toBe(200);
  expect(await feed.text()).toContain("<rss");
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.theme_color).toBe("#0A0A12");
  const health = await request.get("/api/health");
  expect(health.status()).toBe(200);
  expect((await health.json()).status).toBe("ok");
});
