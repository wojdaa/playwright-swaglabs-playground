import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { loginAs } from '../../utils/test-helpers'

test.describe('Inventory Page - Accessibility Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await loginAs(page, 'standard_user')
    })

    // Known application accessibility issues:
    // - Missing main landmark (landmark-one-main)
    // - Missing h1 heading (page-has-heading-one)
    // - Content not in landmarks (region violation)
    // - Sort dropdown missing accessible name (select-name violation)
    test.fixme(
        'should not have any automatically detectable accessibility issues @accessibility',
        async ({ page }) => {
            const accessibilityScanResults = await new AxeBuilder({
                page,
            }).analyze()
            expect(accessibilityScanResults.violations).toEqual([])
        }
    )

    test('should have accessible product images @accessibility', async ({
        page,
    }) => {
        // Check if all product images have alt text
        const accessibilityScanResults = await new AxeBuilder({ page })
            .include('.inventory_item_img')
            .analyze()
        expect(accessibilityScanResults.violations).toEqual([])
    })

    test('should have proper heading hierarchy @accessibility', async ({
        page,
    }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()

        const headingViolations = accessibilityScanResults.violations.filter(
            (violation) =>
                violation.id === 'heading-order' ||
                violation.id === 'page-has-heading-one'
        )
        expect(headingViolations).toEqual([])
    })

    test('should support keyboard navigation for product actions @accessibility', async ({
        page,
    }) => {
        // Focus on first add to cart button
        await page.locator('.inventory_item').first().locator('button').focus()
        await expect(
            page.locator('.inventory_item').first().locator('button')
        ).toBeFocused()

        // Press Enter to add to cart
        await page.keyboard.press('Enter')

        // Verify item was added
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1')
    })

    // Known application issue: Sort dropdown missing accessible name/label
    // The select element has no implicit label, explicit label, aria-label, or aria-labelledby
    test.fixme(
        'should have accessible sorting dropdown @accessibility',
        async ({ page }) => {
            const accessibilityScanResults = await new AxeBuilder({ page })
                .include('.product_sort_container')
                .analyze()
            expect(accessibilityScanResults.violations).toEqual([])
        }
    )

    // Known browser-specific issue: Menu doesn't open consistently in Firefox
    // The .bm-menu element times out waiting to be visible in Firefox
    test.fixme(
        'should have accessible navigation menu @accessibility',
        async ({ page }) => {
            // Open menu
            await page.locator('#react-burger-menu-btn').click()

            // Wait for menu to be visible
            await page.locator('.bm-menu').waitFor({ state: 'visible' })

            const accessibilityScanResults = await new AxeBuilder({ page })
                .include('.bm-menu')
                .analyze()
            expect(accessibilityScanResults.violations).toEqual([])
        }
    )

    // Known application issue: Sort dropdown missing accessible name (select-name violation)
    // This is a WCAG 2.1 Level A requirement that fails for the product sort dropdown
    test.fixme(
        'should meet WCAG 2.1 Level AA standards @accessibility',
        async ({ page }) => {
            const accessibilityScanResults = await new AxeBuilder({ page })
                .withTags(['wcag2aa', 'wcag21aa'])
                .analyze()
            expect(accessibilityScanResults.violations).toEqual([])
        }
    )
})
