import { Page, Locator } from '@playwright/test';
import { PrePortalBase } from '../pre-portal-base';

export class PortalHelpPage extends PrePortalBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $static = {
    heading: this.page.getByRole('heading', { level: 1, name: 'Help', exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnHelpPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ pageHeading: this.$static.heading, urlPath: '/help' });
  }
}
