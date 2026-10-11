import { describe, expect, it } from "vitest";
import {
  careerApplicationSchema,
  normalizeUrl,
  RESUME_MAX_BYTES,
} from "@/lib/schemas/careerApplication";
import { newsletterSchema } from "@/lib/schemas/newsletter";

const pdf = (bytes = 1024, name = "resume.pdf", type = "application/pdf") =>
  new File([new Uint8Array(bytes)], name, { type });

const valid = {
  name: "Rahul Verma",
  email: "rahul@example.com",
  phone: "+91 98765 43210",
  role: "general",
  experience: "1–3 years",
  portfolio: "github.com/rahul",
  linkedin: "",
  resume: pdf(),
  availability: "Immediately",
  message: "I love building accessible React interfaces and want to work on real products.",
  consent: true,
  website: "",
} as const;

describe("careerApplicationSchema", () => {
  it("accepts a valid application (portfolio link without https://)", () => {
    expect(careerApplicationSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a resume that isn't a PDF", () => {
    const result = careerApplicationSchema.safeParse({
      ...valid,
      resume: pdf(1024, "resume.docx", "application/vnd.openxmlformats-officedocument"),
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(/PDF/);
  });

  it("rejects a resume over 5 MB", () => {
    const result = careerApplicationSchema.safeParse({
      ...valid,
      resume: pdf(RESUME_MAX_BYTES + 1),
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(/5 MB/);
  });

  it("requires a resume", () => {
    expect(careerApplicationSchema.safeParse({ ...valid, resume: undefined }).success).toBe(false);
  });

  it("requires a 50-character message and consent", () => {
    expect(careerApplicationSchema.safeParse({ ...valid, message: "short" }).success).toBe(false);
    expect(careerApplicationSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });

  it("rejects malformed links", () => {
    expect(careerApplicationSchema.safeParse({ ...valid, portfolio: "not a link" }).success).toBe(
      false,
    );
  });
});

describe("normalizeUrl", () => {
  it("adds https:// only when the scheme is missing", () => {
    expect(normalizeUrl("github.com/me")).toBe("https://github.com/me");
    expect(normalizeUrl("http://example.com")).toBe("http://example.com");
  });
});

describe("newsletterSchema", () => {
  it("accepts a valid email and trims it", () => {
    const result = newsletterSchema.safeParse({ email: "  me@example.com " });
    expect(result.success && result.data.email).toBe("me@example.com");
  });

  it("rejects empty and invalid emails", () => {
    expect(newsletterSchema.safeParse({ email: "" }).success).toBe(false);
    expect(newsletterSchema.safeParse({ email: "nope" }).success).toBe(false);
  });

  it("accepts a filled honeypot (the API answers bots with a quiet success)", () => {
    expect(newsletterSchema.safeParse({ email: "me@example.com", website: "spam" }).success).toBe(
      true,
    );
  });
});
