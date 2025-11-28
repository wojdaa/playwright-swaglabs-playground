import { test, expect } from '@playwright/test'
import { loginAs } from '../../../utils/test-helpers'
import { InventoryPage } from '../../../pages/inventory.page'

test.describe('Product Browsing & Navigation', () => {
    test('View Product Inventory @smoke @regression', async ({ page }) => {
        const inventoryPage = new InventoryPage(page)

        await page.goto('/')
        await loginAs(page, 'standard_user')

        await inventoryPage.assertInventoryPageDisplayed()
        await inventoryPage.assertProductCount(6)
        await inventoryPage.assertSortOption('az')
        await expect(inventoryPage.shoppingCartLink).toBeVisible()
    })
})
