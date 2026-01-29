/**
 * Page: /checkout
 * Source: src/components/Checkout/checkout.tsx, src/pages/Checkout/checkoutPage.tsx
 */
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/auth-helper";

test.describe("Checkout (e2e)", () => {
  const OWNER_EMAIL = "owner@gmail.com";
  const USER_EMAIL = "user@gmail.com";
  const TIMESTAMP = Date.now();
  const productName = `CheckoutFlow-${TIMESTAMP}`;

  test("should follow the Owner -> User flow for checkout", async ({
    page,
  }) => {
    test.setTimeout(180000); // 3 minutes for full flow
    console.log(`[Test] Starting Checkout Flow - ${productName}`);

    // -------------------------------------------------------------------------
    // Phase 1: Owner Setup (Category -> Color -> Product)
    // -------------------------------------------------------------------------
    await login(page, OWNER_EMAIL);

    // Add Category
    const categoryName = `Cat-${TIMESTAMP}`;
    await page.goto("/category");
    await page.waitForLoadState("networkidle");
    const catInput = page.getByPlaceholder(/Ex: Luxury Collection/i).first();
    await catInput.fill(categoryName);
    await page.getByRole("button", { name: /Create/i }).click();
    await expect(page.getByText(categoryName).first()).toBeVisible({
      timeout: 15000,
    });

    // Add Color
    const colorName = `Color-${TIMESTAMP}`;
    await page.goto("/color");
    await page.waitForLoadState("networkidle");
    const colorInput = page.getByPlaceholder("Ex: Midnight Black");
    await colorInput.fill(colorName);
    await page.getByRole("button", { name: /Register/i }).click();
    await expect(page.getByText(colorName).first()).toBeVisible({
      timeout: 15000,
    });

    // Add Product
    await page.goto("/add-product");
    await page.waitForLoadState("networkidle");
    await page.locator('input[name="name"]').fill(productName);
    await page.locator('input[name="price"]').fill("800");
    await page.locator('input[name="promotionalPrice"]').fill("1000");

    // Select Category
    await page.locator("button:has-text('Select Category')").click();
    await page
      .locator("div.max-h-60 button")
      .filter({ hasText: categoryName })
      .first()
      .click();

    // Select Color
    await page.locator("button:has-text('Select Color')").click();
    await page
      .locator("div.max-h-60 button")
      .filter({ hasText: colorName })
      .first()
      .click();

    await page
      .locator('textarea[name="description"]')
      .fill("E2E Real Checkout Test Product");
    await page.locator('input[name="stock"]').fill("100");
    await page.locator('input[name="wholesalePrice"]').fill("500");
    await page.locator('input[name="packagingCost"]').fill("20");
    await page.locator('input[name="marketingCosts"]').fill("50");

    // Size Specs
    await page.locator('input[placeholder="size"]').first().fill("XL");
    await page.locator('input[placeholder="length"]').first().fill("90");
    await page.locator('input[placeholder="width"]').first().fill("70");
    await page.locator('input[placeholder="stock"]').first().fill("50");

    // Image Upload
    await page.locator('input[type="file"]').setInputFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
        "base64",
      ),
    });

    await page.locator('button[type="submit"]').click();
    await expect(page.getByText(/Product added successfully/i)).toBeVisible({
      timeout: 15000,
    });

    // Add Discount Code
    await page.goto("/discount-codes");

    // 1. Create
    const codeInput = page.getByPlaceholder(/Ex: SUMMER2026/i);
    await codeInput.fill(`SAVE10-${TIMESTAMP}`);

    const percentInput = page.getByPlaceholder(/%/i);
    await percentInput.fill("10");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 5);
    const startDateInput = page.getByPlaceholder(/Start Date/i);
    await startDateInput.fill(tomorrow.toISOString().split("T")[0]);

    await page.getByRole("button", { name: /Add Code/i }).click();
    await expect(page.getByText(`SAVE10-${TIMESTAMP}`).first()).toBeVisible({
      timeout: 10000,
    });

    await logout(page);

    // -------------------------------------------------------------------------
    // Phase 2: User - Add to Cart
    // -------------------------------------------------------------------------
    await login(page, USER_EMAIL);
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    const searchInput = page.getByPlaceholder(/Search/i);
    await searchInput.fill(productName);
    await page.waitForTimeout(1000);

    const productCard = page
      .locator(".group\\/card")
      .filter({ hasText: productName })
      .first();
    await expect(productCard).toBeVisible({ timeout: 15000 });
    await productCard.locator('a[href*="products-details"]').click();

    await expect(page).toHaveURL(/.*products-details/);
    await page.getByRole("button", { name: "XL", exact: true }).click();
    await page
      .getByRole("button", { name: /Add to Cart/i })
      .first()
      .click();

    // -------------------------------------------------------------------------
    // Phase 3: User - Checkout & Order
    // -------------------------------------------------------------------------
    await page.goto("/checkout");
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder(/e.g. John/i).fill("Real");
    await page.getByPlaceholder(/e.g. Doe/i).fill("Tester");

    // State dropdown handling
    const cityToSelect = "Cairo";
    page.locator(
      "button:has-text('Select State'), button:has-text('" +
        cityToSelect +
        "')",
    );

    if (
      await page.locator("button:has-text('" + cityToSelect + "')").isVisible()
    ) {
      console.log(
        `[Test] ${cityToSelect} already auto-detected. Skipping selection.`,
      );
    } else {
      await page.locator("button:has-text('Select State')").click();
      await page.getByPlaceholder(/Search city.../i).fill(cityToSelect);
      // Use force: true because the dropdown animation might make the button "unstable"
      await page
        .locator("button:has-text('" + cityToSelect + "')")
        .first()
        .click({ force: true });
    }

    await page
      .getByPlaceholder(/Street name, building number/i)
      .fill("Checkout E2E St, 123");
    await page.getByPlaceholder(/01xxxxxxxxx/i).fill("01012345678");

    // Cash on Delivery
    await page
      .locator("button")
      .filter({ hasText: /Cash on Delivery/i })
      .first()
      .click();

    // 1. Apply Discount Code
    await page.getByPlaceholder(/Promo Code/i).fill(`SAVE10-${TIMESTAMP}`);
    await page.getByRole("button", { name: /Apply/i }).click();

    // Verify discount application message
    await expect(page.getByText(/Discount applied: 10% OFF/i)).toBeVisible({
      timeout: 10000,
    });

    // Complete Order
    const completeBtn = page
      .locator("button")
      .filter({ hasText: /Complete Order/i })
      .first();
    await expect(completeBtn).toBeEnabled({ timeout: 15000 });
    await completeBtn.click();

    // Verification
    await expect(page.getByText(/Order placed successfully/i)).toBeVisible({
      timeout: 20000,
    });

    await expect(page).toHaveURL(/.*orders/, { timeout: 15000 });

    // -------------------------------------------------------------------------
    // Phase 4: Verify Order Details
    // -------------------------------------------------------------------------
    // Wait for the order list to load (using networkidle to ensure data is fetched)
    await page.waitForLoadState("networkidle");

    // Click the first order's details link
    const orderLink = page.locator("a[href^='/orders/']").first();
    await expect(orderLink).toBeVisible({ timeout: 10000 });
    await orderLink.click();

    // Verify navigation to order details page
    await expect(page).toHaveURL(/\/orders\/\d+/, { timeout: 15000 });

    // Verify "Order Details" heading is present
    await expect(
      page.getByRole("heading", { name: "Order Details" }),
    ).toBeVisible({ timeout: 10000 });

    // Wait specifically for user to see the page
    await page.waitForTimeout(3000);

    await logout(page);
    console.log(
      `[Test] Checkout flow completed successfully for '${productName}'`,
    );
  });
});
