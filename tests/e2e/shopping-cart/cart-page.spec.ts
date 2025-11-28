import { test, expect } from '@playwright/test'
import { loginAs } from '../../../utils/test-helpers'
import { InventoryPage } from '../../../pages/inventory.page'
import { CartPage } from '../../../pages/cart.page'

test.describe('Shopping Cart Management', () => {
    let inventoryPage: InventoryPage
    let cartPage: CartPage

    test.beforeEach(async ({ page }) => {
        inventoryPage = new InventoryPage(page)
        cartPage = new CartPage(page)
        await page.goto('/')
        await loginAs(page, 'standard_user')
    })

    test('View Shopping Cart @regression', async () => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack')
        await inventoryPage.addProductToCart('Sauce Labs Bike Light')
        await inventoryPage.addProductToCart('Sauce Labs Onesie')
        await inventoryPage.navigateToCart()
        await cartPage.assertCartPageDisplayed()
        await cartPage.assertCartItemCount(3)
        await cartPage.assertItemInCart('Sauce Labs Backpack')
        await cartPage.assertItemInCart('Sauce Labs Bike Light')
        await cartPage.assertItemInCart('Sauce Labs Onesie')
        await expect(cartPage.continueShoppingButton).toBeVisible()
        await expect(cartPage.checkoutButton).toBeVisible()
    })

    test('Empty Cart State @regression', async () => {
        await inventoryPage.navigateToCart()
        await cartPage.assertCartPageDisplayed()
        await cartPage.assertCartItemCount(0)
        await expect(cartPage.continueShoppingButton).toBeVisible()
    })

    test('Remove Item from Cart Page @regression', async () => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack')
        await inventoryPage.addProductToCart('Sauce Labs Bike Light')
        await inventoryPage.navigateToCart()
        await cartPage.removeItem('Sauce Labs Backpack')
        await cartPage.assertCartItemCount(1)
        await cartPage.assertItemInCart('Sauce Labs Bike Light')
        await inventoryPage.assertCartBadgeCount(1)
    })

    test('Continue Shopping from Cart @regression', async () => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack')
        await inventoryPage.navigateToCart()
        await cartPage.continueShopping()
        await inventoryPage.assertInventoryPageDisplayed()
        await inventoryPage.assertCartBadgeCount(1)
        await inventoryPage.assertProductButtonState(
            'Sauce Labs Backpack',
            'remove'
        )
    })

    test('Navigate to Cart via Product Link @regression', async ({ page }) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack')
        await inventoryPage.navigateToCart()
        await cartPage.clickProductName('Sauce Labs Backpack')
        await expect(page).toHaveURL(/inventory-item\.html/)
        await expect(page.locator('[data-test^="remove"]')).toBeVisible()
    })
})
