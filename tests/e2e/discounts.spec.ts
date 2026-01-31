/** Page: /discount-codes */
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/auth-helper";

test.describe("Discount Codes (e2e)", () => {
  const OWNER_EMAIL = "owner@gmail.com";
  const TIMESTAMP = Date.now();
  const discoCode = `SAVE${TIMESTAMP}`;
  const DISCOUNT_PERCENT = 15;
  test("should create, edit, delete and verify discount code", async ({
    page,
  }) => {
    test.setTimeout(180000);
    // --- Phase 1: Owner Flow (CRUD) ---
    await login(page, OWNER_EMAIL);
    await page.goto("/discount-codes");

    // 1. Create
    const codeInput = page.getByPlaceholder(/Ex: SUMMER2026/i);
    await codeInput.fill(discoCode);

    const percentInput = page.getByPlaceholder(/%/i);
    await percentInput.fill(DISCOUNT_PERCENT.toString());

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 5);
    const startDateInput = page.getByPlaceholder(/Ex: 2026-01-31/i);
    await startDateInput.fill(tomorrow.toISOString().split("T")[0]);

    await page.getByRole("button", { name: /Add Code/i }).click();
    await expect(page.getByText(discoCode).first()).toBeVisible({
      timeout: 10000,
    });

    // 2. Edit
    const editBaseCode = `EDIT${TIMESTAMP}`;
    await page
      .locator("div.group")
      .filter({ hasText: discoCode })
      .getByLabel("Edit")
      .click();
    await page.getByPlaceholder(/Ex: SUMMER2026/i).fill(editBaseCode);
    await page.getByRole("button", { name: /Update Code/i }).click();
    await expect(page.getByText(editBaseCode).first()).toBeVisible();

    // 3. Delete
    await page
      .locator("div.group")
      .filter({ hasText: editBaseCode })
      .getByLabel("Delete")
      .click();
    await expect(page.getByText(editBaseCode).first()).not.toBeVisible();

    await logout(page);
  });
});
