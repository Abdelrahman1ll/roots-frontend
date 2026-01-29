import { describe, it, expect } from "vitest";
import { validateEmail, isValidEgyptianPhone } from "./validators";

describe("Validators Utility Functions", () => {
  describe("validateEmail", () => {
    it("should return true for valid email addresses", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name@domain.co.uk")).toBe(true);
      expect(validateEmail("first.last@sub.domain.org")).toBe(true);
    });

    it("should return false for invalid email addresses", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("@domain.com")).toBe(false);
      expect(validateEmail("user@")).toBe(false);
      expect(validateEmail("user@domain")).toBe(false);
      expect(validateEmail("user @domain.com")).toBe(false);
    });
  });

  describe("isValidEgyptianPhone", () => {
    it("should return true for valid Egyptian mobile numbers", () => {
      expect(isValidEgyptianPhone("01012345678")).toBe(true);
      expect(isValidEgyptianPhone("01112345678")).toBe(true);
      expect(isValidEgyptianPhone("01212345678")).toBe(true);
      expect(isValidEgyptianPhone("01512345678")).toBe(true);
    });

    it("should return false for invalid Egyptian mobile numbers", () => {
      expect(isValidEgyptianPhone("01312345678")).toBe(false); // Invalid provider prefix
      expect(isValidEgyptianPhone("0101234567")).toBe(false); // Too short
      expect(isValidEgyptianPhone("010123456789")).toBe(false); // Too long
      expect(isValidEgyptianPhone("12345678901")).toBe(false); // Doesn't start with 01
      expect(isValidEgyptianPhone("010abcdefgh")).toBe(false); // Contains letters
    });
  });
});
