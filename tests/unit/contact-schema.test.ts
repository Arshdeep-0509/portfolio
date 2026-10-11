import { describe, expect, it } from "vitest";
import {
  budgetLabel,
  contactFormSchema,
  contactRequestSchema,
  serviceFromQuery,
} from "@/lib/schemas/contact";

const valid = {
  name: "Priya Sharma",
  email: "priya@example.com",
  phoneCountry: "+91",
  phone: "98765 43210",
  company: "",
  service: "mvp",
  budgetCurrency: "INR",
  budget: "1.5l-5l",
  timeline: "1-3-months",
  message: "I want to build a booking app for my coaching centres.",
  heardFrom: "",
  nda: false,
  consent: true,
  website: "",
} as const;

describe("contactFormSchema", () => {
  it("accepts a complete, valid enquiry", () => {
    expect(contactFormSchema.safeParse(valid).success).toBe(true);
  });

  it("trims and requires the name", () => {
    const result = contactFormSchema.safeParse({ ...valid, name: "  " });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["name"]);
  });

  it("rejects an invalid email", () => {
    expect(contactFormSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("requires a message of at least 30 characters", () => {
    const result = contactFormSchema.safeParse({ ...valid, message: "Too short" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(/at least 30/);
  });

  it("requires consent to be ticked", () => {
    expect(contactFormSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });

  it("rejects letters in the phone number and unknown country codes", () => {
    expect(contactFormSchema.safeParse({ ...valid, phone: "call me" }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...valid, phoneCountry: "+999" }).success).toBe(false);
  });

  it("only accepts known service, budget and timeline ids", () => {
    expect(contactFormSchema.safeParse({ ...valid, service: "hacking" }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...valid, budget: "1-crore" }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...valid, budget: "" }).success).toBe(true);
  });
});

describe("contactRequestSchema", () => {
  const request = { ...valid, startedAt: Date.now() - 10_000, sourcePage: "/contact" };

  it("accepts the form plus metadata", () => {
    expect(contactRequestSchema.safeParse(request).success).toBe(true);
  });

  it("rejects unknown fields (strict)", () => {
    const result = contactRequestSchema.safeParse({ ...request, isAdmin: true });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.code).toBe("unrecognized_keys");
  });
});

describe("serviceFromQuery", () => {
  it("maps service page slugs and topics to form options", () => {
    expect(serviceFromQuery("devops-cloud", null)).toBe("devops");
    expect(serviceFromQuery("ui-design", null)).toBe("ui-ux");
    expect(serviceFromQuery(null, "mvp-scoping")).toBe("mvp");
    expect(serviceFromQuery(null, "maintenance")).toBe("maintenance");
  });

  it("ignores unknown values", () => {
    expect(serviceFromQuery("nope", "also-nope")).toBeUndefined();
  });
});

describe("budgetLabel", () => {
  it("returns the label for the chosen currency", () => {
    expect(budgetLabel("under-50k", "INR")).toBe("Under ₹50k");
    expect(budgetLabel("under-50k", "USD")).toBe("Under $600");
    expect(budgetLabel("", "INR")).toBeNull();
  });
});
