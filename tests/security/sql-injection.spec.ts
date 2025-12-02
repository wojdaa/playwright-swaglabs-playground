// spec: test-plan-security-soft-owasp.md
// seed: tests/seed.spec.ts

import { test } from '@playwright/test'
import {
    attemptLogin,
    verifyLoginFailed,
    verifyNoSqlErrors,
    SQL_INJECTION_PAYLOADS,
} from '../../utils/security-helpers'

test.describe('SQL Injection Testing', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/')
    })

    test('SQL Injection in Login Form - Username Field @security', async ({
        page,
    }) => {
        // In the username field, enter: ' OR '1'='1
        // In the password field, enter: ' OR '1'='1
        await attemptLogin(
            page,
            SQL_INJECTION_PAYLOADS.basic,
            SQL_INJECTION_PAYLOADS.basic
        )

        // Verify error message is displayed
        await verifyLoginFailed(page)

        // Verify no database errors are exposed
        await verifyNoSqlErrors(page)
    })

    test('SQL Injection with UNION Attack @security', async ({ page }) => {
        // In the username field, enter: admin' UNION SELECT NULL--
        // In the password field, enter: test
        await attemptLogin(page, SQL_INJECTION_PAYLOADS.union, 'test')

        // Verify login should fail gracefully
        await verifyLoginFailed(page)

        // Verify no SQL error messages displayed
        await verifyNoSqlErrors(page)
    })

    test('SQL Injection with Comment Sequences @security', async ({ page }) => {
        // In the username field, enter: admin'--
        // In the password field, enter: anything
        await attemptLogin(page, SQL_INJECTION_PAYLOADS.comment, 'anything')

        // Verify login should fail
        await verifyLoginFailed(page)

        // Verify no bypass of authentication
        await verifyNoSqlErrors(page)
    })

    test('SQL Injection with Semicolon and DROP TABLE @security', async ({
        page,
    }) => {
        // In the username field, enter: admin'; DROP TABLE users--
        // In the password field, enter: test
        await attemptLogin(page, SQL_INJECTION_PAYLOADS.semicolon, 'test')

        // Verify login should fail
        await verifyLoginFailed(page)

        // Verify no database errors exposed
        await verifyNoSqlErrors(page)
    })
})
