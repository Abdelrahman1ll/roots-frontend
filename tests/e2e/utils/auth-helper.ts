import { Page, expect } from "@playwright/test";

export async function login(page: Page, email: string) {
  console.log(`[AuthHelper] Attempting login for ${email}...`);
  await page.goto("/");

  await page.getByRole("button", { name: /login|تسجيل الدخول/i }).click();

  await page.getByPlaceholder(/name@example.com/i).fill(email);

  await page
    .getByRole("button", {
      name: /Send Verification Code/i,
    })
    .click();

  // OTP ثابت من test backend
  const otp = "123456";

  for (let i = 0; i < otp.length; i++) {
    await page.locator(`#code-${i}`).fill(otp[i]);
  }

  await page.getByRole("button", { name: /Verify & Sign Up/i }).click();

  // Wait for the modal/button to disappear to confirm login success
  await expect(
    page.getByRole("button", { name: /Verify & Sign Up/i }),
  ).not.toBeVisible({ timeout: 15000 });

  console.log("[AuthHelper] login successful.");
}

export async function logout(page: Page) {
  console.log("[AuthHelper] Attempting logout...");

  // Go home first to ensure header (user menu) is visible
  await page.goto("/");

  // 1. Ensure page is stable before clicking
  await page.waitForLoadState("networkidle");
  // 1. Open User Menu - Use force:true to bypass stability checks during animations
  await page.locator(".lucide-user").first().click({ force: true });

  // 2. Click logout button - MUST await and click to actually trigger logout
  await page
    .getByRole("button", { name: /Log Out/i })
    .first()
    .click({ force: true });

  console.log("[AuthHelper] Logout successful.");
}
