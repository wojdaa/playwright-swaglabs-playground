import { test, expect } from '@playwright/test'
import { loginAs } from '../../../utils/test-helpers'
import { NavigationPage } from '../../../pages/navigation.page'
import { InventoryPage } from '../../../pages/inventory.page'

test.describe('Navigation & Menu', () => {
    let navigation: NavigationPage
    let inventoryPage: InventoryPage

    test.beforeEach(async ({ page }) => {
        navigation = new NavigationPage(page)
        inventoryPage = new InventoryPage(page)
        await page.goto('/')
        await loginAs(page, 'standard_user')
    })

    test('Open Hamburger Menu @regression', async () => {
        await navigation.openMenu()
        await navigation.assertMenuVisible()
    })

    test('Close Hamburger Menu @regression', async () => {
        await navigation.openMenu()
        await navigation.closeMenu()
        await expect(navigation.sidebarMenu).toBeHidden()
    })

    test('Navigate via All Items Link @regression', async ({ page }) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack')
        await inventoryPage.navigateToCart()
        await navigation.navigateToAllItems()
        await expect(page).toHaveURL(/inventory\.html/)
        await inventoryPage.assertCartBadgeCount(1)
    })

    test.fixme('Reset App State', async ({ page }) => {
        // Known issue: Reset App State doesn't fully reset the cart items
        // The cart badge is removed but the buttons still show "Remove" instead of "Add to cart"
        await inventoryPage.addProductToCart('Sauce Labs Backpack')
        await inventoryPage.addProductToCart('Sauce Labs Bike Light')
        await inventoryPage.selectSort('hilo')
        await navigation.resetAppState()
        await expect(page.locator('.shopping_cart_badge')).toBeHidden()
        await inventoryPage.assertProductButtonState(
            'Sauce Labs Backpack',
            'add'
        )
        await inventoryPage.assertProductButtonState(
            'Sauce Labs Bike Light',
            'add'
        )
    })
})
