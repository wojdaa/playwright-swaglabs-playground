import { test } from '@playwright/test'
import { loginAs } from '../../../utils/test-helpers'
import { InventoryPage } from '../../../pages/inventory.page'

test.describe('Shopping Cart Management', () => {
    let inventoryPage: InventoryPage

    test.beforeEach(async ({ page }) => {
        inventoryPage = new InventoryPage(page)
        await page.goto('/')
        await loginAs(page, 'standard_user')
    })

    test('Add Single Item to Cart from Inventory @smoke @regression', async () => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack')
        await inventoryPage.assertProductButtonState(
            'Sauce Labs Backpack',
            'remove'
        )
        await inventoryPage.assertCartBadgeCount(1)
    })

    test('Add Multiple Items to Cart @regression', async () => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack')
        await inventoryPage.assertCartBadgeCount(1)
        await inventoryPage.addProductToCart('Sauce Labs Bike Light')
        await inventoryPage.assertCartBadgeCount(2)
        await inventoryPage.addProductToCart('Sauce Labs Onesie')
        await inventoryPage.assertCartBadgeCount(3)
        await inventoryPage.assertProductButtonState(
            'Sauce Labs Backpack',
            'remove'
        )
        await inventoryPage.assertProductButtonState(
            'Sauce Labs Bike Light',
            'remove'
        )
        await inventoryPage.assertProductButtonState(
            'Sauce Labs Onesie',
            'remove'
        )
    })

    test('Remove Item from Cart on Inventory Page @regression', async () => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack')
        await inventoryPage.assertCartBadgeCount(1)
        await inventoryPage.removeProductFromCart('Sauce Labs Backpack')
        await inventoryPage.assertProductButtonState(
            'Sauce Labs Backpack',
            'add'
        )
        await inventoryPage.assertCartBadgeCount(0)
    })
})
