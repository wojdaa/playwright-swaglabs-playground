import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../pages/login.page";
import { config } from "../../../utils/config";

test.describe("Authentication & User Management", () => {
  test("Clear Error Message @regression", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await loginPage.login("locked_out_user", config.password!);
    await loginPage.assertErrorMessage(
      "Epic sadface: Sorry, this user has been locked out."
    );
    await loginPage.clearErrorMessage();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });
});
