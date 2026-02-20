/**
 * Checkout tests demonstrating Playwright best practices:
 * - Custom page-object fixtures from `tests/fixtures/pages.fixture.ts`
 *   instead of manually instantiating page objects with `let` variables.
 * - `test.step()` to group logical actions for clearer failure messages
 *   and better report structure.
 *
 * See references: fixtures-hooks.md, page-object-model.md, annotations.md
 */
import { test, expect } from '../../fixtures/pages.fixture'
import { loginAs } from '../../../utils/test-helpers'

test.describe('Checkout Process', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await loginAs(page, 'standard_user')
    })

    test('Complete Checkout Flow - Single Item @smoke @regression', async ({
        page,
        inventoryPage,
        cartPage,
        checkoutStepOnePage,
        checkoutStepTwoPage,
        checkoutCompletePage,
    }) => {
        await test.step('Add item to cart', async () => {
            await inventoryPage.addProductToCart('Sauce Labs Backpack')
            await inventoryPage.navigateToCart()
            await cartPage.assertCartItemCount(1)
        })

        await test.step('Proceed to checkout', async () => {
            await cartPage.proceedToCheckout()
            await checkoutStepOnePage.assertCheckoutStepOneDisplayed()
            await checkoutStepOnePage.fillCheckoutInformation('John', 'Doe', '12345')
            await checkoutStepOnePage.continue()
        })

        await test.step('Review order summary', async () => {
            await checkoutStepTwoPage.assertCheckoutOverviewDisplayed()
            await checkoutStepTwoPage.assertItemInOrder('Sauce Labs Backpack')
            await checkoutStepTwoPage.assertPaymentInformation('SauceCard')
            const subtotal = await checkoutStepTwoPage.getSubtotal()
            expect(subtotal).toBe(29.99)
        })

        await test.step('Complete order and verify confirmation', async () => {
            await checkoutStepTwoPage.finish()
            await checkoutCompletePage.assertOrderComplete()
            await expect(page.locator('.shopping_cart_badge')).toBeHidden()
        })
    })

    test('Complete Checkout Flow - Multiple Items @regression', async ({
        inventoryPage,
        cartPage,
        checkoutStepOnePage,
        checkoutStepTwoPage,
        checkoutCompletePage,
    }) => {
        await test.step('Add multiple items to cart', async () => {
            await inventoryPage.addProductToCart('Sauce Labs Backpack')
            await inventoryPage.addProductToCart('Sauce Labs Bike Light')
            await inventoryPage.addProductToCart('Sauce Labs Onesie')
            await inventoryPage.navigateToCart()
            await cartPage.assertCartItemCount(3)
        })

        await test.step('Proceed to checkout and fill information', async () => {
            await cartPage.proceedToCheckout()
            await checkoutStepOnePage.fillCheckoutInformation('Jane', 'Smith', '90210')
            await checkoutStepOnePage.continue()
        })

        await test.step('Review order summary with 3 items', async () => {
            await checkoutStepTwoPage.assertCheckoutOverviewDisplayed()
            await checkoutStepTwoPage.assertOrderItemCount(3)
            const subtotal = await checkoutStepTwoPage.getSubtotal()
            expect(subtotal).toBe(47.97)
        })

        await test.step('Complete order', async () => {
            await checkoutStepTwoPage.finish()
            await checkoutCompletePage.assertOrderComplete()
        })
    })
})
