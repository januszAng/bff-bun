import { describe, expect, it } from "bun:test";

describe("Initial Setup Sanity Check", () => {
  it("should successfully pass to verify the testing environment", () => {
    // A simple math operation to ensure the assertions work
    const result = 2 + 2;
    expect(result).toBe(4);
  });

  it("should correctly handle boolean checks", () => {
    // Testing if Bun's environment flag works as expected
    const isBun = typeof Bun !== "undefined";
    expect(isBun).toBe(true);
  });
});
