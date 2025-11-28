import { expect, Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class CheckoutStepOnePage extends BasePage {
    readonly firstNameInput: Locator
    readonly lastNameInput: Locator
    readonly postalCodeInput: Locator
    readonly continueButton: Locator
    readonly cancelButton: Locator
    readonly errorMessage: Locator

    constructor(page: Page) {
        super(page)
        this.firstNameInput = page.locator('[data-test="firstName"]')
        this.lastNameInput = page.locator('[data-test="lastName"]')
        this.postalCodeInput = page.locator('[data-test="postalCode"]')
        this.continueButton = page.locator('[data-test="continue"]')
        this.cancelButton = page.locator('[data-test="cancel"]')
        this.errorMessage = page.locator('[data-test="error"]')
    }

    async fillCheckoutInformation(
        firstName: string,
        lastName: string,
        postalCode: string
    ) {
        await this.firstNameInput.fill(firstName)
        await this.lastNameInput.fill(lastName)
        await this.postalCodeInput.fill(postalCode)
    }

    async continue() {
        await this.continueButton.click()
    }

    async cancel() {
        await this.cancelButton.click()
    }

    async assertErrorMessage(expectedMessage: string) {
        await expect(this.errorMessage).toBeVisible()
        await expect(this.errorMessage).toContainText(expectedMessage)
    }

    async assertCheckoutStepOneDisplayed() {
        await expect(this.firstNameInput).toBeVisible()
        await expect(this.lastNameInput).toBeVisible()
        await expect(this.postalCodeInput).toBeVisible()
    }
}
