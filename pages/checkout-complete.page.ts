import { expect, Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class CheckoutCompletePage extends BasePage {
    readonly pageTitle: Locator
    readonly completeHeader: Locator
    readonly completeText: Locator
    readonly backHomeButton: Locator
    readonly ponyExpressImage: Locator

    constructor(page: Page) {
        super(page)
        this.pageTitle = page.locator('.title')
        this.completeHeader = page.locator('.complete-header')
        this.completeText = page.locator('.complete-text')
        this.backHomeButton = page.locator('[data-test="back-to-products"]')
        this.ponyExpressImage = page.locator('.pony_express')
    }

    async assertOrderComplete() {
        await expect(this.pageTitle).toHaveText('Checkout: Complete!')
        await expect(this.completeHeader).toContainText(
            'Thank you for your order'
        )
        await expect(this.ponyExpressImage).toBeVisible()
    }

    async backHome() {
        await this.backHomeButton.click()
    }
}
