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

  test("header is transparent over a night hero and solid after scrolling", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header.site-header");
    await expect(header).not.toHaveAttribute("data-solid", "");
    await page.mouse.wheel(0, 400);
    await expect(header).toHaveAttribute("data-solid", "");
  });

  test("services menu previews the focused service and closes with Escape", async ({ page }) => {
    await page.goto("/about");
    const trigger = page
      .getByRole("navigation", { name: "Main" })
      .getByRole("button", { name: "Services" });
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panel = page.locator("#services-menu");
    await expect(panel.locator("[data-service]").first()).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(
      panel.getByText("Interface, APIs, database and hosting, handled by one engineer."),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
    await trigger.click();
    await panel.getByRole("link", { name: /UI \(User Interface\) Design/ }).click();
    await expect(page).toHaveURL(/\/services\/ui-design$/);
  });

  test("service index fills the preview panel on hover", async ({ page }) => {
    await page.goto("/services");
    const preview = page.getByRole("complementary", { name: "Preview" });
    await page
      .locator("#service-index")
      .getByRole("link", { name: /DevOps & Cloud/ })
      .first()
      .hover();
    await expect(preview).toContainText("DevOps & Cloud");
    await expect(preview).toContainText("2–6 weeks");
  });
});

test.describe("mobile menu", () => {
  test.skip(({ isMobile }) => !isMobile, "Mobile navigation only");

  test("opens full screen, expands Services, navigates and closes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    const menu = page.getByRole("dialog", { name: "Site menu" });
    await expect(menu).toBeVisible();
    const services = menu.getByRole("button", { name: /Services/ });
    await services.click();
    await expect(services).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await page.getByRole("button", { name: "Menu" }).click();
    await menu.getByRole("link", { name: "About", exact: true }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(menu).toBeHidden();
  });

  test("no page scrolls sideways at phone width", async ({ page }) => {
    for (const path of ["/", "/services", "/approach", "/contact", "/collaborate", "/pay"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
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

test("contact dock opens its links and is absent on /contact", async ({ page }) => {
  await page.goto("/work");
  // The toggle's visible name switches between "Contact" and "Close".
  await page.getByRole("button", { name: "Contact", exact: true }).click();
  const close = page.getByRole("button", { name: "Close", exact: true });
  await expect(close).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: "Book a free call" }).last()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Contact", exact: true })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await page.goto("/contact");
  await expect(page.getByRole("button", { name: "Contact", exact: true })).toHaveCount(0);
});
