/** Page: /email-order-dispatcher */
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/auth-helper";

test.describe("Email Order Dispatcher (e2e)", () => {
  const OWNER_EMAIL = "owner@gmail.com";
  const TEST_PARTNER = `Partner-${Date.now()}`;
  const TEST_EMAIL = `dispatch-${Date.now()}@example.com`;

  test.beforeEach(async ({ page }) => {
    // Increase timeout for login
    test.setTimeout(60000);
    await login(page, OWNER_EMAIL);
    await page.goto("/email-order-dispatcher");
    await page.waitForLoadState("networkidle");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("should manage email dispatchers lifecycle", async ({ page }) => {
    // 1. Validation check
    const addButton = page.getByRole("button", { name: /Add Routing Rule/i });
    await addButton.click();
    await expect(page.getByText(/Name is required/i)).toBeVisible();
    await expect(page.getByText(/Email is required/i)).toBeVisible();

    // 2. Add Dispatcher
    await page.getByPlaceholder(/Ex: Aramex Express/i).fill(TEST_PARTNER);
    await page.getByPlaceholder(/orders@logistics.com/i).fill(TEST_EMAIL);
    await addButton.click();

    // Verify addition in the list
    const ruleItem = page.locator(".group").filter({ hasText: TEST_EMAIL });
    await expect(ruleItem).toBeVisible({ timeout: 15000 });
    await expect(ruleItem.getByText(TEST_PARTNER)).toBeVisible();

    // 3. Edit Dispatcher
    await ruleItem
      .getByRole("button", { name: new RegExp(`Edit ${TEST_PARTNER}`, "i") })
      .click();

    const UPDATED_NAME = `${TEST_PARTNER}-Updated`;
    const nameInput = page.getByPlaceholder(/Ex: Aramex Express/i);
    await expect(nameInput).toHaveValue(TEST_PARTNER);
    await nameInput.fill(UPDATED_NAME);

    const updateButton = page.getByRole("button", {
      name: /Update Configuration/i,
    });
    await updateButton.click();

    // Verify update
    await expect(page.getByText(UPDATED_NAME).first()).toBeVisible({
      timeout: 15000,
    });

    // 4. Delete Dispatcher
    const updatedRuleItem = page
      .locator(".group")
      .filter({ hasText: TEST_EMAIL });
    await updatedRuleItem
      .getByRole("button", { name: new RegExp(`Delete ${UPDATED_NAME}`, "i") })
      .click();

    // Verify deletion - wait for it to disappear
    await expect(updatedRuleItem).not.toBeVisible({ timeout: 10000 });
  });
});
