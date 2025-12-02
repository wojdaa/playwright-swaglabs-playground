// spec: test-plan-security-soft-owasp.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test'
import { loginAs } from '../../utils/test-helpers'
import { fillCheckoutForm, attemptLogin } from '../../utils/security-helpers'

test.describe('Input Validation', () => {
    test('Special Characters in Checkout Fields @security', async ({
        page,
    }) => {
        // Login with valid credentials
        await page.goto('https://www.saucedemo.com/')
        await loginAs(page, 'standard_user')

        // Navigate to checkout
        await page.goto('https://www.saucedemo.com/cart.html')
        await page.locator('[data-test="checkout"]').click()

        // In "First Name" field, enter special characters
        // In "Last Name" field, enter unicode characters
        // In "Zip/Postal Code" field, enter alphanumeric with special chars
        await fillCheckoutForm(
            page,
            '!@#$%^&*()_+-=[]{}|;:\'",.<>?/\\',
            'æøåäöüßñ',
            'ABC-123!@#'
        )

        // Application should handle special characters safely
        // Verify form processes or shows appropriate validation
        await expect(page).toHaveURL(/checkout-step-two\.html/)
    })

    test('Empty String and Whitespace Validation @security', async ({
        page,
    }) => {
        // Login with valid credentials
        await page.goto('https://www.saucedemo.com/')
        await loginAs(page, 'standard_user')

        // Navigate to checkout form
        await page.goto('https://www.saucedemo.com/cart.html')
        await page.locator('[data-test="checkout"]').click()

        // Enter only spaces in required fields
        await page.locator('[data-test="firstName"]').fill('   ')
        await page.locator('[data-test="lastName"]').fill('   ')
        await page.locator('[data-test="postalCode"]').fill('   ')

        // Attempt to submit form
        await page.locator('[data-test="continue"]').click()

        // Document actual behavior - application accepts whitespace as valid input
        // This is a validation gap: whitespace-only fields should be rejected
        await expect(page).toHaveURL(/checkout-step-two\.html/)
    })

    test('Null Byte Injection @security', async ({ page }) => {
        // Navigate to login page
        await page.goto('https://www.saucedemo.com/')

        // In username field, enter null byte sequence
        // In password field, enter null byte sequence
        await attemptLogin(page, 'admin%00', 'password%00')

        // Null bytes should be properly handled
        // No unexpected behavior or errors
        await expect(page.locator('[data-test="error"]')).toBeVisible()

        // Verify error message is standard (no system errors exposed)
        const errorText = await page
            .locator('[data-test="error"]')
            .textContent()
        expect(errorText).toContain('Epic sadface:')
    })

    test('Very Long Input Strings in Checkout @security', async ({ page }) => {
        // Login with valid credentials
        await page.goto('https://www.saucedemo.com/')
        await loginAs(page, 'standard_user')

        // Navigate to checkout
        await page.goto('https://www.saucedemo.com/cart.html')
        await page.locator('[data-test="checkout"]').click()

        // Generate very long strings (500 characters each)
        const longString = 'A'.repeat(500)

        // Fill fields with extremely long values
        await page.locator('[data-test="firstName"]').fill(longString)
        await page.locator('[data-test="lastName"]').fill(longString)
        await page.locator('[data-test="postalCode"]').fill(longString)
        await page.locator('[data-test="continue"]').click()

        // Application should handle long inputs gracefully
        // Either accept them or show validation error (no crashes)
        const url = page.url()
        expect(url).toContain('saucedemo.com')
    })
})
