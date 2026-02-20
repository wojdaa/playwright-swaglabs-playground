import { defineConfig, devices } from '@playwright/test'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '.env') })

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: [
        ['list'],
        ['junit', { outputFile: 'test-results/playwright-junit.xml' }],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ],
    use: {
        baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },

    expect: {
        toHaveScreenshot: {
            maxDiffPixelRatio: 0.01,
            threshold: 0.2,
        },
    },

    projects: [
        // Setup project: runs auth.setup.ts to persist login state via storageState.
        // See tests/fixtures/pages.fixture.ts and references/fixtures-hooks.md.
        {
            name: 'setup',
            testMatch: /.*\.setup\.ts/,
        },

        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        // Authenticated project: reuses saved storageState so tests skip the
        // login flow. Add tests here that require a logged-in standard_user.
        // {
        //     name: 'authenticated',
        //     use: {
        //         ...devices['Desktop Chrome'],
        //         storageState: '.auth/standard-user.json',
        //     },
        //     dependencies: ['setup'],
        // },

        // {
        //     name: 'firefox',
        //     use: { ...devices['Desktop Firefox'] },
        // },

        // {
        //     name: 'webkit',
        //     use: { ...devices['Desktop Safari'] },
        // },
    ],
})
