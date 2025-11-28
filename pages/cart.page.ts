import { expect, Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'
import { convertProductNameToId } from '../utils/test-helpers'

export class CartPage extends BasePage {
    readonly pageTitle: Locator
    readonly cartItems: Locator
    readonly continueShoppingButton: Locator
    readonly checkoutButton: Locator
    readonly cartQuantity: Locator
    readonly itemName: Locator
    readonly itemPrice: Locator

    constructor(page: Page) {
        super(page)
        this.pageTitle = page.locator('.title')
        this.cartItems = page.locator('.cart_item')
        this.continueShoppingButton = page.locator(
            '[data-test="continue-shopping"]'
        )
        this.checkoutButton = page.locator('[data-test="checkout"]')
        this.cartQuantity = page.locator('.cart_quantity')
        this.itemName = page.locator('.inventory_item_name')
        this.itemPrice = page.locator('.inventory_item_price')
    }

    async assertCartPageDisplayed() {
        await expect(this.pageTitle).toHaveText('Your Cart')
    }

    async assertCartItemCount(expectedCount: number) {
        if (expectedCount > 0) {
            await expect(this.cartItems).toHaveCount(expectedCount)
        } else {
            await expect(this.cartItems).toHaveCount(0)
        }
    }

    async assertItemInCart(productName: string) {
        await expect(
            this.itemName.filter({ hasText: productName })
        ).toBeVisible()
    }

    async removeItem(productName: string) {
        const productId = convertProductNameToId(productName)
        await this.page.locator(`[data-test="remove-${productId}"]`).click()
    }

    async continueShopping() {
        await this.continueShoppingButton.click()
    }

    async proceedToCheckout() {
        await this.checkoutButton.click()
    }

    async clickProductName(productName: string) {
        await this.itemName.filter({ hasText: productName }).click()
    }

    async getCartItemNames(): Promise<string[]> {
        return await this.itemName.allTextContents()
    }
}
