import { expect, Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class ProductDetailPage extends BasePage {
    readonly productName: Locator
    readonly productDescription: Locator
    readonly productPrice: Locator
    readonly productImage: Locator
    readonly addToCartButton: Locator
    readonly removeButton: Locator
    readonly backButton: Locator

    constructor(page: Page) {
        super(page)
        this.productName = page.locator('.inventory_details_name')
        this.productDescription = page.locator('.inventory_details_desc')
        this.productPrice = page.locator('.inventory_details_price')
        this.productImage = page.locator('.inventory_details_img')
        this.addToCartButton = page.locator('[data-test^="add-to-cart"]')
        this.removeButton = page.locator('[data-test^="remove"]')
        this.backButton = page.locator('[data-test="back-to-products"]')
    }

    async assertProductDetails(name: string, price: string) {
        await expect(this.productName).toHaveText(name)
        await expect(this.productPrice).toHaveText(price)
        await expect(this.productDescription).toBeVisible()
        await expect(this.productImage).toBeVisible()
    }

    async addToCart() {
        await this.addToCartButton.click()
    }

    async removeFromCart() {
        await this.removeButton.click()
    }

    async assertButtonState(state: 'add' | 'remove') {
        const locator =
            state === 'add' ? this.addToCartButton : this.removeButton
        await expect(locator).toBeVisible()
    }

    async backToProducts() {
        await this.backButton.click()
    }
}
