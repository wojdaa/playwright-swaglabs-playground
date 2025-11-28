import { test, expect } from '@playwright/test'
import { loginAs } from '../../../utils/test-helpers'
import { InventoryPage } from '../../../pages/inventory.page'

test.describe('Product Browsing & Navigation', () => {
    let inventoryPage: InventoryPage

    test.beforeEach(async ({ page }) => {
        inventoryPage = new InventoryPage(page)
        await page.goto('/')
        await loginAs(page, 'standard_user')
    })

    test('Product Sorting - Name A to Z @regression', async () => {
        await inventoryPage.assertSortOption('az')

        const productNames = await inventoryPage.getProductNames()
        const expectedOrder = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
        ]
        expect(productNames).toEqual(expectedOrder)
    })

    test('Product Sorting - Name Z to A @regression', async () => {
        await inventoryPage.selectSort('za')

        const productNames = await inventoryPage.getProductNames()
        const expectedOrder = [
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Onesie',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Bike Light',
            'Sauce Labs Backpack',
        ]
        expect(productNames).toEqual(expectedOrder)
    })

    test('Product Sorting - Price Low to High @regression', async () => {
        await inventoryPage.selectSort('lohi')

        const prices = await inventoryPage.getProductPrices()
        const expectedPrices = [7.99, 9.99, 15.99, 15.99, 29.99, 49.99]
        expect(prices).toEqual(expectedPrices)
    })

    test('Product Sorting - Price High to Low @regression', async () => {
        await inventoryPage.selectSort('hilo')

        const prices = await inventoryPage.getProductPrices()
        const expectedPrices = [49.99, 29.99, 15.99, 15.99, 9.99, 7.99]
        expect(prices).toEqual(expectedPrices)
    })

    test.fixme('Sorting Persistence', async ({ page }) => {
        // Known issue: The application doesn't persist sort preferences after navigation
        // When returning from product detail page, sorting resets to default (az)
        await inventoryPage.selectSort('lohi')
        await inventoryPage.clickProductName('Sauce Labs Onesie')
        await page.locator('[data-test="back-to-products"]').click()

        await inventoryPage.assertSortOption('lohi')
        const prices = await inventoryPage.getProductPrices()
        expect(prices[0]).toBe(7.99)
    })
})
