/** Page: /delivery */
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/auth-helper";

test.describe("Delivery", () => {
  const OWNER_EMAIL = "owner@gmail.com";

  const NEAR_PRICE = "55";
  const FAR_PRICE = "115";

  test("should follow the Owner flow for delivery", async ({ page }) => {
    // Phase 1: Owner Setup (Update Delivery Rates)
    await login(page, OWNER_EMAIL);
    await page.goto("/add-delivery");
    await page.waitForLoadState("networkidle");

    // Wait for the inputs to be ready to avoid flakiness
    const nearInput = page.getByPlaceholder(/Near Region Rate/i).first();
    await nearInput.waitFor({ state: "visible" });
    await nearInput.fill(NEAR_PRICE);

    const farInput = page.getByPlaceholder(/Far Region Rate/i).first();
    await farInput.waitFor({ state: "visible" });
    await farInput.fill(FAR_PRICE);

    // Click Update
    await page.getByRole("button", { name: /Update Shipping Rates/i }).click();

    // Verify values in summary cards
    await expect(page.getByText(NEAR_PRICE).first()).toBeVisible();
    await expect(page.getByText(FAR_PRICE).first()).toBeVisible();

    await logout(page);

    console.log("Add Delivery Test Completed Successfully");
  });
});
