import { Page, Locator, expect } from '@playwright/test';
import { PrePortalBase } from '../pre-portal-base';
export class PortalUserAdminPage extends PrePortalBase {
  constructor(page: Page) {
    super(page);
  }
  public readonly navigateToUserProfileSection = async () => {
    await this.page.goto('/user-profile');
  };
}
