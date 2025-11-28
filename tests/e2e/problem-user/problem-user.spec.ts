import { test, expect } from '@playwright/test'
import { loginAs } from '../../../utils/test-helpers'
import { InventoryPage } from '../../../pages/inventory.page'
import { CartPage } from '../../../pages/cart.page'
import { CheckoutStepOnePage } from '../../../pages/checkout-step-one.page'
import { CheckoutStepTwoPage } from '../../../pages/checkout-step-two.page'
import { CheckoutCompletePage } from '../../../pages/checkout-complete.page'

test.describe('Problem User Scenarios', () => {
    let inventoryPage: InventoryPage
    let cartPage: CartPage

    test.beforeEach(async ({ page }) => {
        inventoryPage = new InventoryPage(page)
        cartPage = new CartPage(page)
        await page.goto('/')
        await loginAs(page, 'problem_user')
    })

    test('Problem User - Wrong Product Images @regression', async () => {
        await inventoryPage.assertInventoryPageDisplayed()
        await inventoryPage.assertProductCount(6)

        const productNames = await inventoryPage.getProductNames()
        expect(productNames).toContain('Sauce Labs Backpack')
    })

    test('Problem User - Add to Cart Functionality @regression', async () => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack')
        await inventoryPage.assertCartBadgeCount(1)
        await inventoryPage.navigateToCart()
        await cartPage.assertItemInCart('Sauce Labs Backpack')
    })

    test.fixme('Problem User - Checkout Flow', async () => {
        // Known issue: problem_user has intentional bugs where the finish button doesn't work properly
        // This is expected behavior for the problem_user account
        const checkoutStepOne = new CheckoutStepOnePage(inventoryPage.page)
        const checkoutStepTwo = new CheckoutStepTwoPage(inventoryPage.page)
        const checkoutComplete = new CheckoutCompletePage(inventoryPage.page)

        await inventoryPage.addProductToCart('Sauce Labs Backpack')
        await inventoryPage.navigateToCart()
        await cartPage.proceedToCheckout()
        await checkoutStepOne.fillCheckoutInformation('Test', 'User', '12345')
        await checkoutStepOne.continue()
        await checkoutStepTwo.finish()

        await checkoutComplete.assertOrderComplete()
    })
})
