import { expect, test } from "@playwright/test";

// Uses the plain Playwright `test`: the shared fixture switches the preloader off.
test.describe("opening preloader", () => {
  test("plays on load without blocking the page underneath", async ({ page, isMobile }) => {
    await page.goto("/");
    const preloader = page.locator(".preloader");
    await expect(preloader).toBeVisible();
    await expect(preloader).toHaveAttribute("aria-hidden", "true");
    await expect(preloader.locator(".preloader-name")).toHaveText("Arshdeep Singh");
    await expect(preloader.locator(".preloader-tagline")).toHaveText(
      "Business automation that frees you to grow.",
    );

    // Links underneath still work while it plays.
    if (isMobile) {
      await page.getByRole("button", { name: "Menu" }).click();
      await page
        .getByRole("dialog", { name: "Site menu" })
        .getByRole("link", { name: "Work", exact: true })
        .click();
    } else {
      await page.locator('header a[href="/work"]').first().click();
    }
    await expect(page).toHaveURL(/\/work$/);
  });

  test("plays again on a reload, then hides itself", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator(".preloader")).toBeHidden({ timeout: 8_000 });
    await page.reload();
    await expect(page.locator(".preloader")).toBeVisible();
    await expect(page.locator(".preloader")).toBeHidden({ timeout: 8_000 });
  });

  test("holds still, then fades, for visitors who prefer reduced motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(test.info().project.use.baseURL + "/");
    await expect(page.locator(".preloader-name span").first()).toHaveCSS("opacity", "1");
    await expect(page.locator(".preloader")).toBeHidden({ timeout: 6_000 });
    await context.close();
  });
});
