import { expect, siteRoutes, test } from "./fixtures";

const TAGLINE = "Business automation that frees you to grow.";

test("every page has one h1 first, no skipped heading levels, and a breadcrumb at depth 2", async ({
  page,
  request,
}) => {
  test.slow();
  for (const route of await siteRoutes(request)) {
    await page.goto(route);
    const { levels, crumb } = await page.evaluate(() => ({
      levels: [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")]
        .filter((el) => el.checkVisibility())
        .map((el) => Number(el.tagName[1])),
      crumb: document.querySelector("nav[aria-label='Breadcrumb']")?.checkVisibility() ?? false,
    }));
    expect(levels.filter((level) => level === 1).length, route).toBe(1);
    expect(levels[0], route).toBe(1);
    const skips = levels.filter((level, index) => index > 0 && level > levels[index - 1]! + 1);
    expect(skips, route).toEqual([]);
    if (route.split("/").filter(Boolean).length >= 2) expect(crumb, route).toBe(true);
  }
});

test("a service page has the shared header, star path, checklist and closing CTA", async ({
  page,
}) => {
  await page.goto("/services/mvp-development");
  const crumb = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(crumb).toContainText("Home");
  await expect(crumb).toContainText("Services");
  await expect(crumb).toContainText("MVP");

  const receive = page.locator("section[aria-labelledby='deliverables'] ul li");
  await expect(receive.first().locator("svg")).toBeVisible();
  expect(await receive.count()).toBe(await receive.locator("svg").count());

  const steps = page.locator("section[aria-labelledby='process'] ol > li");
  await expect(steps.first().locator("svg")).toBeVisible();
  await expect(steps.last().locator(".star-path")).toHaveCount(0);

  const closing = page.locator("section[aria-labelledby='service-closing']");
  await expect(closing.getByRole("link", { name: "Discuss this service" })).toHaveAttribute(
    "href",
    "/contact?service=mvp-development",
  );
});

test("/about opens with Why Polestride, above the founder", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Why Polestride");
  const hero = page.locator("section[aria-labelledby='about-title']");
  await expect(hero.locator("p").last()).toHaveText(TAGLINE);
  await expect(hero.locator("p")).toHaveCount(3);

  const founder = page.locator("#founder");
  await expect(founder.locator("p").first()).toContainText(
    "Polestride was founded by Arshdeep Singh",
  );
  const [heroBox, founderBox] = [await hero.boundingBox(), await founder.boundingBox()];
  expect(heroBox!.y).toBeLessThan(founderBox!.y);
});

test("the 404 page has the agreed words, two ways out and a star", async ({ page }) => {
  const response = await page.goto("/nowhere-on-the-chart");
  expect(response?.status()).toBe(404);
  const section = page.locator("section[aria-labelledby='not-found-title']");
  await expect(section.getByRole("heading", { level: 1 })).toHaveText("This page is off the map.");
  await expect(
    section.getByText("Head back to the homepage or tell us what you were looking for."),
  ).toBeVisible();
  await expect(section.getByRole("link", { name: "Home", exact: true })).toHaveAttribute(
    "href",
    "/",
  );
  await expect(section.getByRole("link", { name: "Contact", exact: true })).toHaveAttribute(
    "href",
    "/contact",
  );
  await expect(section.locator("svg.hero-polaris")).toBeVisible();
});

test("real pages are prerendered, not replaced by the loading skeleton", async ({ request }) => {
  for (const route of ["/", "/services/mvp-development", "/about", "/privacy-policy"]) {
    const html = await (await request.get(route)).text();
    expect(html, route).toContain("<h1");
    expect(html, route).not.toContain('aria-label="Loading"');
  }
});
