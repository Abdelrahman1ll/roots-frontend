/** Page: Login/Register Modal */
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/auth-helper";

test.describe("Authentication Page", () => {
  const TIMESTAMP = Date.now();
  const NEW_USER_EMAIL = `test${TIMESTAMP}@gmail.com`;
  const OWNER_EMAIL = "owner@gmail.com";

  test("should register a new user and logout", async ({ page }) => {
    await login(page, NEW_USER_EMAIL);

    // Complete profile if modal appears
    try {
      if (
        await page
          .getByText(/Complete Your Profile/i)
          .isVisible({ timeout: 2000 })
      ) {
        await page.getByPlaceholder("First Name").fill("Test");
        await page.getByPlaceholder("Last Name").fill("User");
        await page.getByPlaceholder("Phone Number").fill("01012345678");
        await page.getByPlaceholder("YYYY-MM-DD").fill("1995-05-05");
        await page.getByRole("button", { name: /Complete Profile/i }).click();
      }
    } catch (e) {}

    await expect(page.locator('div[title="حسابي"]').first()).toBeVisible();
    await logout(page);
  });

  test("should login as an existing owner", async ({ page }) => {
    await login(page, OWNER_EMAIL);
    await expect(page.locator('div[title="حسابي"]').first()).toBeVisible();
  });
});
