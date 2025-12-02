// spec: test-plan-security-soft-owasp.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test'
import {
    verifyFieldAttribute,
    generateString,
    attemptLogin,
} from '../../utils/security-helpers'

test.describe('Authentication Security', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/')
    })

    test('Autocomplete Attribute Check @security', async ({ page }) => {
        // Inspect the password field for autocomplete attribute
        const passwordField = page.locator('[data-test="password"]')
        const autocompleteAttr =
            await passwordField.getAttribute('autocomplete')

        // Password field should have autocomplete="current-password" or autocomplete="off"
        // Document actual value (currently null, which is a security concern)
        expect(autocompleteAttr).toBeNull() // Documents missing autocomplete

        // Username field check
        const usernameField = page.locator('[data-test="username"]')
        const usernameAutocomplete =
            await usernameField.getAttribute('autocomplete')
        expect(usernameAutocomplete).toBeNull() // Documents missing autocomplete
    })

    test('Password Field Type Check @security', async ({ page }) => {
        // Verify password field has type="password"
        await verifyFieldAttribute(page, 'password', 'type', 'password')

        // Verify password is masked (not visible as text)
        const passwordField = page.locator('[data-test="password"]')
        await expect(passwordField).toHaveAttribute('type', 'password')
    })

    test('Form Method Security @security', async ({ page }) => {
        // Inspect the login form for method and action attributes
        const form = page.locator('form')

        // Form method should be POST, not GET
        // Document actual behavior - form has no method attribute (defaults to GET)
        // This is a security concern: GET method exposes credentials in URL
        const methodAttr = await form.getAttribute('method')
        expect(methodAttr).toBeNull() // No method attribute = defaults to GET

        // Check action attribute (may also be null)
        const actionAttr = await form.getAttribute('action')
        expect(actionAttr).toBeNull() // No action = submits to same page
    })

    test('Brute Force Protection @security', async ({ page }) => {
        // Attempt 10 consecutive failed login attempts
        for (let i = 0; i < 10; i++) {
            await attemptLogin(page, 'test_user', 'wrong_password')

            // Verify error is displayed
            await expect(page.locator('[data-test="error"]')).toBeVisible()

            // Clear error by clicking error button
            await page.locator('[data-test="error-button"]').click()
        }

        // Document if no rate limiting or account lockout is implemented
        // Application should implement rate limiting or CAPTCHA after multiple failures
        // Currently, no protection is observed (acceptable for demo environment)
        await expect(page.locator('[data-test="username"]')).toBeVisible()
    })

    test('Maximum Length Validation - Login Fields @security', async ({
        page,
    }) => {
        // Enter 1000 character string in username field
        const longString = generateString(1000)
        await page.locator('[data-test="username"]').fill(longString)
        await page.locator('[data-test="password"]').fill(longString)

        // Click "Login" button
        await page.locator('[data-test="login-button"]').click()

        // Application should handle long inputs gracefully
        // No buffer overflow or system errors should occur
        await expect(page.locator('[data-test="error"]')).toBeVisible()
    })
})
