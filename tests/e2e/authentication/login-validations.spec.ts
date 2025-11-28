import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../pages/login.page";
import { config } from "../../../utils/config";

test.describe("Authentication & User Management", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto('/');
  });

  test("Login with Empty Credentials @regression", async ({ page }) => {
    await loginPage.loginButton.click();
    await loginPage.assertErrorMessage("Username is required");
    await expect(page).toHaveURL('/');
  });

  test("Login with Invalid Username @regression", async ({ page }) => {
    await loginPage.login("invalid_user", config.password!);
    await loginPage.assertErrorMessage("Username and password do not match");
    await expect(page).toHaveURL('/');
  });

  test("Login with Invalid Password @regression", async ({ page }) => {
    await loginPage.login("standard_user", "wrong_password");
    await loginPage.assertErrorMessage("Username and password do not match");
    await expect(page).toHaveURL('/');
  });
});
