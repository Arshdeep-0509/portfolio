import { test as plainTest } from "@playwright/test";
import { expect, hydrated, test } from "./fixtures";

test("the skip link is the first stop and moves focus to the content", async ({
  page,
  browserName,
}) => {
  test.skip(browserName === "webkit", "Safari only tabs to links when the visitor turns that on");
  await page.goto("/about");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: /skip/i });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test.describe("desktop navigation", () => {
  test.skip(({ isMobile }) => isMobile, "desktop navigation");

  test("the mega menu works from the keyboard alone", async ({ page }) => {
    await page.goto("/about");
    const trigger = page.getByRole("button", { name: "Services" }).first();
    await trigger.focus();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();

    await page.keyboard.press("ArrowDown");
    const links = page.locator("#services-menu [data-service]");
    await expect(links.first()).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(links.nth(1)).toBeFocused();
    await page.keyboard.press("End");
    await expect(links.last()).toBeFocused();
    await page.keyboard.press("Home");
    await expect(links.first()).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/services\/mvp-development$/);
  });

  test("the menu closes when focus moves out of it", async ({ page }) => {
    await page.goto("/about");
    const trigger = page.getByRole("button", { name: "Services" }).first();
    await trigger.focus();
    await page.keyboard.press("Enter");
    await page.getByRole("link", { name: "Work", exact: true }).first().focus();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("opens on a tap, first time and every time", async ({ page, isMobile }) => {
    test.skip(!isMobile, "touch");
    await page.goto("/about");
    const dialog = page.getByRole("dialog");
    for (let round = 0; round < 3; round++) {
      await page.getByRole("button", { name: "Menu" }).tap();
      await expect(dialog).toBeVisible();
      await dialog.getByRole("button", { name: "Close" }).tap();
      await expect(dialog).toBeHidden();
    }
  });

  test("opens, traps focus, closes on Esc and hands focus back", async ({ page }) => {
    await page.goto("/about");
    const opener = page.getByRole("button", { name: "Menu" });
    await opener.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    for (let stop = 0; stop < 30; stop++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(
        () =>
          document.activeElement?.closest("dialog") !== null ||
          document.activeElement === document.body,
      );
      expect(inside, `Tab ${stop} left the dialog`).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test("a link inside it can be reached and followed", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("button", { name: "Menu" }).focus();
    await page.keyboard.press("Enter");
    const link = page.getByRole("dialog").getByRole("link", { name: "Work", exact: true });
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/work$/);
  });
});

test("the FAQ works from the keyboard alone", async ({ page }) => {
  await page.goto("/");
  const triggers = page.locator("section[aria-labelledby='faq-title'] button[aria-expanded]");
  await triggers.first().focus();
  await page.keyboard.press("ArrowDown");
  await expect(triggers.nth(1)).toBeFocused();
  await page.keyboard.press("Space");
  await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "true");
  await expect(triggers.first()).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("End");
  await expect(triggers.last()).toBeFocused();
  await page.keyboard.press("Home");
  await expect(triggers.first()).toBeFocused();
});

test("the quick form can be completed and sent from the keyboard", async ({ page }) => {
  await page.route("**/api/contact", (route) => route.fulfill({ json: { ok: true } }));
  await page.goto("/services");
  await page.locator("#quick-start-title").scrollIntoViewIfNeeded();
  await page.locator("#quick-name").focus();
  await page.keyboard.type("Ravi Kumar");
  await page.keyboard.press("Tab");
  await page.keyboard.type("ravi@example.com");
  await page.keyboard.press("Tab");
  await page.keyboard.type("A delivery tracker for our shop");
  await page.keyboard.press("Tab");
  await expect(page.locator("#quick-consent")).toBeFocused();
  await page.keyboard.press("Space");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: /^Sent\./ })).toBeFocused();
});

