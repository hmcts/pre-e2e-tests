import { Page, Locator } from '@playwright/test';
import { PrePortalBase } from '../pre-portal-base';

export class PortalUserAdminPage extends PrePortalBase {
  constructor(page: Page) {
    super(page);
  }
  public readonly $static = {
    heading: this.page.getByRole('heading', { level: 1, name: 'This page is under development', exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ pageHeading: this.$static.heading, urlPath: '/user-admin/onboarding' });
  }
}
