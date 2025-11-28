import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../pages/login.page";
import { config } from "../../../utils/config";

test.describe("Authentication & User Management", () => {
  test("Login Attempt - Locked Out User @regression", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await loginPage.usernameInput.fill("locked_out_user");
    await loginPage.passwordInput.fill(config.password!);
    await loginPage.loginButton.click();
    await expect(page).toHaveURL('/');
    await loginPage.assertErrorMessage(
      "Epic sadface: Sorry, this user has been locked out."
    );
    await expect(loginPage.errorButton).toBeVisible();
  });
});
