import { expect, siteRoutes, test } from "./fixtures";

const ORIGIN = "https://polestride.com";

const metaTags = (html: string) => {
  const tags: Record<string, string> = {};
  for (const [, name, content] of html.matchAll(
    /<meta (?:property|name)="((?:og|twitter):[^"]+)" content="([^"]*)"/g,
  )) {
    tags[name!] ??= content!.replace(/&amp;/g, "&");
  }
  return tags;
};

test("every page shares absolute polestride.com URLs and the full set of tags", async ({
  request,
}) => {
  test.slow();
  for (const route of await siteRoutes(request)) {
    const html = await (await request.get(route)).text();
    const tags = metaTags(html);
    expect(tags["og:url"], route).toBe(route === "/" ? ORIGIN : `${ORIGIN}${route}`);
    expect(tags["og:site_name"], route).toBe("Polestride");
    expect(tags["og:locale"], route).toBe("en_IN");
    expect(tags["og:type"], route).toMatch(/^(website|article)$/);
    expect(tags["og:title"], route).toBeTruthy();
    expect(tags["og:description"], route).toBeTruthy();
    expect(tags["twitter:card"], route).toBe("summary_large_image");
    expect(tags["og:image"], route).toMatch(/^https:\/\/polestride\.com\//);
    expect(tags["twitter:image"], route).toMatch(/^https:\/\/polestride\.com\//);
    expect(Object.values(tags).join(" "), route).not.toMatch(/localhost|127\.0\.0\.1/);
  }
});

test("every share image is a real 1200×630 PNG", async ({ request }) => {
  test.slow();
  for (const route of await siteRoutes(request)) {
    const tags = metaTags(await (await request.get(route)).text());
    for (const url of [tags["og:image"]!, tags["twitter:image"]!]) {
      const response = await request.get(url.replace(ORIGIN, ""));
      expect(response.status(), url).toBe(200);
      expect(response.headers()["content-type"], url).toBe("image/png");
      const png = await response.body();
      expect([png.readUInt32BE(16), png.readUInt32BE(20)], url).toEqual([1200, 630]);
    }
  }
});

test("services and case studies get their own image and alt text", async ({ request }) => {
  const service = metaTags(await (await request.get("/services/mvp-development")).text());
  expect(service["og:image:alt"]).toBe("MVP Development — Polestride");
  expect(service["og:image"]).toContain("/services/mvp-development/opengraph-image");
  expect(service["twitter:image"]).toContain("/services/mvp-development/opengraph-image");

  const study = metaTags(await (await request.get("/work/ima-banjara-hills")).text());
  expect(study["og:image:alt"]).toBe("IMA Banjara Hills Website — Polestride");
  expect(study["og:image"]).toContain("/work/ima-banjara-hills/opengraph-image");
  expect(study["og:type"]).toBe("article");
});

test("the default card's alt text describes the brand, not the page", async ({ request }) => {
  const about = metaTags(await (await request.get("/about")).text());
  expect(about["og:image:alt"]).toBe("Polestride — Business automation that frees you to grow.");
});

test("the email signature is served, with a logo Gmail can show", async ({ request }) => {
  const response = await request.get("/brand/polestride-email-signature.html");
  expect(response.status()).toBe(200);
  const html = await response.text();
  for (const text of ["Arshdeep Singh", "Founder &amp; lead engineer", "+91 8284031374"]) {
    expect(html).toContain(text);
  }
  const logo = html.match(/<img[^>]*src="https:\/\/polestride\.com([^"]+\.png)"/)?.[1];
  expect(logo).toBeTruthy();
  expect((await request.get(logo!)).status()).toBe(200);
});
