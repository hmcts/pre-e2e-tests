import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../base';
import { config } from '../../../utils';

export class PortalHomePage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $static = {
    heading: this.page.locator('h1[class*="govuk-heading"]'),
    recording: this.page.locator('tr[id*="recording"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    editRequestButton: this.page.getByRole('link', { name: 'Edit Request' }),
  } as const satisfies Record<string, Locator>;

  public async goTo(): Promise<void> {
    await this.page.goto(config.urls.prePortalUrl);
  }

  public async verifyUserIsOnHomePage(): Promise<void> {
    await expect(this.$static.heading).toBeVisible({ timeout: 30_000 });
  }

  public async selectRecordingByCaseReference(caseRef: string): Promise<void> {
    const recordingLink = this.$static.recording.filter({ hasText: caseRef }).locator('[class="govuk-link"]');
    await recordingLink.click();
  }
}
