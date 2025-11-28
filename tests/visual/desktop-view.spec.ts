import { test, expect } from '@playwright/test'
import { loginAs, takeVisualSnapshot } from '../../utils/test-helpers'

test.describe('Visual Testing', () => {
    test('Desktop View (1920x1080) @visual', async ({ page }) => {
        // 1. Set viewport to desktop size (1920x1080)
        await page.setViewportSize({ width: 1920, height: 1080 })

        // 2-3. Navigate and login
        await page.goto('/')
        await loginAs(page, 'standard_user')

        // 4. Take screenshot of inventory page
        await expect(page).toHaveURL(/inventory\.html/)
        await takeVisualSnapshot(page, 'visual-desktop-inventory')

        // 5. Add Sauce Labs Backpack to cart
        await page
            .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
            .click()

        // 6. Click on shopping cart icon
        await page.locator('[data-test="shopping-cart-link"]').click()

        // 7. Take screenshot of cart page
        await expect(page).toHaveURL(/cart\.html/)
        await takeVisualSnapshot(page, 'visual-desktop-cart')

        // 8. Click checkout button
        await page.locator('[data-test="checkout"]').click()

        // 9. Fill in checkout information (First Name: John, Last Name: Doe, Zip: 12345)
        await page.locator('[data-test="firstName"]').fill('John')
        await page.locator('[data-test="lastName"]').fill('Doe')
        await page.locator('[data-test="postalCode"]').fill('12345')

        // 10. Click continue
        await page.locator('[data-test="continue"]').click()

        // 11. Take screenshot of checkout overview page
        await expect(page).toHaveURL(/checkout-step-two\.html/)
        await takeVisualSnapshot(page, 'visual-desktop-checkout-overview')

        // 12. Click finish
        await page.locator('[data-test="finish"]').click()

        // 13. Take screenshot of order complete page
        await expect(page).toHaveURL(/checkout-complete\.html/)
        await takeVisualSnapshot(page, 'visual-desktop-order-complete')

        // Verification: Verify order complete page is displayed
        await expect(
            page.getByRole('heading', { name: 'Thank you for your order!' })
        ).toBeVisible()
    })
})
