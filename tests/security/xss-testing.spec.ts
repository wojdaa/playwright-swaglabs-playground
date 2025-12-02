// spec: test-plan-security-soft-owasp.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test'
import { loginAs } from '../../utils/test-helpers'
import {
    attemptLogin,
    verifyLoginFailed,
    verifyNoXssExecution,
    fillCheckoutForm,
    XSS_PAYLOADS,
} from '../../utils/security-helpers'

test.describe('Cross-Site Scripting (XSS) Testing', () => {
    test('Reflected XSS in Login Form @security', async ({ page }) => {
        // Navigate to login page
        await page.goto('https://www.saucedemo.com/')

        // In the username field, enter: <script>alert('XSS')</script>
        // In the password field, enter: test
        await attemptLogin(page, XSS_PAYLOADS.scriptTag, 'test')

        // Verify error message is displayed without executing script
        await verifyLoginFailed(page)

        // Verify input is properly encoded/escaped in the DOM
        await verifyNoXssExecution(page)
    })

    test('XSS with Image Tag in Login @security', async ({ page }) => {
        // Navigate to login page
        await page.goto('https://www.saucedemo.com/')

        // In the username field, enter: <img src=x onerror=alert('XSS')>
        // In the password field, enter: test
        await attemptLogin(page, XSS_PAYLOADS.imgTag, 'test')

        // Verify no JavaScript alert appears
        await verifyLoginFailed(page)

        // Verify HTML is escaped or sanitized
        await verifyNoXssExecution(page)
    })

    test('XSS in Checkout Form - First Name @security', async ({ page }) => {
        // Navigate to login page
        await page.goto('https://www.saucedemo.com/')

        // Login with valid credentials
        await loginAs(page, 'standard_user')

        // Navigate to cart
        await page.goto('https://www.saucedemo.com/cart.html')

        // Click "Checkout" button
        await page.locator('[data-test="checkout"]').click()

        // In "First Name" field, enter: <script>alert('XSS')</script>
        // In "Last Name" field, enter: Test
        // In "Zip/Postal Code" field, enter: 12345
        await fillCheckoutForm(page, XSS_PAYLOADS.scriptTag, 'Test', '12345')

        // Verify no JavaScript alert appears
        await expect(page).toHaveURL(/checkout-step-two\.html/)

        // Verify script tags are escaped/sanitized
        await verifyNoXssExecution(page)
    })

    test('XSS with Event Handlers in Checkout @security', async ({ page }) => {
        // Navigate to login page
        await page.goto('https://www.saucedemo.com/')

        // Login with valid credentials
        await loginAs(page, 'standard_user')

        // Navigate to cart and proceed to checkout
        await page.goto('https://www.saucedemo.com/cart.html')
        await page.locator('[data-test="checkout"]').click()

        // In "First Name" field, enter: <img src=x onerror=alert('XSS')>
        // In "Last Name" field, enter: " onload="alert('XSS')
        // In "Zip/Postal Code" field, enter: <svg/onload=alert('XSS')>
        await fillCheckoutForm(
            page,
            XSS_PAYLOADS.imgTag,
            XSS_PAYLOADS.eventHandler,
            XSS_PAYLOADS.svgTag
        )

        // Verify no JavaScript alerts appear
        await expect(page).toHaveURL(/checkout-step-two\.html/)

        // Verify all malicious payloads are neutralized
        await verifyNoXssExecution(page)
    })
})
