/**
 * Page: /orders, /orders/:id
 * Source: src/components/Orders/OrderDetails.tsx, src/components/Orders/OrderProgress.tsx
 */
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/auth-helper";

test.describe("Order Management (Owner)", () => {
  const OWNER_EMAIL = "owner@gmail.com";

  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await login(page, OWNER_EMAIL);
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("should view order details and update status", async ({ page }) => {
    // 1. Navigate to Orders
    await page.goto("/orders");

    // 2. Select an Order
    // Wait for list
    await expect(page.getByText(/Order History/i)).toBeVisible();
    await page.waitForTimeout(2000);

    const orderCards = page.locator('a[href^="/orders/"]');
    await expect(orderCards.first()).toBeVisible({ timeout: 10000 });

    // Click the first one
    await orderCards.first().click();

    // 3. Order Details Page
    await expect(page.getByText(/Order Details/i)).toBeVisible();
    await expect(page.getByText(/Order Status/i)).toBeVisible();

    // 4. Update Status to 'Confirmed'
    const confirmedBtn = page.getByRole("button", { name: "Confirmed" });
    await confirmedBtn.click();

    // 5. Verify it is active
    // Active buttons have a specific border color or class.
    // The component sets style={{ borderColor: ... }} when active.
    // Confirmed color is #3B82F6.

    // Wait for update
    await page.waitForTimeout(1000);

    await expect(confirmedBtn).toHaveCSS("border-color", "rgb(59, 130, 246)"); // #3B82F6 in rgb
  });
});
