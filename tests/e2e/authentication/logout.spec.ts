import { test, expect } from '@playwright/test'
import { loginAs } from '../../../utils/test-helpers'
import { NavigationPage } from '../../../pages/navigation.page'

test.describe('Authentication & User Management', () => {
    test('Successful Logout @smoke @regression', async ({ page }) => {
        const navigation = new NavigationPage(page)

        await page.goto('/')
        await loginAs(page, 'standard_user')
        await navigation.openMenu()
        await navigation.assertMenuVisible()
        await navigation.logoutLink.click()
        await expect(page).toHaveURL('/')
        await expect(page.locator('[data-test="username"]')).toBeVisible()
    })
})
