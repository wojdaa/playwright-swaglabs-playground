import { test } from '@playwright/test'

test('network mocking', async ({ page }) => {
    await page.route('/api/*', route => route.fulfill({ status: 500 }))

})
