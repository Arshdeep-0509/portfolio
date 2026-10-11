import { expect, test } from "./fixtures";

test.describe("contact form", () => {
  test("shows validation errors and focuses the first invalid field", async ({ page }) => {
    let posted = false;
    await page.route("**/api/contact", (route) => {
      posted = true;
      return route.fulfill({ json: { ok: true } });
    });
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.locator("#contact-name-error")).toHaveText("Please enter your full name.");
    await expect(page.locator("#contact-email-error")).toBeVisible();
    await expect(page.locator("#contact-consent-error")).toContainText("Privacy Policy");
    await expect(page.locator("#contact-name")).toBeFocused();
    await expect(page.locator("#contact-name")).toHaveAttribute("aria-invalid", "true");
    expect(posted).toBe(false);
  });

  test("happy path (API mocked) shows the success state", async ({ page }) => {
    let body: Record<string, unknown> = {};
    await page.route("**/api/contact", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({ json: { ok: true } });
    });
    await page.goto("/contact?service=devops-cloud");
    await expect(page.locator("#contact-service")).toHaveValue("devops");
    await page.locator("#contact-name").fill("Priya Sharma");
    await page.locator("#contact-email").fill("priya@example.com");
    await page.locator("#contact-phone").fill("98765 43210");
    await page
      .locator("#contact-message")
      .fill("I need help moving our app to AWS with CI/CD and monitoring.");
    await page.locator("#contact-consent").check();
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("heading", { name: /Thanks, Priya!/ })).toBeVisible();
    expect(body).toMatchObject({
      name: "Priya Sharma",
      service: "devops",
      phoneCountry: "+91",
      consent: true,
    });
    expect(body.startedAt).toBeGreaterThan(0);
  });
});

test.describe("careers application", () => {
  test("rejects non-PDF and oversized resumes in the browser", async ({ page }) => {
    await page.goto("/careers#apply");
    const input = page.locator("#apply-resume");
    await input.setInputFiles({
      name: "resume.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("hello"),
    });
    await expect(page.locator("#apply-resume-error")).toContainText("must be a PDF");
    await input.setInputFiles({
      name: "big.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.concat([Buffer.from("%PDF-1.4\n"), Buffer.alloc(6 * 1024 * 1024)]),
    });
    await expect(page.locator("#apply-resume-error")).toContainText("5 MB or smaller");
    await input.setInputFiles({
      name: "resume.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4\n%%EOF"),
    });
    await expect(page.locator("#apply-resume-error")).toHaveCount(0);
  });
});
