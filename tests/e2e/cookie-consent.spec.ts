import { expect, test, type Page } from "@playwright/test";

// Plain Playwright `test`: no pre-answered consent, so the banner appears.
const THIRD_PARTY = /google-analytics\.com|googletagmanager\.com|clarity\.ms|doubleclick\.net/;

async function consentCookie(page: Page) {
  const cookie = (await page.context().cookies()).find((c) => c.name === "consent");
  return cookie ? JSON.parse(decodeURIComponent(cookie.value)) : null;
}

test("reject: choice stored, banner gone, no analytics requests", async ({ page }) => {
  const thirdParty: string[] = [];
  await page.route(THIRD_PARTY, (route) => {
    thirdParty.push(route.request().url());
    return route.abort();
  });
  await page.goto("/");
  const banner = page.getByRole("region", { name: /Cookies/ });
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: /^Reject/ }).click();
  await expect(banner).toBeHidden();
  expect(await consentCookie(page)).toMatchObject({ v: 1, analytics: false, marketing: false });
  await page.goto("/services");
  await expect(page.getByRole("region", { name: /Cookies/ })).toBeHidden();
  expect(thirdParty).toEqual([]);
});

test("accept: choice stored, and the footer reopens the settings", async ({ page }) => {
  await page.route(THIRD_PARTY, (route) => route.abort());
  await page.goto("/");
  await page
    .getByRole("region", { name: /Cookies/ })
    .getByRole("button", { name: "Accept all" })
    .click();
  await expect.poll(() => consentCookie(page)).toMatchObject({ analytics: true, marketing: true });
  await page.getByRole("contentinfo").getByRole("button", { name: "Cookie settings" }).click();
  const dialog = page.getByRole("dialog", { name: "Cookie settings" });
  await expect(dialog).toBeVisible();
  const analytics = dialog.getByRole("switch", { name: "Analytics" });
  await expect(analytics).toHaveAttribute("aria-checked", "true");
  await analytics.click();
  await dialog.getByRole("button", { name: "Save choices" }).click();
  await expect.poll(() => consentCookie(page)).toMatchObject({ analytics: false });
});
