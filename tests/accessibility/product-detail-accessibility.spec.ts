import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { loginAs } from '../../utils/test-helpers'

test.describe('Product Detail Page - Accessibility Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await loginAs(page, 'standard_user')

        // Navigate to product detail page
        await page
            .locator('.inventory_item')
            .first()
            .locator('.inventory_item_name')
            .click()
    })

    // Known application accessibility issues:
    // - Missing main landmark (landmark-one-main)
    // - Missing h1 heading (page-has-heading-one)
    // - Content not in landmarks (region violation) - product details, menu icon, header not in landmarks
    test.fixme(
        'should not have any automatically detectable accessibility issues @accessibility',
        async ({ page }) => {
            const accessibilityScanResults = await new AxeBuilder({
                page,
            }).analyze()

            expect(accessibilityScanResults.violations).toEqual([])
        }
    )

    test('should have accessible product image @accessibility', async ({
        page,
    }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
            .include('.inventory_details_img')
            .analyze()

        expect(accessibilityScanResults.violations).toEqual([])
    })

    test('back button should be keyboard accessible @accessibility', async ({
        page,
    }) => {
        // Focus on back button
        await page.locator('[data-test="back-to-products"]').focus()
        await expect(
            page.locator('[data-test="back-to-products"]')
        ).toBeFocused()

        // Press Enter to go back
        await page.keyboard.press('Enter')

        // Verify navigation back to inventory
        await expect(page).toHaveURL(/inventory\.html/)
    })

    test('add to cart button should be keyboard accessible @accessibility', async ({
        page,
    }) => {
        // Focus on add to cart button
        await page.locator('[data-test="add-to-cart"]').first().focus()
        await expect(
            page.locator('[data-test="add-to-cart"]').first()
        ).toBeFocused()

        // Press Enter to add to cart
        await page.keyboard.press('Enter')

        // Verify item was added
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1')
    })

    test('should meet color contrast requirements @accessibility', async ({
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
