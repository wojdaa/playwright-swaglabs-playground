import { expect, Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class CheckoutStepTwoPage extends BasePage {
    readonly pageTitle: Locator
    readonly cartItems: Locator
    readonly subtotal: Locator
    readonly tax: Locator
    readonly total: Locator
    readonly finishButton: Locator
    readonly cancelButton: Locator
    readonly paymentInfo: Locator
    readonly shippingInfo: Locator
    readonly inventoryItemName: Locator

    constructor(page: Page) {
        super(page)
        this.pageTitle = page.locator('.title')
        this.cartItems = page.locator('.cart_item')
        this.subtotal = page.locator('.summary_subtotal_label')
        this.tax = page.locator('.summary_tax_label')
        this.total = page.locator('.summary_total_label')
        this.finishButton = page.locator('[data-test="finish"]')
        this.cancelButton = page.locator('[data-test="cancel"]')
        this.paymentInfo = page.locator('.summary_value_label')
        this.shippingInfo = page.locator('.summary_value_label')
        this.inventoryItemName = page.locator('.inventory_item_name')
    }

    async assertCheckoutOverviewDisplayed() {
        await expect(this.pageTitle).toHaveText('Checkout: Overview')
    }

    async assertItemInOrder(productName: string) {
        await expect(
            this.inventoryItemName.filter({ hasText: productName })
        ).toBeVisible()
    }

    async assertOrderItemCount(expectedCount: number) {
        await expect(this.cartItems).toHaveCount(expectedCount)
    }

    async getSubtotal(): Promise<number> {
        const text = (await this.subtotal.textContent()) || ''
        return parseFloat(text.replace('Item total: $', ''))
    }

    async getTax(): Promise<number> {
        const text = (await this.tax.textContent()) || ''
        return parseFloat(text.replace('Tax: $', ''))
    }

    async getTotal(): Promise<number> {
        const text = (await this.total.textContent()) || ''
        return parseFloat(text.replace('Total: $', ''))
    }

    async assertPaymentInformation(expectedText: string) {
        const paymentElements = await this.paymentInfo.allTextContents()
        expect(
            paymentElements.some((text) => text.includes(expectedText))
        ).toBeTruthy()
    }

    async finish() {
        await this.finishButton.click()
    }

    async cancel() {
        await this.cancelButton.click()
    }
}
