/** Page: /dashboard */
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/auth-helper";

test.describe("Dashboard (e2e)", () => {
  const OWNER_EMAIL = "owner@gmail.com";

  test("should load dashboard overview", async ({ page }) => {
    await login(page, OWNER_EMAIL);

    await page.goto("/dashboard");

    await page.locator("[data-testid='dashboard-container']").waitFor();

    await expect(
      page
        .locator("h1, h2")
        .filter({ hasText: /Dashboard|Overview/i })
        .first(),
    ).toBeVisible();

    const stats = page.locator("[data-testid='stat-card']");
    await expect(stats.first()).toBeVisible();
    expect(await stats.count()).toBeGreaterThan(0);

    await logout(page);
  });
});
