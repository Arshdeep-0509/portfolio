import { afterEach, describe, expect, it, vi } from "vitest";
import { linkEvent } from "@/lib/analytics";
import { isPlaceholder } from "@/lib/constants";
import { escapeHtml } from "@/lib/emailLayout";
import { createRateLimiter } from "@/lib/rateLimit";
import { absoluteUrl, cn, formatDate } from "@/lib/utils";

describe("cn", () => {
  it("merges conflicting Tailwind classes, last one wins", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("keeps custom font-size tokens alongside text colours", () => {
    // Regression: without the extendTailwindMerge config, text-small was read as a colour.
    expect(cn("text-small text-white", "text-muted")).toBe("text-small text-muted");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, "b")).toBe("a b");
  });
});

describe("formatDate", () => {
  it("formats in Indian English, Indian time", () => {
    expect(formatDate("2026-10-10")).toBe("10 October 2026");
    // 20:00 UTC is already the next day in IST.
    expect(formatDate("2026-10-10T20:00:00Z")).toBe("11 October 2026");
  });

  it("returns an empty string for invalid input", () => {
    expect(formatDate("not a date")).toBe("");
  });
});

describe("absoluteUrl", () => {
  it("prefixes site-relative paths and leaves absolute URLs alone", () => {
    expect(absoluteUrl("/about")).toMatch(/^https?:\/\/[^/]+\/about$/);
    expect(absoluteUrl("about")).toMatch(/\/about$/);
    expect(absoluteUrl("https://example.com/x")).toBe("https://example.com/x");
  });
});

describe("isPlaceholder", () => {
  it("detects unreplaced [PLACEHOLDERS]", () => {
    expect(isPlaceholder("[EMAIL]")).toBe(true);
    expect(isPlaceholder("https://[DOMAIN]")).toBe(true);
    expect(isPlaceholder("")).toBe(true);
    expect(isPlaceholder("hello@example.com")).toBe(false);
  });
});

describe("escapeHtml", () => {
  it("escapes every HTML-significant character", () => {
    expect(escapeHtml(`<script>alert("x")</script> & 'y'`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;",
    );
  });
});

describe("linkEvent (analytics click classification)", () => {
  const host = "example.com";
  it("classifies WhatsApp, Calendly and other external links", () => {
    expect(linkEvent("https://wa.me/919876543210", host)?.name).toBe("whatsapp_click");
    expect(linkEvent("https://calendly.com/me/30min", host)?.name).toBe("calendly_open");
    expect(linkEvent("https://github.com/me", host)).toEqual({
      name: "outbound_click",
      params: { url: "https://github.com/me", domain: "github.com" },
    });
  });

  it("ignores internal, anchor and mailto links", () => {
    expect(linkEvent("/services", host)).toBeNull();
    expect(linkEvent("#apply", host)).toBeNull();
    expect(linkEvent("mailto:me@example.com", host)).toBeNull();
  });
});

describe("createRateLimiter (in-memory)", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows `max` hits per window, then limits, then resets", async () => {
    vi.useFakeTimers();
    const limited = createRateLimiter({ name: "test", windowMs: 60_000, max: 2 });
    expect(await limited("1.2.3.4")).toBe(false);
    expect(await limited("1.2.3.4")).toBe(false);
    expect(await limited("1.2.3.4")).toBe(true);
    // Other keys are counted separately.
    expect(await limited("5.6.7.8")).toBe(false);
    vi.advanceTimersByTime(60_001);
    expect(await limited("1.2.3.4")).toBe(false);
  });
});
