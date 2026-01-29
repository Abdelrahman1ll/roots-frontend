import { describe, it, expect } from "vitest";
import { formatEndDateArabic } from "./formatters";

describe("Formatters Utility Functions", () => {
  describe("formatEndDateArabic", () => {
    it("should correctly format a valid date string", () => {
      const dateStr = "2025-05-20T14:30:00";
      const formatted = formatEndDateArabic(dateStr);

      // Since it uses toLocaleDateString and toLocaleTimeString,
      // the exact output might depend on the environment's locale,
      // but we can check if it contains expected parts or follows a general pattern.
      expect(formatted).toContain("2025");
      expect(formatted).toContain("5/20"); // Matches month/day format
      expect(formatted).toContain("20");
      // Time part check (might be 02 or 14 depending on 12/24h format)
      expect(formatted).toMatch(/(02|14):30/);
    });

    it("should return an empty string for null or undefined input", () => {
      expect(formatEndDateArabic(null)).toBe("");
      expect(formatEndDateArabic(undefined)).toBe("");
    });

    it("should return an empty string for an invalid date string", () => {
      expect(formatEndDateArabic("invalid-date")).toBe("");
      expect(formatEndDateArabic("")).toBe("");
    });
  });
});
