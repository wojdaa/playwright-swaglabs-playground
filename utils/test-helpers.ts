import { Page, expect } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import { UserType, getUser } from './config'

export async function loginAs(page: Page, userType: UserType) {
    const loginPage = new LoginPage(page)
    const user = getUser(userType)

    await page.goto('/')
    await loginPage.login(user.username, user.password!)
}

export async function addItemsToCart(page: Page, itemNames: string[]) {
    for (const itemName of itemNames) {
        const itemId = convertProductNameToId(itemName)
        await page.click(`[data-test="add-to-cart-${itemId}"]`)
    }
}

export function convertProductNameToId(productName: string): string {
    return productName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
}

export async function getCartCount(page: Page): Promise<number> {
    const badge = page.locator('.shopping_cart_badge')
    if (await badge.isVisible()) {
        const text = await badge.textContent()
        return parseInt(text || '0', 10)
    }
    return 0
}

export async function assertUrlContains(page: Page, urlPart: string) {
    await expect(page).toHaveURL(new RegExp(urlPart))
}

export async function waitForPageLoad(page: Page, timeout?: number) {
    await page.waitForLoadState('networkidle', { timeout })
}

/**
 * Takes a visual screenshot using Playwright's built-in screenshot comparison.
 * Automatically sanitizes the filename and uses best practices for visual testing.
 *
 * @param page - The Playwright Page object
 * @param screenshotName - The name for the screenshot (will be sanitized)
 * @param options - Optional screenshot options
 * @returns A promise that resolves when the screenshot assertion completes
 */
export async function takeVisualSnapshot(
    page: Page,
    screenshotName: string,
    options?: {
        fullPage?: boolean
        maxDiffPixels?: number
        maxDiffPixelRatio?: number
    }
) {
    const sanitizedName = sanitizeScreenshotName(screenshotName)

    await expect(page).toHaveScreenshot(sanitizedName, {
        fullPage: options?.fullPage ?? true,
        maxDiffPixels: options?.maxDiffPixels,
        maxDiffPixelRatio: options?.maxDiffPixelRatio,
    })
}

/**
 * Sanitizes a screenshot filename by:
 * - Converting to lowercase
 * - Replacing spaces with hyphens
 * - Removing special characters except hyphens and underscores
 * - Ensuring .png extension
 *
 * @param name - The original screenshot name
 * @returns The sanitized filename
 */
function sanitizeScreenshotName(name: string): string {
    // Remove .png extension if present to avoid duplication
    let sanitized = name.replace(/\.png$/i, '')

    // Convert to lowercase and replace spaces with hyphens
    sanitized = sanitized.toLowerCase().replace(/\s+/g, '-')

    // Remove any characters that aren't alphanumeric, hyphens, or underscores
    sanitized = sanitized.replace(/[^a-z0-9\-_]/g, '')

    // Remove consecutive hyphens
    sanitized = sanitized.replace(/-+/g, '-')

    // Remove leading/trailing hyphens
    sanitized = sanitized.replace(/^-+|-+$/g, '')

    // Ensure .png extension
    return `${sanitized}.png`
}
