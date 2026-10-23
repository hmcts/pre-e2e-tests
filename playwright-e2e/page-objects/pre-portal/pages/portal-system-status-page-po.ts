import { Page, Locator } from '@playwright/test';
import { PrePortalBase } from '../pre-portal-base';

export class PortalSystemStatusPage extends PrePortalBase {
  constructor(page: Page) {
    super(page);
  }
  public readonly $static = {
    heading: this.page.getByRole('heading', { level: 1, name: 'System Status', exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ pageHeading: this.$static.heading, urlPath: '/system/status' });
  }
}
