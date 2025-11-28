import { test, expect } from '@playwright/test'
import { loginAs } from '../../../utils/test-helpers'
import { InventoryPage } from '../../../pages/inventory.page'

test.describe('Performance Glitch User Scenarios', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('Performance User - Login Delay @regression', async ({ page }) => {
        const startTime = Date.now()
        await loginAs(page, 'performance_glitch_user')
        const endTime = Date.now()

        await expect(page).toHaveURL(/inventory\.html/)

        const duration = endTime - startTime
        expect(duration).toBeGreaterThan(0)
    })

    test('Performance User - Page Load Times @regression', async ({ page }) => {
        const inventoryPage = new InventoryPage(page)

        await loginAs(page, 'performance_glitch_user')
        await inventoryPage.clickProductName('Sauce Labs Backpack')
        await expect(page).toHaveURL(/inventory-item\.html/)
        await page.locator('[data-test="back-to-products"]').click()
        await inventoryPage.assertInventoryPageDisplayed()
    })

    test('Performance User - Add to Cart Delay @regression', async ({
        page,
    }) => {
        const inventoryPage = new InventoryPage(page)

        await loginAs(page, 'performance_glitch_user')

        const startTime = Date.now()
        await inventoryPage.addProductToCart('Sauce Labs Backpack')
        const endTime = Date.now()

        await inventoryPage.assertCartBadgeCount(1)
        expect(endTime - startTime).toBeGreaterThan(0)
    })
})
