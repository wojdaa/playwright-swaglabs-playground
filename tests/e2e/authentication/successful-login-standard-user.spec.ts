import { test, expect } from '@playwright/test'
import { LoginPage } from '../../../pages/login.page'
import { InventoryPage } from '../../../pages/inventory.page'
import { NavigationPage } from '../../../pages/navigation.page'
import { getUser } from '../../../utils/config'

test.describe('Authentication & User Management', () => {
    test('Successful Login - Standard User @smoke @regression', async ({
        page,
    }) => {
        const loginPage = new LoginPage(page)
        const inventoryPage = new InventoryPage(page)
        const navigation = new NavigationPage(page)
        const user = getUser('standard_user')

        await page.goto('/')
        await loginPage.assertLoginFieldsVisible()
        await loginPage.assertAcceptedUsernamesTextVisible()
        await loginPage.login(user.username, user.password!)
        await expect(page).toHaveURL(/inventory\.html/)
        await inventoryPage.assertInventoryPageDisplayed()
        await inventoryPage.assertProductCount(6)
        await navigation.assertMenuButtonVisible()
        await inventoryPage.assertShoppingCartLinkVisible()
        await loginPage.assertNoErrorDisplayed()
    })
})
