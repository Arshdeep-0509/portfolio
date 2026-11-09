import { describe, expect, it } from "vitest";
import { deployUrl } from "@/lib/deployUrl";

describe("deployUrl", () => {
  it("uses NEXT_PUBLIC_SITE_URL first, without a trailing slash", () => {
    expect(
      deployUrl({
        NEXT_PUBLIC_SITE_URL: "https://polestride.com/",
        VERCEL_ENV: "preview",
        VERCEL_URL: "portfolio-abc.vercel.app",
      }),
    ).toBe("https://polestride.com");
  });

  it("gives a preview its own https URL", () => {
    expect(deployUrl({ VERCEL_ENV: "preview", VERCEL_URL: "portfolio-abc.vercel.app" })).toBe(
      "https://portfolio-abc.vercel.app",
    );
  });

  it("never uses the deployment URL for production", () => {
    expect(
      deployUrl({ VERCEL_ENV: "production", VERCEL_URL: "portfolio-abc.vercel.app" }),
    ).toBeUndefined();
  });

  it("treats an empty value as unset, and leaves local builds to the default", () => {
    expect(deployUrl({ NEXT_PUBLIC_SITE_URL: "" })).toBeUndefined();
    expect(deployUrl({})).toBeUndefined();
  });
});
