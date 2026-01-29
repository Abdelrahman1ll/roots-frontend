/** Page: / */
import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load successfully and show main sections", async ({ page }) => {
    // Check for logo or title
    await expect(page).toHaveTitle(/ROOTS/i);

    // Check for navigation links
    await expect(
      page.getByRole("link", { name: /Products|المنتجات/i }).first(),
    ).toBeVisible();

    // Check for Hero section or main content
    const mainHeading = page.locator("h1").first();
    await expect(mainHeading).toBeVisible();
  });

  test("should navigate to products page via CTA", async ({ page }) => {
    const shopNowBtn = page
      .getByRole("link", { name: /Shop Now|تسوق الآن/i })
      .first();
    if (await shopNowBtn.isVisible()) {
      await shopNowBtn.click();
      await expect(page).toHaveURL(/.*products/);
    }
  });
});
