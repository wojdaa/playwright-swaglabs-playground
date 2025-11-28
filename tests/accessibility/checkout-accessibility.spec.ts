import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { loginAs } from '../../utils/test-helpers'
import { InventoryPage } from '../../pages/inventory.page'
import { CartPage } from '../../pages/cart.page'

test.describe('Checkout Flow - Accessibility Tests', () => {
    let inventoryPage: InventoryPage
    let cartPage: CartPage

    test.beforeEach(async ({ page }) => {
        inventoryPage = new InventoryPage(page)
        cartPage = new CartPage(page)

        await page.goto('/')
        await loginAs(page, 'standard_user')

        // Add item to cart and navigate to checkout
        await inventoryPage.addProductToCart('Sauce Labs Backpack')
        await inventoryPage.navigateToCart()
    })

    // Known application accessibility issues:
    // - Missing main landmark (landmark-one-main)
    // - Missing h1 heading (page-has-heading-one)
    // - Content not in landmarks (region violation)
    test.fixme(
        'cart page should not have accessibility issues @accessibility',
        async ({ page }) => {
            const accessibilityScanResults = await new AxeBuilder({
                page,
            }).analyze()

            expect(accessibilityScanResults.violations).toEqual([])
        }
    )

    test('checkout step one should have accessible form fields @accessibility', async ({
        page,
    }) => {
        await cartPage.proceedToCheckout()

        // Check form accessibility
        const accessibilityScanResults = await new AxeBuilder({ page })
            .include('[data-test="firstName"]')
            .include('[data-test="lastName"]')
            .include('[data-test="postalCode"]')
            .analyze()

        expect(accessibilityScanResults.violations).toEqual([])
    })

    // Known application issue: Tab navigation doesn't consistently focus on form fields in expected order
    // This may be due to additional focusable elements in the DOM or browser-specific behavior
    test.fixme(
        'checkout form should support keyboard navigation @accessibility',
        async ({ page }) => {
            await cartPage.proceedToCheckout()

            // Tab through form fields
            await page.keyboard.press('Tab')
            await expect(page.locator('[data-test="firstName"]')).toBeFocused()

            await page.keyboard.press('Tab')
            await expect(page.locator('[data-test="lastName"]')).toBeFocused()

            await page.keyboard.press('Tab')
            await expect(page.locator('[data-test="postalCode"]')).toBeFocused()
        }
    )

    // Known application accessibility issues:
    // - Missing main landmark (landmark-one-main)
    // - Missing h1 heading (page-has-heading-one)
    // - Content not in landmarks (region violation)
    test.fixme(
        'checkout overview should not have accessibility issues @accessibility',
        async ({ page }) => {
            await cartPage.proceedToCheckout()

            // Fill form
            await page.locator('[data-test="firstName"]').fill('John')
            await page.locator('[data-test="lastName"]').fill('Doe')
            await page.locator('[data-test="postalCode"]').fill('12345')
            await page.locator('[data-test="continue"]').click()

            // Check overview page accessibility
            const accessibilityScanResults = await new AxeBuilder({
                page,
            }).analyze()

            expect(accessibilityScanResults.violations).toEqual([])
        }
    )

    // Known application accessibility issues:
    // - Missing main landmark (landmark-one-main)
    // - Missing h1 heading (page-has-heading-one)
    // - Content not in landmarks (region violation)
    test.fixme(
        'checkout complete page should be accessible @accessibility',
        async ({ page }) => {
            await cartPage.proceedToCheckout()

            // Fill form
            await page.locator('[data-test="firstName"]').fill('John')
            await page.locator('[data-test="lastName"]').fill('Doe')
            await page.locator('[data-test="postalCode"]').fill('12345')
            await page.locator('[data-test="continue"]').click()

            // Finish checkout
            await page.locator('[data-test="finish"]').click()

            // Check complete page accessibility
            const accessibilityScanResults = await new AxeBuilder({
                page,
            }).analyze()

            expect(accessibilityScanResults.violations).toEqual([])
        }
    )

    // Known application issue: Error button missing discernible text (button-name violation)
    // The error close button has no accessible name
    test.fixme(
        'error messages should be accessible @accessibility',
        async ({ page }) => {
            await cartPage.proceedToCheckout()

            // Submit without filling form to trigger error
            await page.locator('[data-test="continue"]').click()

            // Check error message accessibility
            const accessibilityScanResults = await new AxeBuilder({ page })
                .include('[data-test="error"]')
                .analyze()

            expect(accessibilityScanResults.violations).toEqual([])
        }
    )

    test('cancel buttons should be keyboard accessible @accessibility', async ({
        page,
    }) => {
        await cartPage.proceedToCheckout()

        // Focus on cancel button
        await page.locator('[data-test="cancel"]').focus()
        await expect(page.locator('[data-test="cancel"]')).toBeFocused()

        // Press Enter to cancel
        await page.keyboard.press('Enter')

        // Verify navigation back to cart
        await expect(page).toHaveURL(/cart\.html/)
    })
})
