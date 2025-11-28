import { expect, Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class LoginPage extends BasePage {
    readonly usernameInput: Locator
    readonly passwordInput: Locator
    readonly loginButton: Locator
    readonly errorMessage: Locator
    readonly errorButton: Locator
    readonly loginCredentials: Locator

    constructor(page: Page) {
        super(page)
        this.usernameInput = page.locator('[data-test="username"]')
        this.passwordInput = page.locator('[data-test="password"]')
        this.loginButton = page.locator('[data-test="login-button"]')
        this.errorMessage = page.locator('[data-test="error"]')
        this.errorButton = page.locator('.error-button')
        this.loginCredentials = page.locator('#login_credentials')
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
    }

    async assertLoginPageDisplayed() {
        await expect(this.usernameInput).toBeVisible()
        await expect(this.passwordInput).toBeVisible()
        await expect(this.loginButton).toBeVisible()
    }

    async assertErrorMessage(expectedMessage: string) {
        await expect(this.errorMessage).toBeVisible()
        await expect(this.errorMessage).toContainText(expectedMessage)
    }

    async clearErrorMessage() {
        await this.errorButton.click()
        await expect(this.errorMessage).toBeHidden()
    }

    async assertAcceptedUsernamesListed() {
        await expect(this.loginCredentials).toBeVisible()
    }

    async assertLoginFieldsVisible() {
        await expect(
            this.page.getByRole('textbox', { name: 'Username' })
        ).toBeVisible()
        await expect(
            this.page.getByRole('textbox', { name: 'Password' })
        ).toBeVisible()
    }

    async assertAcceptedUsernamesTextVisible() {
        await expect(
            this.page.getByText('Accepted usernames are:')
        ).toBeVisible()
    }

    async assertNoErrorDisplayed() {
        await expect(this.errorMessage).toBeHidden()
    }
}
