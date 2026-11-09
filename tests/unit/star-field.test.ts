import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { narrowStars, wideStars } from "@/lib/starField";

const fingerprint = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 16);

describe("star field", () => {
  it("has 40 to 60 stars on wide screens", () => {
    expect(wideStars.length).toBeGreaterThanOrEqual(40);
    expect(wideStars.length).toBeLessThanOrEqual(60);
  });

  it("keeps every star tiny, 1 to 2px across", () => {
    for (const star of [...wideStars, ...narrowStars]) {
      expect(star.r * 2).toBeGreaterThanOrEqual(1);
      expect(star.r * 2).toBeLessThanOrEqual(2);
    }
  });

  it("is seeded: the field never changes unless the seed does", () => {
    expect(fingerprint([wideStars, narrowStars])).toBe("a6254574cb73c5b3");
  });

  it("leaves the text column clear on wide screens", () => {
    expect(wideStars.filter((star) => star.x < 61 && star.y > 17)).toEqual([]);
  });
});
