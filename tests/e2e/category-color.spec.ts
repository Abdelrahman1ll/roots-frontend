/** Page: /category, /color */
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/auth-helper";

test.describe("Categories (e2e)", () => {
  const OWNER_EMAIL = "owner@gmail.com";

  test("should follow the Owner -> Owner -> User flow for Categories", async ({
    page,
  }) => {
    const TIMESTAMP = Date.now();
    const categoryName = `Cat-${TIMESTAMP}`;

    await login(page, OWNER_EMAIL);
    await page.goto("/category");

    const catInput = page.getByPlaceholder(/Ex: Luxury Collection/i).first();
    await expect(catInput).toBeVisible({ timeout: 15000 });
    await catInput.fill(categoryName);

    await page.getByRole("button", { name: /Create/i }).click();

    await expect(page.getByText(categoryName).first()).toBeVisible({
      timeout: 15000,
    });

    const catCard = page
      .locator("div.group.flex.items-center.justify-between")
      .filter({ hasText: categoryName })
      .first();

    // 1. Edit Category
    console.log("Waiting before editing category...");
    await page.waitForTimeout(2000);
    await catCard.locator("button").first().click();

    const updatedCategoryName = `${categoryName}-Updated`;
    await catInput.fill(updatedCategoryName);
    await page.getByRole("button", { name: /Update/i }).click();

    await expect(page.getByText(updatedCategoryName).first()).toBeVisible({
      timeout: 15000,
    });

    // 2. Delete Category
    console.log("Waiting before deleting category...");
    await page.waitForTimeout(2000);
    await page
      .locator("div.group.flex.items-center.justify-between")
      .filter({ hasText: updatedCategoryName })
      .first()
      .locator("button")
      .nth(1)
      .click();

    await expect(page.getByText(updatedCategoryName)).not.toBeVisible({
      timeout: 10000,
    });

    await logout(page);

    console.log(
      `[Test] Category '${categoryName}' managed (Edit/Delete) successfully`,
    );
  });

  test("should follow the Owner -> Owner -> User flow for Colors", async ({
    page,
  }) => {
    const TIMESTAMP = Date.now();
    const colorName = `Color-${TIMESTAMP}`;

    await login(page, OWNER_EMAIL);
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

    const colorCard = page
      .locator("div.group.flex.items-center.justify-between")
      .filter({ hasText: colorName })
      .first();

    // 1. Edit Color
    console.log("Waiting before editing color...");
    await page.waitForTimeout(2000);
    await colorCard.locator("button").first().click();

    const updatedColorName = `${colorName}-Updated`;
    await colorInput.fill(updatedColorName);

    const updatedColorHex = "#ff5733";
    if (await colorPicker.isVisible()) {
      await colorPicker.fill(updatedColorHex);
    }

    await page.getByRole("button", { name: /Update/i }).click();

    await expect(page.getByText(updatedColorName).first()).toBeVisible({
      timeout: 15000,
    });

    // 2. Delete Color
    console.log("Waiting before deleting color...");
    await page.waitForTimeout(2000);
    await page
      .locator("div.group.flex.items-center.justify-between")
      .filter({ hasText: updatedColorName })
      .first()
      .locator("button")
      .nth(1)
      .click();

    await expect(page.getByText(updatedColorName)).not.toBeVisible({
      timeout: 10000,
    });

    await logout(page);

    console.log(
      `[Test] Color '${colorName}' managed (Edit/Delete) successfully`,
    );
  });
});
