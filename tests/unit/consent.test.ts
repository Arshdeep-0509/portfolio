// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import { CONSENT_COOKIE, readConsent, saveConsent } from "@/lib/consent";

/** Clears every cookie happy-dom holds for this document. */
function clearCookies() {
  for (const part of document.cookie.split("; ")) {
    const name = part.split("=")[0];
    if (name) document.cookie = `${name}=; Max-Age=0; Path=/`;
  }
}

describe("consent store", () => {
  beforeEach(clearCookies);

  it("reports no decision before the visitor chooses", () => {
    expect(readConsent()).toBeNull();
  });

  it("stores and reads back a choice", () => {
    saveConsent({ analytics: true, marketing: false });
    const consent = readConsent();
    expect(consent).toMatchObject({ v: 1, analytics: true, marketing: false });
    expect(consent?.ts).toBeGreaterThan(0);
  });

  it("writes a first-party cookie that lasts 180 days", () => {
    const writes: string[] = [];
    // happy-dom defines the cookie accessor somewhere on the prototype chain; find it.
    let proto: object | null = Object.getPrototypeOf(document);
    let descriptor: PropertyDescriptor | undefined;
    while (proto && !descriptor) {
      descriptor = Object.getOwnPropertyDescriptor(proto, "cookie");
      proto = Object.getPrototypeOf(proto);
    }
    if (!descriptor?.get || !descriptor.set) throw new Error("document.cookie accessor not found");
    const { get, set } = descriptor;
    Object.defineProperty(document, "cookie", {
      configurable: true,
      get: () => get.call(document),
      set: (value: string) => {
        writes.push(value);
        set.call(document, value);
      },
    });
    saveConsent({ analytics: false, marketing: false });
    delete (document as unknown as Record<string, unknown>).cookie;
    expect(writes[0]).toMatch(new RegExp(`^${CONSENT_COOKIE}=`));
    expect(writes[0]).toContain(`Max-Age=${180 * 24 * 60 * 60}`);
    expect(writes[0]).toContain("Path=/");
    expect(writes[0]).toContain("SameSite=Lax");
  });

  it("treats a corrupted or old-format cookie as no decision", () => {
    document.cookie = `${CONSENT_COOKIE}=not-json; Path=/`;
    expect(readConsent()).toBeNull();
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify({ v: 0, analytics: true }))}; Path=/`;
    expect(readConsent()).toBeNull();
  });

  it("only treats an explicit true as consent", () => {
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify({ v: 1, ts: 1, analytics: "yes", marketing: 1 }))}; Path=/`;
    expect(readConsent()).toMatchObject({ analytics: false, marketing: false });
  });
});
