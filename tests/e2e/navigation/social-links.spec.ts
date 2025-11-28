import { test, expect } from '@playwright/test'
import { loginAs } from '../../../utils/test-helpers'
import { NavigationPage } from '../../../pages/navigation.page'

test.describe('Navigation & Menu', () => {
    let navigation: NavigationPage

    test.beforeEach(async ({ page }) => {
        navigation = new NavigationPage(page)
        await page.goto('/')
        await loginAs(page, 'standard_user')
    })

    // Known browser-specific issue: Twitter/X link times out in Firefox
    // The external page load times out waiting for the page to fully load in Firefox
    test.fixme(
        'Social Media Links - Twitter @regression',
        async ({ context }) => {
            const pagePromise = context.waitForEvent('page')
            await navigation.twitterLink.click()
            const newPage = await pagePromise

            await newPage.waitForLoadState()
            expect(newPage.url()).toContain('x.com')
        }
    )

    test('Social Media Links - Facebook @regression', async ({ context }) => {
        const pagePromise = context.waitForEvent('page')
        await navigation.facebookLink.click()
        const newPage = await pagePromise
        
        await newPage.waitForLoadState()
        expect(newPage.url()).toContain('facebook.com')
    })

    test('Social Media Links - LinkedIn @regression', async ({ context }) => {
        const pagePromise = context.waitForEvent('page')
        await navigation.linkedinLink.click()
        const newPage = await pagePromise

        await newPage.waitForLoadState()
        expect(newPage.url()).toContain('linkedin.com')
    })
})
