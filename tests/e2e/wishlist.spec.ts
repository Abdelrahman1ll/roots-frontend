/** Page: /wishlist */
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/auth-helper";

test.describe("Wishlist Page (Full Flow)", () => {
  const OWNER_EMAIL = "owner@gmail.com";
  const USER_EMAIL = "user@gmail.com";
  const TIMESTAMP = Date.now();
  const productName = `WishlistTest ${TIMESTAMP}`;

  test("should allow a user to add an existing product to their wishlist", async ({
    page,
  }) => {
    // 1. Login as User
    await login(page, USER_EMAIL);

    // 2. Navigate to Products
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    // 3. Find the first product card
    const firstProductCard = page.locator(".group\\/card").first();
    await expect(firstProductCard).toBeVisible({ timeout: 15000 });

    // 4. Get the product name for verification
    // We'll look for a heading or strong tag inside the card
    const productName = await firstProductCard
      .locator("h3, h2, strong")
      .first()
      .innerText();
    console.log(`[Test] Adding product to wishlist: ${productName}`);

    // 5. Click the wishlist toggle button
    const wishlistBtn = firstProductCard
      .locator("button[aria-label*='wishlist']")
      .first();
    await wishlistBtn.click({ force: true });

    // 6. Navigate to Wishlist and Verify
    await page.goto("/wishlist");
    await expect(page.getByText(productName)).toBeVisible({ timeout: 15000 });

    // 7. Cleanup/Logout
    await logout(page);
  });
});
