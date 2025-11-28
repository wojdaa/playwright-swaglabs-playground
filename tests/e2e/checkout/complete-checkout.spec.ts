import { test, expect } from '@playwright/test'
import { loginAs } from '../../../utils/test-helpers'
import { InventoryPage } from '../../../pages/inventory.page'
import { CartPage } from '../../../pages/cart.page'
import { CheckoutStepOnePage } from '../../../pages/checkout-step-one.page'
import { CheckoutStepTwoPage } from '../../../pages/checkout-step-two.page'
import { CheckoutCompletePage } from '../../../pages/checkout-complete.page'

test.describe('Checkout Process', () => {
    let inventoryPage: InventoryPage
    let cartPage: CartPage
    let checkoutStepOne: CheckoutStepOnePage
    let checkoutStepTwo: CheckoutStepTwoPage
    let checkoutComplete: CheckoutCompletePage

    test.beforeEach(async ({ page }) => {
        inventoryPage = new InventoryPage(page)
        cartPage = new CartPage(page)
        checkoutStepOne = new CheckoutStepOnePage(page)
        checkoutStepTwo = new CheckoutStepTwoPage(page)
        checkoutComplete = new CheckoutCompletePage(page)

        await page.goto('/')
        await loginAs(page, 'standard_user')
    })

    test('Complete Checkout Flow - Single Item @smoke @regression', async ({
        page,
    }) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack')
        await inventoryPage.navigateToCart()
        await cartPage.assertCartItemCount(1)
        await cartPage.proceedToCheckout()
        await checkoutStepOne.assertCheckoutStepOneDisplayed()
        await checkoutStepOne.fillCheckoutInformation('John', 'Doe', '12345')
        await checkoutStepOne.continue()
        await checkoutStepTwo.assertCheckoutOverviewDisplayed()
        await checkoutStepTwo.assertItemInOrder('Sauce Labs Backpack')
        await checkoutStepTwo.assertPaymentInformation('SauceCard')

        const subtotal = await checkoutStepTwo.getSubtotal()
        expect(subtotal).toBe(29.99)
        await checkoutStepTwo.finish()
        await checkoutComplete.assertOrderComplete()
        await expect(page.locator('.shopping_cart_badge')).toBeHidden()
    })

    test('Complete Checkout Flow - Multiple Items @regression', async () => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack')
        await inventoryPage.addProductToCart('Sauce Labs Bike Light')
        await inventoryPage.addProductToCart('Sauce Labs Onesie')
        await inventoryPage.navigateToCart()
        await cartPage.assertCartItemCount(3)
        await cartPage.proceedToCheckout()
        await checkoutStepOne.fillCheckoutInformation('Jane', 'Smith', '90210')
        await checkoutStepOne.continue()
        await checkoutStepTwo.assertCheckoutOverviewDisplayed()
        await checkoutStepTwo.assertOrderItemCount(3)

        const subtotal = await checkoutStepTwo.getSubtotal()
        expect(subtotal).toBe(47.97)
        await checkoutStepTwo.finish()
        await checkoutComplete.assertOrderComplete()
    })
})
