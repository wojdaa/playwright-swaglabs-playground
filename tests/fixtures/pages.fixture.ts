import { test as base } from '@playwright/test'
import { LoginPage } from '../../pages/login.page'
import { InventoryPage } from '../../pages/inventory.page'
import { CartPage } from '../../pages/cart.page'
import { CheckoutStepOnePage } from '../../pages/checkout-step-one.page'
import { CheckoutStepTwoPage } from '../../pages/checkout-step-two.page'
import { CheckoutCompletePage } from '../../pages/checkout-complete.page'
import { NavigationPage } from '../../pages/navigation.page'
import { ProductDetailPage } from '../../pages/product-detail.page'

type PageFixtures = {
    loginPage: LoginPage
    inventoryPage: InventoryPage
    cartPage: CartPage
    checkoutStepOnePage: CheckoutStepOnePage
    checkoutStepTwoPage: CheckoutStepTwoPage
    checkoutCompletePage: CheckoutCompletePage
    navigationPage: NavigationPage
    productDetailPage: ProductDetailPage
}

export const test = base.extend<PageFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page))
    },

    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page))
    },

    cartPage: async ({ page }, use) => {
        await use(new CartPage(page))
    },

    checkoutStepOnePage: async ({ page }, use) => {
        await use(new CheckoutStepOnePage(page))
    },

    checkoutStepTwoPage: async ({ page }, use) => {
        await use(new CheckoutStepTwoPage(page))
    },

    checkoutCompletePage: async ({ page }, use) => {
        await use(new CheckoutCompletePage(page))
    },

    navigationPage: async ({ page }, use) => {
        await use(new NavigationPage(page))
    },

    productDetailPage: async ({ page }, use) => {
        await use(new ProductDetailPage(page))
    },
})

export { expect } from '@playwright/test'

/**
 * Auth state file paths for storageState-based authentication.
 * Used by `auth.setup.ts` (setup project) to persist login state, and
 * referenced in the `authenticated` playwright project in playwright.config.ts.
 */
export const AUTH_STATE = {
    standardUser: '.auth/standard-user.json',
    problemUser: '.auth/problem-user.json',
    performanceUser: '.auth/performance-glitch-user.json',
}

export type { PageFixtures }
