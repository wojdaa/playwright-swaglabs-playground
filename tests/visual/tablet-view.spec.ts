import { test, expect } from '@playwright/test'
import { loginAs, takeVisualSnapshot } from '../../utils/test-helpers'

test.describe('Visual Testing', () => {
    test('Tablet View (768x1024) @visual', async ({ page }) => {
        // 1. Set viewport to tablet size (768x1024)
        await page.setViewportSize({ width: 768, height: 1024 })

        // 2-3. Navigate and login
        await page.goto('/')
        await loginAs(page, 'standard_user')

        // 4. Take screenshot of inventory page
        await expect(page).toHaveURL(/inventory\.html/)
        await takeVisualSnapshot(page, 'visual-tablet-inventory')

        // 6. Add Sauce Labs Fleece Jacket to cart
        await page
            .locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]')
            .click()

        // 7. Click on shopping cart icon
        await page.locator('[data-test="shopping-cart-link"]').click()

        // 8. Take screenshot of cart page
        await expect(page).toHaveURL(/cart\.html/)
        await takeVisualSnapshot(page, 'visual-tablet-cart')

        // 9. Click checkout button
        await page.locator('[data-test="checkout"]').click()

        // 10. Fill in checkout information (First Name: Jane, Last Name: Smith, Zip: 54321)
        await page.locator('[data-test="firstName"]').fill('Jane')
        await page.locator('[data-test="lastName"]').fill('Smith')
        await page.locator('[data-test="postalCode"]').fill('54321')

        // 11. Click continue
        await page.locator('[data-test="continue"]').click()

        // 12. Take screenshot of checkout overview page
        await expect(page).toHaveURL(/checkout-step-two\.html/)
        await takeVisualSnapshot(page, 'visual-tablet-checkout-overview')

        // 13. Click finish
        await page.locator('[data-test="finish"]').click()

        // 14. Take screenshot of order complete page
        await expect(page).toHaveURL(/checkout-complete\.html/)
        await takeVisualSnapshot(page, 'visual-tablet-order-complete')

        // Verification: Verify order complete page is displayed
        await expect(
            page.getByRole('heading', { name: 'Thank you for your order!' })
        ).toBeVisible()
    })
})
