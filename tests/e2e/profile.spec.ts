/** Page: /profile */
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/auth-helper";

test.describe("Profile Page (Full Flow)", () => {
  const USER_EMAIL = "user@gmail.com";

  test("should update user profile information", async ({ page }) => {
    // 1. Login
    await login(page, USER_EMAIL);

    // 2. Navigate to Profile
    await page.goto("/profile");

    // Use h1, h2, h3 to find the section header (Personal Info)
    await expect(
      page
        .locator("h1, h2, h3")
        .filter({ hasText: /Profile|حسابي|Personal Info|بياناتي/i })
        .first(),
    ).toBeVisible();

    // Verify email is read-only and matches USER_EMAIL
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeDisabled();
    await expect(emailInput).toHaveValue(USER_EMAIL);

    // 3. Update Profile Data (Editable fields only)
    await page.locator('input[name="firstName"]').fill("E2EFirst");
    await page.locator('input[name="lastName"]').fill("E2ELast");
    await page.locator('input[name="phone"]').fill("01012345678");

    // Fill birthday (must be at least 10 years ago)
    const BIRTHDAY = "1990-01-01";
    await page.locator('input[name="birthday"]').fill(BIRTHDAY);

    // 4. Save Changes
    const saveBtn = page
      .locator('button[type="submit"]')
      .filter({ hasText: /Save Changes|حفظ التغييرات/i })
      .first();
    await saveBtn.click();

    // 5. Verify Success Toast
    await expect(
      page.getByText(/Profile saved successfully|تم حفظ الملف بنجاح/i),
    ).toBeVisible();

    // 6. Verify data persists on reload
    await page.reload();
    await expect(page.locator('input[name="firstName"]')).toHaveValue(
      "E2EFirst",
    );
    await expect(page.locator('input[name="lastName"]')).toHaveValue("E2ELast");
    await expect(page.locator('input[name="phone"]')).toHaveValue(
      "01012345678",
    );
    await expect(page.locator('input[name="birthday"]')).toHaveValue(BIRTHDAY);

    // 7. Logout
    await logout(page);
  });
});
