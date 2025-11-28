import { test, expect } from '@playwright/test'

test.describe('Network resilience - inventory maintenance', () => {
    test('shows maintenance page when inventory is under maintenance @network @regression', async ({
        page,
    }) => {
        await page.route('**/inventory.html', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'text/html',
                body: `
          <html>
            <head><title>Maintenance</title></head>
            <body>
              <h1 id="maintenance-banner">Maintenance in progress</h1>
              <p>Please try again later.</p>
            </body>
          </html>
        `,
            })
        })

        await page.goto('/inventory.html')
        await expect(page.locator('#maintenance-banner')).toBeVisible()
        await expect(page.getByText('Please try again later.')).toBeVisible()
    })
})
