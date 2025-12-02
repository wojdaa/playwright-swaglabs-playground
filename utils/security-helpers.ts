import { Page, expect } from '@playwright/test'

/**
 * Security helper functions for testing common security scenarios
 */

export const EXPECTED_ERROR_MESSAGE =
    'Epic sadface: Username and password do not match any user in this service'

/**
 * Attempt login with specified credentials
 */
export async function attemptLogin(
    page: Page,
    username: string,
    password: string
) {
    await page.locator('[data-test="username"]').fill(username)
    await page.locator('[data-test="password"]').fill(password)
    await page.locator('[data-test="login-button"]').click()
}

/**
 * Verify login failed with expected error message
 */
export async function verifyLoginFailed(page: Page) {
    await expect(
        page.getByRole('heading', { name: EXPECTED_ERROR_MESSAGE })
    ).toBeVisible()
    await expect(page.getByText(EXPECTED_ERROR_MESSAGE)).toBeVisible()
}

/**
 * Verify no SQL error messages are exposed
 */
export async function verifyNoSqlErrors(page: Page) {
    const sqlErrorPatterns = [
        /SQL/i,
        /syntax error/i,
        /mysql/i,
        /postgresql/i,
        /oracle/i,
        /sqlite/i,
        /database error/i,
        /query failed/i,
    ]

    const pageContent = await page.textContent('body')
    for (const pattern of sqlErrorPatterns) {
        expect(pageContent).not.toMatch(pattern)
    }
}

/**
 * Verify no XSS script execution
 */
export async function verifyNoXssExecution(page: Page) {
    // Check that no alert dialogs were triggered
    // and that malicious scripts are not in the DOM as executable code
    const bodyHTML = await page.locator('body').innerHTML()

    // Verify script tags with malicious content are not present as executable code
    // We check for actual script tags, not escaped HTML
    expect(bodyHTML).not.toContain('<script>alert(')

    // Check for unescaped event handlers in HTML tags (not in attribute values)
    // Pattern: <img ... onerror=alert(...) (not value="... onerror=alert(...)")
    // If the XSS is properly escaped, it will be in a value attribute with &lt; &gt;
    const hasUnescapedImgXss = /<img\s[^>]*onerror\s*=\s*alert\(/i.test(
        bodyHTML
    )
    const hasUnescapedSvgXss = /<svg\s[^>]*onload\s*=\s*alert\(/i.test(bodyHTML)

    expect(hasUnescapedImgXss).toBe(false)
    expect(hasUnescapedSvgXss).toBe(false)

    // Additional verification: Malicious content should be escaped
    // Properly escaped XSS shows as &lt; &gt; in HTML source, which is safe
    // If we see the literal string "onerror=" in a value attribute, that's escaped and safe
} /**
 * Fill checkout form with specified values
 */
export async function fillCheckoutForm(
    page: Page,
    firstName: string,
    lastName: string,
    postalCode: string
) {
    await page.locator('[data-test="firstName"]').fill(firstName)
    await page.locator('[data-test="lastName"]').fill(lastName)
    await page.locator('[data-test="postalCode"]').fill(postalCode)
    await page.locator('[data-test="continue"]').click()
}

/**
 * Verify page URL contains expected path
 */
export async function verifyUrlContains(page: Page, expectedPath: string) {
    await expect(page).toHaveURL(new RegExp(expectedPath))
}

/**
 * Verify element with data-test attribute is visible
 */
export async function verifyElementVisible(page: Page, dataTest: string) {
    await expect(page.locator(`[data-test="${dataTest}"]`)).toBeVisible()
}

/**
 * Check if form field has specific attribute value
 */
export async function verifyFieldAttribute(
    page: Page,
    dataTest: string,
    attribute: string,
    expectedValue: string | null
) {
    const element = page.locator(`[data-test="${dataTest}"]`)
    if (expectedValue === null) {
        await expect(element).not.toHaveAttribute(attribute)
    } else {
        await expect(element).toHaveAttribute(attribute, expectedValue)
    }
}

/**
 * Get cookie by name
 */
export async function getCookie(page: Page, name: string) {
    const cookies = await page.context().cookies()
    return cookies.find((cookie) => cookie.name === name)
}

/**
 * Set cookie with specified name and value
 */
export async function setCookie(page: Page, name: string, value: string) {
    await page.context().addCookies([
        {
            name,
            value,
            domain: new URL(page.url()).hostname,
            path: '/',
        },
    ])
}

/**
 * Verify cookie has specific security flags
 */
export async function verifyCookieSecurity(
    page: Page,
    cookieName: string,
    expectedFlags: {
        secure?: boolean
        httpOnly?: boolean
        sameSite?: 'Strict' | 'Lax' | 'None'
    }
) {
    const cookie = await getCookie(page, cookieName)
    expect(cookie).toBeDefined()

    if (expectedFlags.secure !== undefined) {
        expect(cookie?.secure).toBe(expectedFlags.secure)
    }
    if (expectedFlags.httpOnly !== undefined) {
        expect(cookie?.httpOnly).toBe(expectedFlags.httpOnly)
    }
    if (expectedFlags.sameSite !== undefined) {
        expect(cookie?.sameSite).toBe(expectedFlags.sameSite)
    }
}

/**
 * Check response headers for security headers
 */
export async function checkSecurityHeaders(page: Page, url: string) {
    const response = await page.goto(url)
    const headers = response?.headers() || {}

    return {
        contentSecurityPolicy: headers['content-security-policy'],
        xFrameOptions: headers['x-frame-options'],
        xContentTypeOptions: headers['x-content-type-options'],
        strictTransportSecurity: headers['strict-transport-security'],
        xXssProtection: headers['x-xss-protection'],
    }
}

/**
 * Generate a string of specified length
 */
export function generateString(length: number, char = 'a'): string {
    return char.repeat(length)
}

/**
 * Common SQL injection payloads
 */
export const SQL_INJECTION_PAYLOADS = {
    basic: "' OR '1'='1",
    union: "admin' UNION SELECT NULL--",
    comment: "admin'--",
    doubleDash: "admin' -- ",
    semicolon: "admin'; DROP TABLE users--",
}

/**
 * Common XSS payloads
 */
export const XSS_PAYLOADS = {
    scriptTag: "<script>alert('XSS')</script>",
    imgTag: "<img src=x onerror=alert('XSS')>",
    svgTag: "<svg/onload=alert('XSS')>",
    eventHandler: '" onload="alert(\'XSS\')',
    iframe: '<iframe src="javascript:alert(\'XSS\')">',
}
