import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Login Page - Accessibility Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    // Known application accessibility issues:
    // - Missing main landmark (landmark-one-main)
    // - Missing h1 heading (page-has-heading-one)
    // - Content not in landmarks (region violation) - login form, logo, credentials not in landmarks
    test.fixme(
        'should not have any automatically detectable accessibility issues @accessibility',
        async ({ page }) => {
            const accessibilityScanResults = await new AxeBuilder({
                page,
            }).analyze()
            expect(accessibilityScanResults.violations).toEqual([])
        }
    )

    test('should have proper form labels @accessibility', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
            .include('[data-test="username"]')
            .include('[data-test="password"]')
            .analyze()
        expect(accessibilityScanResults.violations).toEqual([])
    })

    test('should support keyboard navigation @accessibility', async ({
        page,
    }) => {
        // Tab to username field
        await page.keyboard.press('Tab')
        await expect(page.locator('[data-test="username"]')).toBeFocused()

        // Tab to password field
        await page.keyboard.press('Tab')
        await expect(page.locator('[data-test="password"]')).toBeFocused()

        // Tab to login button
        await page.keyboard.press('Tab')
        await expect(page.locator('[data-test="login-button"]')).toBeFocused()
    })

    // Known application issue: Error button missing discernible text (button-name violation)
    // The error close button has no accessible name - no visible text, aria-label, or title
    test.fixme(
        'should have accessible error messages @accessibility',
        async ({ page }) => {
            // Trigger error
            await page.locator('[data-test="login-button"]').click()

            // Check if error message is accessible
            const accessibilityScanResults = await new AxeBuilder({ page })
                .include('[data-test="error"]')
                .analyze()
            expect(accessibilityScanResults.violations).toEqual([])
        }
    )

    test('should have sufficient color contrast @accessibility', async ({
        page,
    }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2aa'])
            .analyze()

        const colorContrastViolations =
            accessibilityScanResults.violations.filter(
                (violation) => violation.id === 'color-contrast'
            )
        expect(colorContrastViolations).toEqual([])
    })
})