test("the contact wizard can be completed from the keyboard", async ({ page }) => {
  await page.route("**/api/contact", (route) => route.fulfill({ json: { ok: true } }));
  await page.goto("/contact");
  await hydrated(page, "#contact-service-0");
  await page.locator("#contact-service-0").focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#contact-service-0")).toBeChecked();

  const form = page.getByRole("form", { name: "Project enquiry" });
  await form.getByRole("button", { name: "Next" }).focus();
  await page.keyboard.press("Enter");
  await expect(form.getByRole("heading", { name: "About the project" })).toBeFocused();

  await page.locator("#contact-message").focus();
  await page.keyboard.type("We want a support assistant that answers from our help centre.");
  await form.getByRole("button", { name: "Next" }).focus();
  await page.keyboard.press("Enter");

  await page.locator("#contact-name").focus();
  await page.keyboard.type("Priya Sharma");
  await page.keyboard.press("Tab");
  await page.keyboard.type("priya@example.com");
  await page.locator("#contact-phone").focus();
  await page.keyboard.type("98765 43210");
  await page.locator("#contact-consent").focus();
  await page.keyboard.press("Space");
  await form.getByRole("button", { name: "Send it over" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: /^Sent\./ })).toBeFocused();
});

test("the newsletter can be used from the keyboard", async ({ page }) => {
  await page.route("**/api/newsletter", (route) => route.fulfill({ json: { ok: true } }));
  await page.goto("/services");
  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();
  await footer.getByLabel("Your email").focus();
  await page.keyboard.type("me@example.com");
  await page.keyboard.press("Enter");
  await expect(footer.getByText("The next note will land in your inbox.")).toBeVisible();
});

plainTest("the cookie banner can be answered from the keyboard", async ({ page }) => {
  await page.goto("/about");
  const banner = page.getByRole("region", { name: /Cookies/ });
  await expect(banner).toBeVisible();
  const allow = banner.getByRole("button", { name: "Allow all" });
  await allow.focus();
  await page.keyboard.press("Tab");
  await expect(banner.getByRole("button", { name: "Essential only" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(banner).toBeHidden();
});

for (const route of ["/", "/contact", "/services/mvp-development", "/about"]) {
  test(`every keyboard stop on ${route} shows a 2px ring`, async ({ page }) => {
    await page.goto(route);
    const missing = new Set<string>();
    let previous = "";
    for (let stop = 0; stop < 70; stop++) {
      await page.keyboard.press("Tab");
      const result = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return { key: "", bad: null };
        // Hidden inputs show focus on the visible control beside or around them.
        const visible = el.matches("input.sr-only") ? el.closest("label")! : el;
        const peer = el.matches("input.peer") ? el.nextElementSibling : null;
        const ring = [visible, peer].some(
          (node) => node && parseFloat(getComputedStyle(node).outlineWidth) >= 2,
        );
        const key = `${el.tagName}#${el.id}:${(el.textContent ?? "").slice(0, 24)}`;
        return { key, bad: ring ? null : key };
      });
      if (result.bad) missing.add(result.bad);
      if (result.key && result.key === previous) break;
      previous = result.key;
    }
    expect([...missing]).toEqual([]);
  });
}

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  for (const route of ["/", "/services", "/about", "/contact"]) {
    test(`nothing moves on ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForTimeout(300);
      const moving = await page.evaluate(() =>
        document.getAnimations().flatMap((animation) => {
          if (animation.playState !== "running") return [];
          const effect = animation.effect as KeyframeEffect | null;
          const props = effect?.getKeyframes().flatMap((frame) => Object.keys(frame)) ?? [];
          const motion = props.some((p) => /transform|translate|scale|rotate|left|top/i.test(p));
          return motion
            ? [(effect?.target as Element | null)?.className?.toString().slice(0, 40)]
            : [];
        }),
      );
      expect(moving).toEqual([]);
    });
  }

  test("the accordion opens without animating", async ({ page }) => {
    await page.goto("/");
    const trigger = page
      .locator("section[aria-labelledby='faq-title'] button[aria-expanded]")
      .nth(1);
    await trigger.click();
    const panel = page.locator(`[id="${await trigger.getAttribute("aria-controls")}"]`);
    // The site's reduced-motion rule sets a near-zero duration rather than none.
    const seconds = await panel.evaluate((el) =>
      parseFloat(getComputedStyle(el).transitionDuration),
    );
    expect(seconds).toBeLessThan(0.001);
  });
});
