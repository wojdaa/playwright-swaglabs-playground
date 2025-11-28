import { expect, Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class NavigationPage extends BasePage {
    readonly hamburgerButton: Locator
    readonly closeMenuButton: Locator
    readonly allItemsLink: Locator
    readonly aboutLink: Locator
    readonly logoutLink: Locator
    readonly resetAppStateLink: Locator
    readonly sidebarMenu: Locator
    readonly twitterLink: Locator
    readonly facebookLink: Locator
    readonly linkedinLink: Locator

    constructor(page: Page) {
        super(page)
        this.hamburgerButton = page.locator('#react-burger-menu-btn')
        this.closeMenuButton = page.locator('#react-burger-cross-btn')
        this.allItemsLink = page.locator('#inventory_sidebar_link')
        this.aboutLink = page.locator('#about_sidebar_link')
        this.logoutLink = page.locator('#logout_sidebar_link')
        this.resetAppStateLink = page.locator('#reset_sidebar_link')
        this.sidebarMenu = page.locator('.bm-menu')
        this.twitterLink = page.locator('[data-test="social-twitter"]')
        this.facebookLink = page.locator('[data-test="social-facebook"]')
        this.linkedinLink = page.locator('[data-test="social-linkedin"]')
    }

    async openMenu() {
        await this.hamburgerButton.click()
        await expect(this.sidebarMenu).toBeVisible()
    }

    async assertMenuButtonVisible() {
        await expect(this.hamburgerButton).toBeVisible()
    }

    async closeMenu() {
        await this.closeMenuButton.click()
        await expect(this.sidebarMenu).toBeHidden()
    }

    async logout() {
        await this.openMenu()
        await this.logoutLink.click()
    }

    async navigateToAllItems() {
        await this.openMenu()
        await this.allItemsLink.click()
    }

    async navigateToAbout() {
        await this.openMenu()
        await this.aboutLink.click()
    }

    async resetAppState() {
        await this.openMenu()
        await this.resetAppStateLink.click()
        await this.closeMenu()
    }

    async assertMenuVisible() {
        await expect(this.sidebarMenu).toBeVisible()
        await expect(this.allItemsLink).toBeVisible()
        await expect(this.aboutLink).toBeVisible()
        await expect(this.logoutLink).toBeVisible()
        await expect(this.resetAppStateLink).toBeVisible()
    }
}
