import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/** Rectangles of the actual lines of text in the hero and header, not their boxes. */
const textRects = `(() => {
  const nodes = [...document.querySelectorAll("header a, header button, section[aria-labelledby='home-title'] :is(h1, p, a, li)")]
    .filter((el) => !el.closest("figure"));
  return nodes.flatMap((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return [...range.getClientRects()].filter((r) => r.width > 0);
  }).map((r) => ({ left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
})()`;

async function collisions(page: Page) {
  return page.evaluate(`(() => {
    const rects = ${textRects};
    const inside = (x, y) => rects.some((r) => x >= r.left - 2 && x <= r.right + 2 && y >= r.top - 2 && y <= r.bottom + 2);
    const stars = [...document.querySelectorAll(".hero-star")]
      .map((star) => star.getBoundingClientRect())
      .filter((box) => box.width > 0)
      .map((box) => [box.left + box.width / 2, box.top + box.height / 2]);
    const line = document.querySelector("path[mask='url(#bearing-reveal)']");
    const points = [];
    if (line && line.getBoundingClientRect().width > 0) {
      const matrix = line.getScreenCTM();
      const length = line.getTotalLength();
      for (let at = 0; at <= length; at += 1) {
        const point = line.getPointAtLength(at).matrixTransform(matrix);
        points.push([point.x, point.y]);
      }
    }
    return {
      stars: stars.length,
      starHits: stars.filter(([x, y]) => inside(x, y)).length,
      lineHits: points.filter(([x, y]) => inside(x, y)).length,
      linePoints: points.length,
    };
  })()`) as Promise<{ stars: number; starHits: number; lineHits: number; linePoints: number }>;
}

for (const [width, height] of [
  [320, 640],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1280, 800],
  [1440, 900],
  [1920, 1080],
]) {
  test(`no star or bearing line touches text at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width: width!, height: height! });
    await page.goto("/");
    const result = await collisions(page);
    expect(result.stars).toBeGreaterThan(0);
    expect(result.starHits).toBe(0);
    expect(result.lineHits).toBe(0);
    if (width! >= 1024) {
      expect(result.stars).toBeGreaterThanOrEqual(40);
      expect(result.stars).toBeLessThanOrEqual(60);
      expect(result.linePoints).toBeGreaterThan(0);
    }
  });
}

test("the moment plays on the first view of a session only", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-sky", "play");
  await page.reload();
  await expect(page.locator("html")).not.toHaveAttribute("data-sky", "play");
  await expect(page.locator(".hero-polaris")).toHaveCSS("opacity", "1");
});

test("the moment finishes inside 1.6 seconds", async ({ page }) => {
  await page.goto("/");
  // Read from the CSS, so this doesn't depend on catching the animation mid-flight.
  const end = await page.evaluate(() => {
    const seconds = (value: string) => parseFloat(value) * (value.endsWith("ms") ? 0.001 : 1);
    return Math.max(
      ...[".hero-sky", ".hero-polaris", ".hero-bearing-draw"].map((selector) => {
        const style = getComputedStyle(document.querySelector(selector)!);
        return seconds(style.animationDelay) + seconds(style.animationDuration);
      }),
    );
  });
  expect(end).toBeGreaterThan(1);
  expect(end).toBeLessThan(1.6);
});

test("arriving from another page shows the final state", async ({ page }) => {
  await page.goto("/about");
  await page.locator('header a[aria-label="Polestride home"]').first().click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-sky", "play");
  await expect(page.locator(".hero-polaris")).toHaveCSS("opacity", "1");
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("renders the final state with no animation", async ({ page }) => {
    await page.goto("/");
    const running = await page.evaluate(
      () =>
        document.getAnimations().filter((animation) => {
          const target = (animation.effect as KeyframeEffect | null)?.target;
          return target?.matches(".hero-sky, .hero-polaris, .hero-bearing-draw, .log-caret");
        }).length,
    );
    expect(running).toBe(0);
    await expect(page.locator(".hero-polaris")).toHaveCSS("opacity", "1");
  });
});

test("the headline has no entrance animation and hydrates cleanly", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const animations = await page
    .locator("h1")
    .evaluate((element) => element.getAnimations({ subtree: true }).length);
  expect(animations).toBe(0);
  expect(errors.filter((text) => /hydrat/i.test(text))).toEqual([]);
});

test("the build log is a dark panel in the light theme, with its text intact", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const log = page.locator("figure[data-theme='dark']").first();
  await expect(log).toContainText("your-product / build.log");
  for (const line of [
    "→ scope agreed",
    "→ prototype approved",
    "→ sprint demo shipped",
    "→ tests passing",
    "→ live in production",
  ]) {
    await expect(log).toContainText(line);
  }
  await expect(log.getByText("ok", { exact: true }).first()).toHaveCSS(
    "color",
    "rgb(95, 212, 194)",
  );
  await expect(log.locator(".log-caret")).toHaveCSS("background-color", "rgb(232, 184, 74)");
});
