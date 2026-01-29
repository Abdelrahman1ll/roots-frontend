/**
 * Page: /all-users, /edit-user-owner/:id
 * Source: src/components/Users/Users.tsx, src/components/Users/EditUserOwner.tsx
 */
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/auth-helper";

test.describe("User Management (Owner)", () => {
  const OWNER_EMAIL = "owner@gmail.com";
  const TARGET_USER_EMAIL = "admin-test@gmail.com";

  test.beforeEach(async ({ page }) => {
    test.setTimeout(80000);
    await login(page, TARGET_USER_EMAIL);
    await logout(page);
    await login(page, OWNER_EMAIL);
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("should view users list and edit a user role", async ({ page }) => {
    // 1. Navigate to All Users
    await page.goto("/all-users");

    // 2. Search for a specific user to edit
    await expect(page.getByText(/User Management/i)).toBeVisible();

    await page
      .getByPlaceholder(/Filter by email address.../i)
      .fill(TARGET_USER_EMAIL);

    // Find the user card that contains the target email
    const userCard = page
      .locator('a[href^="/edit-user-owner/"]')
      .filter({ hasText: TARGET_USER_EMAIL });
    await expect(userCard).toBeVisible({ timeout: 10000 });
    await userCard.click();

    // 4. Edit User Page
    await expect(page.getByText(/Edit Profile/i)).toBeVisible();

    // 5. Change Role
    // Open dropdown
    const roleTrigger = page
      .locator("button")
      .filter({ hasText: /Standard User|System Admin|Platform Owner/ })
      .first();
    await roleTrigger.click();

    // Select 'System Admin' from the dropdown.
    // We use a broader regex because the button contains both label and description.
    await page
      .getByRole("button", { name: /System Admin/i })
      .filter({ has: page.getByText(/Can manage products/i) })
      .click();

    // 6. Save
    await page.getByRole("button", { name: /Save User Profile/i }).click();

    // 7. Verify Success
    await expect(page.getByText(/User updated successfully/i)).toBeVisible();

    // 8. Verify redirection
    await expect(page).toHaveURL(/\/all-users/);
  });
});
