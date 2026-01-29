import { describe, it, expect } from "vitest";
import { getCloudinaryUrl, getCloudinarySrcSet } from "./cloudinary";

describe("Cloudinary Utilities", () => {
  const CLOUDINARY_BASE_URL =
    "https://res.cloudinary.com/dnjilyjr4/image/upload";

  describe("getCloudinaryUrl", () => {
    it("should generate URL with default options", () => {
      const result = getCloudinaryUrl("sample-image");
      expect(result).toBe(`${CLOUDINARY_BASE_URL}/q_auto,f_auto/sample-image`);
    });

    it("should generate URL with width option", () => {
      const result = getCloudinaryUrl("sample-image", { width: 800 });
      expect(result).toBe(
        `${CLOUDINARY_BASE_URL}/w_800,q_auto,f_auto,c_fill/sample-image`,
      );
    });

    it("should generate URL with custom quality", () => {
      const result = getCloudinaryUrl("sample-image", { quality: 80 });
      expect(result).toBe(`${CLOUDINARY_BASE_URL}/q_80,f_auto/sample-image`);
    });

    it("should generate URL with custom format", () => {
      const result = getCloudinaryUrl("sample-image", { format: "webp" });
      expect(result).toBe(`${CLOUDINARY_BASE_URL}/q_auto,f_webp/sample-image`);
    });

    it("should generate URL with custom crop mode", () => {
      const result = getCloudinaryUrl("sample-image", {
        width: 600,
        crop: "scale",
      });
      expect(result).toBe(
        `${CLOUDINARY_BASE_URL}/w_600,q_auto,f_auto,c_scale/sample-image`,
      );
    });

    it("should not include crop if width is not provided", () => {
      const result = getCloudinaryUrl("sample-image", { crop: "fit" });
      expect(result).toBe(`${CLOUDINARY_BASE_URL}/q_auto,f_auto/sample-image`);
    });

    it("should generate URL with all options combined", () => {
      const result = getCloudinaryUrl("sample-image", {
        width: 1200,
        quality: 90,
        format: "jpg",
        crop: "fit",
      });
      expect(result).toBe(
        `${CLOUDINARY_BASE_URL}/w_1200,q_90,f_jpg,c_fit/sample-image`,
      );
    });

    it("should extract public ID from full Cloudinary URL", () => {
      const fullUrl = `${CLOUDINARY_BASE_URL}/v1234567890/sample-image.jpg`;
      const result = getCloudinaryUrl(fullUrl, { width: 400 });
      expect(result).toBe(
        `${CLOUDINARY_BASE_URL}/w_400,q_auto,f_auto,c_fill/sample-image`,
      );
    });

    it("should extract public ID from URL without version", () => {
      const fullUrl = `${CLOUDINARY_BASE_URL}/sample-image.png`;
      const result = getCloudinaryUrl(fullUrl);
      expect(result).toBe(`${CLOUDINARY_BASE_URL}/q_auto,f_auto/sample-image`);
    });

    it("should handle nested folder paths in public ID", () => {
      const result = getCloudinaryUrl("products/category/image-name", {
        width: 500,
      });
      expect(result).toBe(
        `${CLOUDINARY_BASE_URL}/w_500,q_auto,f_auto,c_fill/products/category/image-name`,
      );
    });

    it("should handle URL with nested folder paths", () => {
      const fullUrl = `${CLOUDINARY_BASE_URL}/v1234567890/products/category/image-name.jpg`;
      const result = getCloudinaryUrl(fullUrl, { width: 300 });
      expect(result).toBe(
        `${CLOUDINARY_BASE_URL}/w_300,q_auto,f_auto,c_fill/products/category/image-name`,
      );
    });

    it("should handle empty string as public ID", () => {
      const result = getCloudinaryUrl("");
      expect(result).toBe(`${CLOUDINARY_BASE_URL}/q_auto,f_auto/`);
    });

    it("should handle quality as 'auto'", () => {
      const result = getCloudinaryUrl("sample-image", { quality: "auto" });
      expect(result).toBe(`${CLOUDINARY_BASE_URL}/q_auto,f_auto/sample-image`);
    });

    it("should handle format as 'auto'", () => {
      const result = getCloudinaryUrl("sample-image", { format: "auto" });
      expect(result).toBe(`${CLOUDINARY_BASE_URL}/q_auto,f_auto/sample-image`);
    });
  });

  describe("getCloudinarySrcSet", () => {
    it("should generate srcSet with default widths", () => {
      const result = getCloudinarySrcSet("sample-image");
      const expected = [
        `${CLOUDINARY_BASE_URL}/w_400,q_auto,f_auto,c_fill/sample-image 400w`,
        `${CLOUDINARY_BASE_URL}/w_800,q_auto,f_auto,c_fill/sample-image 800w`,
        `${CLOUDINARY_BASE_URL}/w_1200,q_auto,f_auto,c_fill/sample-image 1200w`,
      ].join(", ");
      expect(result).toBe(expected);
    });

    it("should generate srcSet with custom widths", () => {
      const result = getCloudinarySrcSet("sample-image", [300, 600, 900]);
      const expected = [
        `${CLOUDINARY_BASE_URL}/w_300,q_auto,f_auto,c_fill/sample-image 300w`,
        `${CLOUDINARY_BASE_URL}/w_600,q_auto,f_auto,c_fill/sample-image 600w`,
        `${CLOUDINARY_BASE_URL}/w_900,q_auto,f_auto,c_fill/sample-image 900w`,
      ].join(", ");
      expect(result).toBe(expected);
    });

    it("should generate srcSet with single width", () => {
      const result = getCloudinarySrcSet("sample-image", [500]);
      const expected = `${CLOUDINARY_BASE_URL}/w_500,q_auto,f_auto,c_fill/sample-image 500w`;
      expect(result).toBe(expected);
    });

    it("should generate srcSet from full Cloudinary URL", () => {
      const fullUrl = `${CLOUDINARY_BASE_URL}/v1234567890/sample-image.jpg`;
      const result = getCloudinarySrcSet(fullUrl, [400, 800]);
      const expected = [
        `${CLOUDINARY_BASE_URL}/w_400,q_auto,f_auto,c_fill/sample-image 400w`,
        `${CLOUDINARY_BASE_URL}/w_800,q_auto,f_auto,c_fill/sample-image 800w`,
      ].join(", ");
      expect(result).toBe(expected);
    });

    it("should generate srcSet with nested folder paths", () => {
      const result = getCloudinarySrcSet("products/featured/item", [320, 640]);
      const expected = [
        `${CLOUDINARY_BASE_URL}/w_320,q_auto,f_auto,c_fill/products/featured/item 320w`,
        `${CLOUDINARY_BASE_URL}/w_640,q_auto,f_auto,c_fill/products/featured/item 640w`,
      ].join(", ");
      expect(result).toBe(expected);
    });

    it("should handle empty widths array", () => {
      const result = getCloudinarySrcSet("sample-image", []);
      expect(result).toBe("");
    });

    it("should handle large number of widths", () => {
      const widths = [200, 400, 600, 800, 1000, 1200, 1400, 1600];
      const result = getCloudinarySrcSet("sample-image", widths);
      const urls = result.split(", ");
      expect(urls).toHaveLength(8);
      expect(urls[0]).toContain("w_200");
      expect(urls[7]).toContain("w_1600");
    });
  });

  describe("Edge Cases", () => {
    it("should handle URLs with special characters in public ID", () => {
      const result = getCloudinaryUrl("image-with-dashes_and_underscores");
      expect(result).toBe(
        `${CLOUDINARY_BASE_URL}/q_auto,f_auto/image-with-dashes_and_underscores`,
      );
    });

    it("should handle very large width values", () => {
      const result = getCloudinaryUrl("sample-image", { width: 5000 });
      expect(result).toBe(
        `${CLOUDINARY_BASE_URL}/w_5000,q_auto,f_auto,c_fill/sample-image`,
      );
    });

    it("should handle zero width", () => {
      const result = getCloudinaryUrl("sample-image", { width: 0 });
      // Width of 0 is falsy, so it won't be included
      expect(result).toBe(`${CLOUDINARY_BASE_URL}/q_auto,f_auto/sample-image`);
    });

    it("should handle quality value of 0", () => {
      const result = getCloudinaryUrl("sample-image", { quality: 0 });
      // Quality of 0 is falsy, so default 'auto' will be used
      expect(result).toBe(`${CLOUDINARY_BASE_URL}/q_auto,f_auto/sample-image`);
    });
  });
});
