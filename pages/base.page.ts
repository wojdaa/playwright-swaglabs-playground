import { Page } from '@playwright/test'

export class BasePage {
    constructor(public readonly page: Page) {}

    async goto(url: string) {
        await this.page.goto(url)
    }
}
