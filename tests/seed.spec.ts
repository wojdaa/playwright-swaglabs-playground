import { test, expect } from '@playwright/test'
import { loginAs } from '../utils/test-helpers'

test.describe('Seed Test', () => {
    test('should successfully login and view inventory', async ({ page }) => {
        await page.goto('/')
        await loginAs(page, 'standard_user')

        await expect(page).toHaveURL(/inventory\.html/)
        await expect(page.locator('.title')).toHaveText('Products')
        await expect(page.locator('.inventory_item')).toHaveCount(6)
    })
})
