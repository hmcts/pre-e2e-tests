import { Page, Locator, expect } from '@playwright/test';
import { PrePortalBase } from '../pre-portal-base';

export class PortalSignOutPage extends PrePortalBase {
  constructor(page: Page) {
    super(page);
  }

  public async signOut() {
    await this.page.goto('/sign-out');
    await expect(this.page).toHaveURL('/sign-out');
    await expect(this.page.locator('h1')).toHaveText('Sign Out');
  }
}
