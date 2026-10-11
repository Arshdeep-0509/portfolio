import { expect, test } from "./fixtures";

test.describe("header navigation (desktop)", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop navigation only");

  test("main nav links work and mark the current page", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await nav.getByRole("link", { name: "Work" }).click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
  });

  test("mega menu opens, lists services and closes with Escape", async ({ page }) => {
    await page.goto("/");
    const trigger = page
      .getByRole("navigation", { name: "Main" })
      .getByRole("button", { name: "Services" });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const mvp = page.locator('header a[href="/services/mvp-development"]').first();
    await expect(mvp).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
    await trigger.click();
    await mvp.click();
    await expect(page).toHaveURL(/\/services\/mvp-development$/);
  });
});

test.describe("mobile menu", () => {
  test.skip(({ isMobile }) => !isMobile, "Mobile navigation only");

  test("opens, expands Services, navigates and closes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("dialog", { name: "Site menu" });
    await expect(menu).toBeVisible();
    const services = menu.getByRole("button", { name: /Services/ });
    await services.click();
    await expect(services).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await page.getByRole("button", { name: "Open menu" }).click();
    await menu.getByRole("link", { name: "About", exact: true }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(menu).toBeHidden();
  });
});

test("services filter shows only the chosen group", async ({ page }) => {
  await page.goto("/services");
  const section = page.locator("#service-list");
  const cards = section.locator("ul > li");
  await expect(cards).toHaveCount(13);
  await section.getByRole("tab", { name: "Design" }).click();
  await expect(cards).toHaveCount(2);
  await expect(section.getByRole("link", { name: /UX \(User Experience\) Design/ })).toBeVisible();
  await section.getByRole("tab", { name: "All" }).click();
  await expect(cards).toHaveCount(13);
});

test("FAQ accordion expands and collapses", async ({ page }) => {
  await page.goto("/");
  // The first question starts open; use the second, which starts closed.
  const question = page.locator("#faq").getByRole("button").nth(1);
  await question.scrollIntoViewIfNeeded();
  await expect(question).toHaveAttribute("aria-expanded", "false");
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  const panelId = await question.getAttribute("aria-controls");
  await expect(page.locator(`#${panelId}`)).toBeVisible();
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "false");
});
