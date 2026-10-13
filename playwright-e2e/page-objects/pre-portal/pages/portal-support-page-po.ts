import { Page, Locator, expect } from '@playwright/test';
import { PrePortalBase } from '../pre-portal-base';

export class PortalSupportPage extends PrePortalBase {
  constructor(page: Page) {
    super(page);
  }
  public async navigateToSupportSection() {
    await this.page.goto('/support');
  }
}
