/** Page: /orders */
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/auth-helper";

test.describe("Orders (e2e)", () => {
  const OWNER_EMAIL = "owner@gmail.com";

  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await login(page, OWNER_EMAIL);
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("should display orders page with proper heading", async ({ page }) => {
    await page.goto("/orders");
    await page.waitForLoadState("networkidle");

    // Verify page heading
    await expect(
      page.locator("h1").filter({ hasText: /Order History/i }),
    ).toBeVisible();

    // Verify descriptive text
    await expect(page.getByText(/Track and manage all your/i)).toBeVisible();
  });
});
