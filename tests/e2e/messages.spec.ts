/** Page: /all-users-messages */
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/auth-helper";

test.describe("User Messages Management (e2e)", () => {
  const OWNER_EMAIL = "owner@gmail.com";
  const TEST_SUBJECT = `E2E Broadcast - ${Date.now()}`;
  const TEST_MESSAGE = `This is an automated broadcast message sent during E2E testing at ${new Date().toISOString()}.`;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await login(page, OWNER_EMAIL);
    await page.goto("/all-users-messages");
    await page.waitForLoadState("networkidle");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("should send a broadcast message to all users", async ({ page }) => {
    // 1. Check title
    await expect(
      page
        .locator("h1, h2")
        .filter({ hasText: /Broadcast Message/i })
        .first(),
    ).toBeVisible();

    const sendButton = page.getByRole("button", {
      name: /Send to All Customers/i,
    });

    // 2. Validation check (button should be disabled if fields are empty)
    await expect(sendButton).toBeDisabled();

    // 3. Fill subject and message
    await page.getByPlaceholder(/Ex: Big Summer Sale/i).fill(TEST_SUBJECT);
    await page.getByPlaceholder(/Type your message here/i).fill(TEST_MESSAGE);

    // 4. Send message
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    // 5. Verify success
    await expect(
      page.getByText(/Message sent successfully to all customers/i),
    ).toBeVisible({ timeout: 15000 });

    // 6. Verify fields are cleared
    await expect(page.getByPlaceholder(/Ex: Big Summer Sale/i)).toHaveValue("");
    await expect(page.getByPlaceholder(/Type your message here/i)).toHaveValue(
      "",
    );
  });
});
