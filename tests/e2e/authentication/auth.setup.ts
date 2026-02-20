/**
 * Authentication Setup
 *
 * This setup test logs in as standard_user and saves the browser storage state
 * (cookies + localStorage) to `.auth/standard-user.json`.
 *
 * Once saved, tests in the `authenticated` playwright project can reuse this
 * state without repeating the login flow, following the storageState pattern
 * described in the Playwright fixtures best practices.
 *
 * Usage in playwright.config.ts:
 * ```ts
 * projects: [
 *   { name: 'setup', testMatch: /.*\.setup\.ts/ },
 *   {
 *     name: 'authenticated',
 *     use: {
 *       ...devices['Desktop Chrome'],
 *       storageState: '.auth/standard-user.json',
 *     },
 *     dependencies: ['setup'],
 *   },
 * ]
 * ```
 */
import { test as setup, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'
import { LoginPage } from '../../../pages/login.page'
import { getUser } from '../../../utils/config'
import { AUTH_STATE } from '../../fixtures/pages.fixture'

setup('authenticate as standard_user', async ({ page }) => {
    const user = getUser('standard_user')

    await page.goto('/')
    const loginPage = new LoginPage(page)
    await loginPage.login(user.username, user.password!)
    await expect(page).toHaveURL(/inventory\.html/)

    // Ensure the auth directory exists
    const authDir = path.dirname(AUTH_STATE.standardUser)
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true })
    }

    await page.context().storageState({ path: AUTH_STATE.standardUser })
})
