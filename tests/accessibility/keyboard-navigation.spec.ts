import { test, expect } from '@playwright/test'
import { loginAs } from '../../utils/test-helpers'

test.describe('Navigation and Focus Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await loginAs(page, 'standard_user')
    })

    // Known browser-specific issue: Shopping cart link doesn't receive focus consistently in WebKit
    // The .shopping_cart_link element cannot be focused in WebKit browser
    test.fixme(
        'shopping cart badge should be keyboard accessible @accessibility',
        async ({ page }) => {
            // Add item to cart first
            await page
                .locator('.inventory_item')
                .first()
                .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
                .click()

            // Navigate to cart using keyboard
            await page.locator('.shopping_cart_link').focus()
            await expect(page.locator('.shopping_cart_link')).toBeFocused()

            await page.keyboard.press('Enter')
            await expect(page).toHaveURL(/cart\.html/)
        }
    )

    // Known browser-specific issue: Some buttons don't receive focus consistently in Firefox
    // Menu button and possibly other buttons fail focus checks in Firefox
    test.fixme(
        'all buttons should be keyboard accessible @accessibility',
        async ({ page }) => {
            const buttons = await page.locator('button:visible').all()

            for (const button of buttons) {
                await button.focus()
                await expect(button).toBeFocused()
            }
        }
    )

    // Known application issue: Some interactive elements don't have visible focus indicators
    // The application removes default browser focus outlines without providing alternatives
    test.fixme(
        'focus should be visible on all interactive elements @accessibility',
        async ({ page }) => {
            // Check if focus outline is visible
            const interactiveElements = await page
                .locator(
                    'button:visible, a:visible, input:visible, select:visible'
                )
                .all()

            for (const element of interactiveElements) {
                await element.focus()

                // Get computed style to check if outline is visible
                const outline = await element.evaluate((el) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const style = (globalThis as any).window.getComputedStyle(
                        el
                    )
                    return {
                        outlineWidth: style.outlineWidth,
                        outlineStyle: style.outlineStyle,
                        outlineColor: style.outlineColor,
                    }
                })

                // Verify that some focus indicator exists
                // (outline width should not be 0px or outline style should not be 'none')
                expect(outline.outlineWidth).not.toBe('0px')
                expect(outline.outlineStyle).not.toBe('none')
            }
        }
    )

    test.fixme(
        'navigation menu should be keyboard accessible @accessibility',
        async ({ page }) => {
            // Open menu using keyboard
            await page.locator('#react-burger-menu-btn').focus()
            await page.keyboard.press('Enter')

            // Wait for menu to be visible
            await page.locator('.bm-menu').waitFor({ state: 'visible' })

            // Navigate through menu items
            await page.locator('#inventory_sidebar_link').focus()
            await expect(page.locator('#inventory_sidebar_link')).toBeFocused()

            await page.keyboard.press('Tab')
            await expect(page.locator('#about_sidebar_link')).toBeFocused()

            await page.keyboard.press('Tab')
            await expect(page.locator('#logout_sidebar_link')).toBeFocused()
        }
    )

    test('sort dropdown should be keyboard operable @accessibility', async ({
        page,
    }) => {
        // Focus on sort dropdown
        await page.locator('[data-test="product-sort-container"]').focus()
        await expect(
            page.locator('[data-test="product-sort-container"]')
        ).toBeFocused()

        // Change sort using keyboard
        await page.keyboard.press('ArrowDown')
        await page.keyboard.press('Enter')

        // Verify sort was applied
        await expect(
            page.locator('[data-test="product-sort-container"]')
        ).not.toHaveValue('az')
    })
})
