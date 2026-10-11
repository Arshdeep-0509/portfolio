import { expect, test } from "./fixtures";

test.describe("contact wizard", () => {
  test("validates each step and focuses the first problem", async ({ page }) => {
    let posted = false;
    await page.route("**/api/contact", (route) => {
      posted = true;
      return route.fulfill({ json: { ok: true } });
    });
    await page.goto("/contact");
    const form = page.getByRole("form", { name: "Project enquiry" });

    // Step 1 needs at least one service.
    await form.getByRole("button", { name: "Next" }).click();
    await expect(page.locator("#contact-service-error")).toContainText("Pick at least one option");

    await form.getByText("A first version (MVP)").click();
    await form.getByRole("button", { name: "Next" }).click();

    // Step 2: the message is required.
    await expect(form.getByRole("heading", { name: "About the project" })).toBeFocused();
    await form.getByRole("button", { name: "Next" }).click();
    await expect(page.locator("#contact-message-error")).toBeVisible();
    await expect(page.locator("#contact-message")).toBeFocused();
    await page
      .locator("#contact-message")
      .fill("A booking app for three tuition centres, with a parent view.");
    // The error clears asynchronously and the layout settles; wait before pressing Next.
    await expect(page.locator("#contact-message-error")).toHaveCount(0);
    await form.getByRole("button", { name: "Next" }).click();

    // Step 3: submitting empty shows errors and focuses the name field.
    await form.getByRole("button", { name: "Send it over" }).click();
    await expect(page.locator("#contact-name-error")).toHaveText(
      "Add your name so I know who I'm writing to.",
    );
    await expect(page.locator("#contact-consent-error")).toContainText("Privacy Policy");
    await expect(page.locator("#contact-name")).toBeFocused();
    await expect(page.locator("#contact-name")).toHaveAttribute("aria-invalid", "true");
    expect(posted).toBe(false);
  });

  test("happy path (API mocked): prefill, three steps, review, success", async ({ page }) => {
    let body: Record<string, unknown> = {};
    await page.route("**/api/contact", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({ json: { ok: true } });
    });
    await page.goto("/contact?bundle=ai-upgrade");
    const form = page.getByRole("form", { name: "Project enquiry" });
    await expect(page.locator("#contact-service-4")).toBeChecked(); // AI features
    await expect(page.locator("#contact-service-5")).toBeChecked(); // DevOps
    await form.getByRole("button", { name: "Next" }).click();

    await form.getByText("1–3 months").click();
    await page
      .locator("#contact-message")
      .fill(
        "We want a support assistant that answers from our help centre and hands off to staff.",
      );
    await form.getByRole("button", { name: "Next" }).click();

    await page.locator("#contact-name").fill("Priya Sharma");
    await page.locator("#contact-email").fill("priya@example.com");
    await page.locator("#contact-phone").fill("98765 43210");
    await page.locator("#contact-consent").check();
    await expect(form.getByText("Your answers")).toBeVisible();
    await form.getByRole("button", { name: "Send it over" }).click();

    await expect(page.getByRole("heading", { name: /Thank you, Priya/ })).toBeVisible();
    expect(body).toMatchObject({
      name: "Priya Sharma",
      service: "ai",
      timeline: "1-3-months",
      phoneCountry: "+91",
      consent: true,
    });
    expect(String(body.message)).toContain("Also interested in:");
    expect(body.startedAt).toBeGreaterThan(0);
  });
});

test.describe("quick start", () => {
  test("sends a quick enquiry without a phone number", async ({ page }) => {
    let body: Record<string, unknown> = {};
    await page.route("**/api/contact", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({ json: { ok: true } });
    });
    await page.goto("/services");
    const form = page.getByRole("form", { name: "Quick enquiry" });
    await form.scrollIntoViewIfNeeded();
    await form.getByLabel(/Your name/).fill("Ravi Kumar");
    await form.getByLabel(/^Email/).fill("ravi@example.com");
    await form.getByLabel(/The idea, in one line/).fill("A delivery tracker for our shop");
    await form.getByRole("checkbox").check();
    await form.getByRole("button", { name: "Send it over" }).click();
    await expect(page.getByRole("heading", { name: /Thank you, Ravi/ })).toBeVisible();
    expect(body).toMatchObject({ service: "quick", phone: "", name: "Ravi Kumar" });
  });

  test("is not shown on /contact", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("form", { name: "Quick enquiry" })).toHaveCount(0);
  });
});

test.describe("collaborate application", () => {
  test("rejects non-PDF and oversized resumes in the browser", async ({ page }) => {
    await page.goto("/collaborate#apply");
    const input = page.locator("#apply-resume");
    await input.setInputFiles({
      name: "resume.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("hello"),
    });
    await expect(page.locator("#apply-resume-error")).toContainText("needs to be a PDF");
    await input.setInputFiles({
      name: "big.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.concat([Buffer.from("%PDF-1.4\n"), Buffer.alloc(6 * 1024 * 1024)]),
    });
    await expect(page.locator("#apply-resume-error")).toContainText("5 MB or less");
    await input.setInputFiles({
      name: "resume.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4\n%%EOF"),
    });
    await expect(page.locator("#apply-resume-error")).toHaveCount(0);
  });

  test("stops on step one until the required fields are valid", async ({ page }) => {
    await page.goto("/collaborate#apply");
    const form = page.getByRole("form", { name: "Application" });
    await form.getByRole("button", { name: "Next" }).click();
    await expect(page.locator("#apply-name-error")).toBeVisible();
    await expect(page.locator("#apply-name")).toBeFocused();
    await expect(form.getByText("Step 01 of 03")).toBeVisible();
  });
});
