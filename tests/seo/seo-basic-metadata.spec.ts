import { test, expect } from '@playwright/test'
import { loginAs, verifyBasicSeoMetadata } from '../../utils/test-helpers'

test.describe('SEO Basic Tests', () => {
    test('Login Page SEO Metadata', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/ @seo')
        await verifyBasicSeoMetadata(page)

        const metaCharset = page.locator('meta[charset]')
        await expect(metaCharset).toHaveAttribute('charset', 'utf-8')
    })

    test('Inventory Page SEO Metadata @seo', async ({ page }) => {
        await page.goto('/')
        await loginAs(page, 'standard_user')
        await verifyBasicSeoMetadata(page)
    })

    test('Cart Page SEO Metadata Consistency @seo', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/cart.html')
        await verifyBasicSeoMetadata(page)

        const canonicalLink = page.locator('link[rel="canonical"]')
        await expect(canonicalLink).toHaveCount(0)
    })
})
