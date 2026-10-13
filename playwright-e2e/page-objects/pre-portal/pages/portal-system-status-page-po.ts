import { Page, Locator, expect } from '@playwright/test';
import { PrePortalBase } from '../pre-portal-base';

export class PortalSystemStatusPage extends PrePortalBase {
  constructor(page: Page) {
    super(page);
  }
  public async navigateToSystemStatusSection() {
    await this.page.goto('/system-status');
  }
}
