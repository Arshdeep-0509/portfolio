import { test as base, expect, type APIRequestContext } from "@playwright/test";

/**
 * `test` with the cookie banner already answered (analytics rejected), and the announcement popup
 * marked as seen and the opening preloader switched off, so none of them covers what a spec is
 * testing.
 * cookie-consent.spec.ts uses the plain Playwright `test` to exercise the banner itself.
 */
export const test = base.extend({
  // The second argument is Playwright's fixture callback (named `use` in its docs).
  context: async ({ context, baseURL }, provide) => {
    await context.addCookies([
      {
        name: "consent",
        value: encodeURIComponent(
          JSON.stringify({ v: 1, ts: 1, analytics: false, marketing: false }),
        ),
        url: baseURL!,
      },
    ]);
    await context.addInitScript(() => {
      const getItem = Storage.prototype.getItem;
      Storage.prototype.getItem = function (key: string) {
        if (key === "preloader-off") return "1";
        return key.startsWith("announcement-seen:") ? "seen" : getItem.call(this, key);
      };
    });
    await provide(context);
  },
});

export { expect };

/** Every indexable path from the sitemap, plus noindex routes worth checking. */
export async function siteRoutes(request: APIRequestContext) {
  const xml = await (await request.get("/sitemap.xml")).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname,
  );
  return [...paths, "/pay"];
}
