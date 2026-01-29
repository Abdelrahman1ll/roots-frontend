/**
 * Page: /add-product, /edit-product, /products
 * Source: src/components/Products/ProductForm.tsx, src/components/Products/product.tsx
 */
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/auth-helper";

test.describe("Product Management (Owner)", () => {
  const OWNER_EMAIL = "owner@gmail.com";
  // Use a dynamic name for each run
  const TIMESTAMP = Date.now();
  const PRODUCT_NAME = `Test Product ${TIMESTAMP}`;

  test("should follow the Owner flow to Add a Product", async ({ page }) => {
    test.setTimeout(180000);
    await login(page, OWNER_EMAIL);

    // Give some time for redirects to settle
    await page.waitForTimeout(3000);
    await page.waitForLoadState("networkidle");

    // 1. Add Category
    const categoryName = `Cat-${TIMESTAMP}`;
    console.log(`[Test] Navigating to /category...`);
    await page.goto("/category");
    await page.waitForLoadState("networkidle");

    const skeleton = page.locator(".animate-pulse");
    if (await skeleton.isVisible()) {
      await skeleton.waitFor({ state: "hidden", timeout: 15000 });
    }

    const catInput = page
      .locator('input[placeholder*="Luxury Collection"]')
      .first();
    await expect(catInput).toBeVisible({ timeout: 15000 });
    await catInput.fill(categoryName);

    await page.getByRole("button", { name: /Create/i }).click();

    await expect(page.getByText(categoryName).first()).toBeVisible({
      timeout: 15000,
    });

    // 2. Add Color
    const colorName = `Color-${TIMESTAMP}`;
    await page.goto("/color");
    await page.waitForLoadState("networkidle");

    const colorInput = page
      .locator('input[placeholder*="Midnight Black"]')
      .first();
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

    // 3. Add Product
    console.log(`[Test] Navigating to /add-product...`);
    await page.goto("/add-product");
    await page.waitForLoadState("networkidle");

    await page.locator('input[name="name"]').fill(PRODUCT_NAME);
    await page.locator('input[name="price"]').fill("800");
    await page.locator('input[name="promotionalPrice"]').fill("1200");

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
      .fill("E2E Sequential Cart Test Product Description");

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

    // 4. Edit Product
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    const productCard = page
      .locator(".group\\/card")
      .filter({ hasText: PRODUCT_NAME })
      .first();
    await expect(productCard).toBeVisible({ timeout: 15000 });

    await productCard
      .getByRole("button", { name: /Management Control/i })
      .click();

    await expect(page).toHaveURL(/\/edit-product\/\d+/);
    await expect(
      page.getByRole("heading", { name: /Edit Product/i }),
    ).toBeVisible();

    const NEW_NAME = `${PRODUCT_NAME}-Updated`;
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill(NEW_NAME);

    await page.getByRole("button", { name: /Confirm Data Updates/i }).click();

    await expect(page.getByText(/Product updated successfully/i)).toBeVisible({
      timeout: 15000,
    });

    await page.waitForURL(/\/products/);

    await page.waitForLoadState("networkidle");

    const searchInput = page.getByPlaceholder(/Search/i).first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill(NEW_NAME);

    await logout(page);
  });
});
