/**
 * Page: /cart
 * Source: src/components/Cart/cart.tsx, src/pages/Cart/cartPage.tsx
 */
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/auth-helper";

test.describe("Cart (e2e)", () => {
  const OWNER_EMAIL = "owner@gmail.com";
  const USER_EMAIL = "user@gmail.com";
  const TIMESTAMP = Date.now();
  const productName = `CartFlow-${TIMESTAMP}`;

  test("should follow the Owner -> User flow for cart operations", async ({
    page,
  }) => {
    test.setTimeout(180000); // 3 minutes for full flow
    await login(page, OWNER_EMAIL);

    // Add Category
    const categoryName = `Cat-${TIMESTAMP}`;
    await page.goto("/category");
    await page.waitForLoadState("networkidle");

    const catInput = page.getByPlaceholder(/Ex: Luxury Collection/i).first();
    await expect(catInput).toBeVisible({ timeout: 15000 });
    await catInput.fill(categoryName);

    await page.getByRole("button", { name: /Create/i }).click();

    await expect(page.getByText(categoryName).first()).toBeVisible({
      timeout: 15000,
    });

    // Add Color
    const colorName = `Color-${TIMESTAMP}`;
    await page.goto("/color");

    const colorInput = page.getByPlaceholder("Ex: Midnight Black");
    await expect(colorInput).toBeVisible({ timeout: 15000 });
    await colorInput.fill(colorName);

    const colorPicker = page.locator('input[type="color"]');
    if (await colorPicker.isVisible()) {
      await colorPicker.fill("#386641");
    }

    await page.getByRole("button", { name: /Register/i }).click();

    await expect(page.getByText(colorName).first()).toBeVisible({
      timeout: 15000,
    });

    // Add Product
    await page.goto("/add-product");

    await page.locator('input[name="name"]').fill(productName);
    await page.locator('input[name="price"]').fill("400");
    await page.locator('input[name="promotionalPrice"]').fill("600");

    // Select Category
    await page.locator("button:has-text('Select Category')").click();
    const catOption = page
      .locator("div.max-h-60 button")
      .filter({ hasText: categoryName })
      .first();
    await catOption.waitFor({ state: "visible" });
    await catOption.click();

    // Select Color
    await page.locator("button:has-text('Select Color')").click();
    const colorOption = page
      .locator("div.max-h-60 button")
      .filter({ hasText: colorName })
      .first();
    await colorOption.waitFor({ state: "visible" });
    await colorOption.click();

    await page
      .locator('textarea[name="description"]')
      .fill("E2E Sequential Cart Test Product");

    // Inventory
    await page.locator('input[name="stock"]').fill("100");
    await page.locator('input[name="wholesalePrice"]').fill("200");
    await page.locator('input[name="packagingCost"]').fill("10");
    await page.locator('input[name="marketingCosts"]').fill("20");

    // Size Specification
    await page.locator('input[placeholder="size"]').first().fill("L");
    await page.locator('input[placeholder="length"]').first().fill("80");
    await page.locator('input[placeholder="width"]').first().fill("60");
    await page.locator('input[placeholder="stock"]').first().fill("50");

    // Image Upload
    await page.locator('input[type="file"]').setInputFiles({
      name: "test-product.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
        "base64",
      ),
    });

    // Submit
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText(/Product added successfully/i)).toBeVisible({
      timeout: 15000,
    });

    await logout(page);

    // -------------------------------------------------------------------------
    // Phase 2: User - Add to Cart
    // -------------------------------------------------------------------------
    await login(page, USER_EMAIL);

    await page.goto("/products");

    const userSearch = page.getByPlaceholder(/Search|بحث/i);
    await userSearch.waitFor({ state: "visible" });
    await userSearch.fill(productName);
    await page.waitForTimeout(1000);

    const userCard = page
      .locator(".group\\/card")
      .filter({ hasText: productName })
      .first();
    await expect(userCard).toBeVisible({ timeout: 15000 });

    // Click on the detail link (it's the top part of the card)
    await userCard.locator('a[href*="products-details"]').first().click();

    // On Details Page
    await expect(page).toHaveURL(/.*products-details/);
    const url = page.url();
    const id = url.split("/").pop();

    // Select Size
    await page.getByRole("button", { name: "L", exact: true }).click();

    // Add to Cart
    await page
      .getByRole("button", { name: /Add to Bag/i })
      .first()
      .click();

    // Wait for the button state to change to "Added to Archives" indicating success
    // Success state confirms openCart() was called which opens the drawer
    await expect(page.getByText(/Added to Archives/i)).toBeVisible({
      timeout: 15000,
    });

    // Verify product presence in drawer - scoping to the drawer container
    const drawer = page
      .locator("div")
      .filter({ has: page.getByText(/Archive Bag/i) });
    const cartItem = drawer
      .locator("div.group") // Individual item rows in CartDrawer have the 'group' class
      .filter({ has: page.getByText(productName, { exact: false }) })
      .filter({ hasText: /Size:/i })
      .first();
    await expect(cartItem).toBeVisible({ timeout: 10000 });

    // Increase quantity in drawer
    await cartItem.getByRole("button", { name: "+" }).click();
    // Wait for internal state update (quantity 2)
    await expect(cartItem.getByText("2", { exact: true })).toBeVisible({
      timeout: 10000,
    });

    // Decrease quantity in drawer (using the specific − character)
    await cartItem.getByRole("button", { name: "−" }).click();
    await expect(cartItem.getByText("1", { exact: true })).toBeVisible({
      timeout: 10000,
    });

    // Navigate to Checkout from drawer
    await drawer.getByRole("button", { name: /Initiate Checkout/i }).click();

    // Verify on Checkout Page
    await expect(page).toHaveURL(/.*checkout/);

    // Go back to product and open cart again to test removal
    await page.goto(`/products-details/${id}`);
    await page.waitForLoadState("networkidle");

    // Open cart via header icon
    await page
      .getByLabel(/View Shopping Cart/i)
      .first()
      .click();
    await expect(page.getByText(/Archive Bag/i)).toBeVisible();

    const cartItemForRemoval = drawer
      .locator("div.group")
      .filter({ has: page.getByText(productName, { exact: false }) })
      .filter({ hasText: /Size:/i })
      .first();

    // Remove item in drawer (using Trash2 icon button)
    // The component uses <Trash2 size={14} />. Locating by role/svg or parent button.
    await cartItemForRemoval
      .locator("button")
      .filter({ has: page.locator('svg[class*="lucide-trash"]') })
      .first()
      .click();

    // Wait for the empty state in drawer
    await expect(drawer.getByText(/Bag is empty/i)).toBeVisible({
      timeout: 15000,
    });

    await logout(page);

    console.log("Cart flow completed successfully.");
  });
});
