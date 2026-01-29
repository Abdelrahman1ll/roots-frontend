/** Page: * (404) */
import { test, expect } from "@playwright/test";

test.describe("404 Not Found Page (e2e)", () => {
  test("should show enhanced 404 page for non-existent route", async ({
    page,
  }) => {
    await page.goto("/some-random-route-that-does-not-exist-12345");

    // 1. Verify 404 number is displayed
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();

    // 2. Verify "Page Not Found" heading
    await expect(
      page.getByRole("heading", { name: /Page Not Found/i }),
    ).toBeVisible();

    // 3. Verify descriptive text
    await expect(
      page.getByText(/doesn't exist or has been moved/i),
    ).toBeVisible();

    // 4. Test "Go to Homepage" button
    const homeButton = page.getByRole("link", { name: /Go to Homepage/i });
    await expect(homeButton).toBeVisible();
    await homeButton.click();
    await expect(page).toHaveURL("/");
  });

  test("should navigate to products page from 404", async ({ page }) => {
    await page.goto("/invalid-route-xyz");

    // Click "Browse Products" button
    const productsButton = page.getByRole("link", { name: /Browse Products/i });
    await expect(productsButton).toBeVisible();
    await productsButton.click();
    await expect(page).toHaveURL("/products");
  });
});
