import { Page, Locator, expect } from '@playwright/test';
import { PrePortalBase } from '../pre-portal-base';

export class PortalManagementPage extends PrePortalBase {
  constructor(page: Page) {
    super(page);
  }

  public async navigateToManagementSection() {
    await this.page.goto('/management');
    await expect(this.page).toHaveURL('/management');
    await expect(this.page.locator('h1')).toHaveText('Management');
    await expect(this.page.locator('nav')).toBeVisible();
  }
}
