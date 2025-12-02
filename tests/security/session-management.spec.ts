// spec: test-plan-security-soft-owasp.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test'
import { loginAs } from '../../utils/test-helpers'
import { getCookie } from '../../utils/security-helpers'

test.describe('Session Management', () => {
    test('Session Fixation @security', async ({ page }) => {
        // Navigate to site without logging in
        await page.goto('https://www.saucedemo.com/')

        // Note any session cookies set before login
        const preLoginCookie = await getCookie(page, 'session-username')

        // Pre-login, there should be no session cookie
        expect(preLoginCookie).toBeUndefined()

        // Login with valid credentials
        await loginAs(page, 'standard_user')

        // Verify session ID/cookie was created after login
        const postLoginCookie = await getCookie(page, 'session-username')

        // Session identifier should be established after authentication
        expect(postLoginCookie).toBeDefined()
        expect(postLoginCookie?.value).toBe('standard_user')
    })

    test('Logout Session Termination @security', async ({ page }) => {
        // Login with valid credentials
        await page.goto('https://www.saucedemo.com/')
        await loginAs(page, 'standard_user')

        // Note the session cookie value
        const sessionCookie = await getCookie(page, 'session-username')
        expect(sessionCookie?.value).toBe('standard_user')

        // Click on menu and select "Logout"
        await page.locator('[id="react-burger-menu-btn"]').click()
        await page.locator('[id="logout_sidebar_link"]').click()

        // Verify redirect to login page
        await expect(page).toHaveURL(/saucedemo\.com\/$/)

        // Verify session cookie is cleared/invalidated
        const postLogoutCookie = await getCookie(page, 'session-username')
        expect(postLogoutCookie).toBeUndefined()

        // Press browser "Back" button
        await page.goBack()

        // Attempting to access protected pages should redirect to login
        // or cookie should remain cleared
        const afterBackCookie = await getCookie(page, 'session-username')
        expect(afterBackCookie).toBeUndefined()
    })

    test('Concurrent Session Handling @security', async ({ browser }) => {
        // Create two separate browser contexts (simulating two browsers)
        const context1 = await browser.newContext()
        const context2 = await browser.newContext()

        const page1 = await context1.newPage()
        const page2 = await context2.newPage()

        // Login with standard_user in Browser A
        await page1.goto('https://www.saucedemo.com/')
        await loginAs(page1, 'standard_user')

        // Verify login in Browser A
        const cookie1 = await getCookie(page1, 'session-username')
        expect(cookie1?.value).toBe('standard_user')

        // Login with same credentials in Browser B
        await page2.goto('https://www.saucedemo.com/')
        await loginAs(page2, 'standard_user')

        // Verify login in Browser B
        const cookie2 = await getCookie(page2, 'session-username')
        expect(cookie2?.value).toBe('standard_user')

        // Perform actions in both browsers - sessions should remain independent
        await page1.goto('https://www.saucedemo.com/inventory.html')
        await expect(page1.locator('.inventory_item')).toHaveCount(6)

        await page2.goto('https://www.saucedemo.com/inventory.html')
        await expect(page2.locator('.inventory_item')).toHaveCount(6)

        // Document if multiple sessions are allowed (they are)
        // Sessions should remain independent - actions in one should not affect the other
        const finalCookie1 = await getCookie(page1, 'session-username')
        const finalCookie2 = await getCookie(page2, 'session-username')

        expect(finalCookie1?.value).toBe('standard_user')
        expect(finalCookie2?.value).toBe('standard_user')

        // Cleanup
        await context1.close()
        await context2.close()
    })
})
