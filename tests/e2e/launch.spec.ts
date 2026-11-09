import { expect, siteRoutes, test } from "./fixtures";

const ORIGIN = "https://polestride.com";

test.describe("domain redirects", () => {
  for (const host of ["www.polestride.com", "portfolio-4xrz.vercel.app"]) {
    test(`${host} moves to the apex with a 301, keeping path and query`, async ({ request }) => {
      const response = await request.get("/services/mvp-development?ref=x", {
        headers: { host },
        maxRedirects: 0,
      });
      expect(response.status()).toBe(301);
      expect(response.headers().location).toBe(`${ORIGIN}/services/mvp-development?ref=x`);
    });
  }

  test("other hosts, such as preview deployments, are left alone", async ({ request }) => {
    const response = await request.get("/about", {
      headers: { host: "portfolio-git-feature-arshdeep.vercel.app" },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(200);
  });
});

test.describe("no trailing slashes", () => {
  test("a trailing slash redirects to the clean URL", async ({ request }) => {
    const response = await request.get("/services/mvp-development/?ref=x", { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe("/services/mvp-development?ref=x");
  });

  test("every link, canonical and sitemap entry already matches", async ({ page, request }) => {
    test.slow();
    const xml = await (await request.get("/sitemap.xml")).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]!);
    expect(locs.length).toBeGreaterThan(10);
    expect(locs.filter((loc) => loc.endsWith("/"))).toEqual([]);

    for (const route of await siteRoutes(request)) {
      await page.goto(route);
      const { hrefs, canonical } = await page.evaluate(() => ({
        hrefs: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")!),
        canonical: document.querySelector("link[rel='canonical']")?.getAttribute("href"),
      }));
      const slashed = hrefs.filter(
        (href) =>
          href !== "/" &&
          !href.startsWith("/#") &&
          (href.startsWith("/") || href.startsWith(ORIGIN)) &&
          /\/([?#]|$)/.test(href),
      );
      expect(slashed, route).toEqual([]);
      expect(canonical, route).toBe(route === "/" ? ORIGIN : `${ORIGIN}${route}`);
    }
  });
});

test("security headers are sent", async ({ request }) => {
  const headers = (await request.get("/")).headers();
  expect(headers["strict-transport-security"]).toContain("max-age=");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  for (const feature of ["camera=()", "microphone=()", "geolocation=()"]) {
    expect(headers["permissions-policy"]).toContain(feature);
  }
  const csp = headers["content-security-policy"]!;
  for (const origin of [
    "https://www.googletagmanager.com",
    "https://*.clarity.ms",
    "https://challenges.cloudflare.com",
    "https://calendly.com",
    "https://*.razorpay.com",
  ]) {
    expect(csp).toContain(origin);
  }
  expect(csp).toContain("frame-ancestors 'none'");
});

test("a production build doesn't ask to be left out of search", async ({ request }) => {
  expect((await request.get("/")).headers()["x-robots-tag"]).toBeUndefined();
});

test("the content security policy blocks nothing the site uses", async ({ page }) => {
  const blocked: string[] = [];
  page.on("console", (message) => {
    if (/Content Security Policy/i.test(message.text())) blocked.push(message.text());
  });
  for (const route of ["/", "/contact", "/work/ima-banjara-hills", "/pay"]) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
  }
  expect(blocked).toEqual([]);
});
