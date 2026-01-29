/** Page: /products-details/:id */
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/auth-helper";

test.describe("Product Reviews (e2e)", () => {
  const USER_EMAIL = "user@gmail.com";
  // We need a product to rate. Assuming "WishlistTest" product exists from previous runs or we pick any product.
  // Best practice: Create one or search for a generic one.
  // Given we just ran wishlist.spec.ts, "WishlistTest..." exists but timestamp varies.
  // Let's search for "Product" or just pick the first product on /products page which is safer.

  test("should allow user to rate a product", async ({ page }) => {
    await login(page, USER_EMAIL);
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    // Select the first available product to rate
    // We prefer one that is not out of stock if possible, but rating doesn't depend on stock usually.
    // Use the product card selector
    const firstProductCard = page.locator(".group\\/card").first();
    await expect(firstProductCard).toBeVisible({ timeout: 15000 });

    // Navigate to details
    const detailLink = firstProductCard
      .locator("a[href*='products-details']")
      .first();
    await detailLink.click();
    await expect(page).toHaveURL(/.*products-details/);

    // Open Reviews Panel
    const reviewsToggle = page.getByText(/Read Reviews or Write One/i);
    // Ensure it's visible
    await reviewsToggle.scrollIntoViewIfNeeded();
    await reviewsToggle.click();

    // Select Rating (5 stars)
    const formContainer = page.locator(".mb-8.flex.flex-col.items-center");
    // Ensure the form is visible (animation)
    await expect(formContainer).toBeVisible();

    const stars = formContainer.locator("svg.lucide-star");
    // Click 5th star
    await stars.nth(4).click();

    // Fill Comment with unique timestamp to avoid duplicate content checks if any
    const comment = `Amazing product! Test review ${Date.now()}`;
    await page.locator('textarea[name="comment"]').fill(comment);

    // Submit
    await page.getByRole("button", { name: /Post Review/i }).click();

    // Verify Review appears
    await expect(page.getByText(comment)).toBeVisible({ timeout: 15000 });

    // -------------------------------------------------------------------------
    // Phase 2: Edit Review
    // -------------------------------------------------------------------------
    // Locate the edit button for the review we just created.
    // Since we are the user, the edit button should be visible on our review.
    // It has title="Edit Review" or we can find by the edit icon.
    const editBtn = page.locator("button[title='Edit Review']").first();
    await expect(editBtn).toBeVisible();
    await editBtn.click();

    // Verify Form changes to "Update Review"
    await expect(
      page.getByRole("heading", { name: "Update Review" }),
    ).toBeVisible();

    // Change Rating to 4 stars
    // 4th star is index 3
    const editStars = formContainer.locator("svg.lucide-star");
    await editStars.nth(3).click();

    // Change Comment
    const updatedComment = `Updated Review Content ${Date.now()}`;
    await page.locator('textarea[name="comment"]').fill(updatedComment);

    // Submit Changes
    await page.getByRole("button", { name: /Submit Changes/i }).click();

    // Verify Updated Content
    await expect(page.getByText(updatedComment)).toBeVisible({
      timeout: 15000,
    });
    // Verify "Update Review" form is gone or reset (title back to "Write a Review" - wait, logic might hide it or reset it)
    // Actually, checking the content update is sufficient.

    // -------------------------------------------------------------------------
    // Phase 3: Delete Review
    // -------------------------------------------------------------------------
    const deleteBtn = page.locator("button[title='Delete Review']").first();
    await expect(deleteBtn).toBeVisible();

    // Setup dialog handler if there's a confirmation (checking useReviews.ts might be needed, but usually standard confirms need handling)
    // Scanning reviews.tsx... strictly calls handleDeleteReview.
    // Let's assume no native confirm dialog for now unless I see one in code.
    // If there is one: page.on('dialog', dialog => dialog.accept());

    await deleteBtn.click();

    // Verify Review is gone
    await expect(page.getByText(updatedComment)).not.toBeVisible({
      timeout: 15000,
    });

    // Optional: Verify "No reviews yet" if we deleted the only one
    // await expect(page.getByText("No reviews yet")).toBeVisible();

    await logout(page);
  });
});
