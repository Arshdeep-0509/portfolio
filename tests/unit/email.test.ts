import { describe, expect, it } from "vitest";
import { formatSender } from "@/lib/email";

describe("formatSender", () => {
  it("adds the brand name to a bare address", () => {
    expect(formatSender("hello@polestride.com")).toBe("Polestride <hello@polestride.com>");
  });

  it("replaces any other display name", () => {
    expect(formatSender("Someone Else <hello@polestride.com>")).toBe(
      "Polestride <hello@polestride.com>",
    );
  });
});
