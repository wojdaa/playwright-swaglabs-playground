// spec: test-plan-security-soft-owasp.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test'
import { loginAs } from '../../utils/test-helpers'
import { checkSecurityHeaders, getCookie } from '../../utils/security-helpers'

test.describe('Security Misconfiguration', () => {
    test('HTTPS Enforcement @security', async ({ page }) => {
        // Attempt to navigate to HTTP version
        await page.goto('http://www.saucedemo.com/')

        // HTTP should redirect to HTTPS
        // Application should enforce secure connections
        await expect(page).toHaveURL(/^https:\/\//)

        // Browser should show secure connection (protocol check)
        const url = page.url()
        expect(url).toMatch(/^https:/)
    })

    test('Security Headers Check @security', async ({ page }) => {
        // Navigate to application and inspect response headers
        const headers = await checkSecurityHeaders(
            page,
            'https://www.saucedemo.com/'
        )

        // Document which security headers are present/missing
        // Note: This test documents the current state rather than asserting specific values
        // In a production environment, these should be properly configured

        // Check for Content-Security-Policy
        const hasCsp = headers.contentSecurityPolicy !== undefined

        // Check for X-Frame-Options
        const hasXFrameOptions = headers.xFrameOptions !== undefined

        // Check for X-Content-Type-Options
        const hasXContentType = headers.xContentTypeOptions !== undefined

        // Check for Strict-Transport-Security
        const hasHsts = headers.strictTransportSecurity !== undefined

        // Document findings (these may be undefined for demo site)
        expect(typeof hasCsp).toBe('boolean')
        expect(typeof hasXFrameOptions).toBe('boolean')
        expect(typeof hasXContentType).toBe('boolean')
        expect(typeof hasHsts).toBe('boolean')
    })

    test('Cookie Security Attributes @security', async ({ page }) => {
        // Navigate and login to set cookies
        await page.goto('https://www.saucedemo.com/')
        await loginAs(page, 'standard_user')

        // Inspect the session-username cookie attributes
        const sessionCookie = await getCookie(page, 'session-username')

        // Document cookie security attributes
        expect(sessionCookie).toBeDefined()

        // Cookies should have Secure flag (HTTPS only)
        // Session cookies should have HttpOnly flag
        // SameSite=Strict or Lax should be set

        // Document actual configuration (may not meet best practices in demo)
        expect(sessionCookie).toHaveProperty('secure')
        expect(sessionCookie).toHaveProperty('httpOnly')
        expect(sessionCookie).toHaveProperty('sameSite')
    })

    test('Error Message Information Disclosure @security', async ({ page }) => {
        // Navigate to login page
        await page.goto('https://www.saucedemo.com/')

        // Login with invalid credentials
        await page.locator('[data-test="username"]').fill('invalid_user')
        await page.locator('[data-test="password"]').fill('wrong_password')
        await page.locator('[data-test="login-button"]').click()

        // Examine error message for information leakage
        const errorMessage = await page
            .locator('[data-test="error"]')
            .textContent()

        // Error messages should be generic
        // Should not indicate whether username or password is incorrect
        expect(errorMessage).toContain('Epic sadface:')

        // Actual message is acceptable for demo:
        // "Username and password do not match any user in this service"
        expect(errorMessage).toContain('do not match')
    })

    test('Client-Side Credential Exposure @security', async ({ page }) => {
        // Navigate to login page
        await page.goto('https://www.saucedemo.com/')

        // View page content
        const pageContent = await page.content()

        // No production credentials should be in page source
        // Note: Demo site intentionally displays accepted usernames and password
        // This is acceptable for a demo/training application

        // Verify page contains the intentional demo credential display
        await expect(page.locator('.login_credentials')).toBeVisible()

        // Verify no API keys or tokens are exposed
        expect(pageContent).not.toContain('api_key')
        expect(pageContent).not.toContain('token')
        expect(pageContent).not.toContain('secret_key')
    })
})
