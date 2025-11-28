import { test, expect } from '@playwright/test'
import { loginAs, assertUrlContains } from '../../../utils/test-helpers'
import { InventoryPage } from '../../../pages/inventory.page'
import { ProductDetailPage } from '../../../pages/product-detail.page'

test.describe('Product Browsing & Navigation', () => {
    let inventoryPage: InventoryPage
    let productDetailPage: ProductDetailPage

    test.beforeEach(async ({ page }) => {
        inventoryPage = new InventoryPage(page)
        productDetailPage = new ProductDetailPage(page)
        await page.goto('/')
        await loginAs(page, 'standard_user')
    })

    test('View Product Details @regression', async ({ page }) => {
        await inventoryPage.clickProductName('Sauce Labs Backpack')

        await assertUrlContains(page, 'inventory-item.html')
        await productDetailPage.assertProductDetails(
            'Sauce Labs Backpack',
            '$29.99'
        )
        await productDetailPage.assertButtonState('add')
        await expect(productDetailPage.backButton).toBeVisible()
    })

    test('Return to Product List from Detail Page @regression', async ({
        page,
    }) => {
        await inventoryPage.clickProductName('Sauce Labs Backpack')

        await productDetailPage.backToProducts()

        await assertUrlContains(page, 'inventory.html')
        await inventoryPage.assertInventoryPageDisplayed()
    })
})
