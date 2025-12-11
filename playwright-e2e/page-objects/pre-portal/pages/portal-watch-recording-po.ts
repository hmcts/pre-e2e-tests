import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../base';

export class PortalWatchRecordingPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    playRecordingButton: this.page.locator('button[aria-label="Play"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    heading: this.page.locator('h1[class*="govuk-heading"]'),
    recordingDate: this.page.locator('[data-testid="summary-value-date"]'),
    recordingUID: this.page.locator('[data-testid="summary-value-uid"]'),
    recordingVersion: this.page.locator('[data-testid="summary-value-version"]'),
    recordingCourt: this.page.locator('[data-testid="summary-value-court"]'),
    recordingWitness: this.page.locator('[data-testid="summary-value-witness"]'),
    recordingDefendants: this.page.locator('[data-testid="summary-value-defendants"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnWatchRecordingPage(): Promise<void> {
    await expect.poll(() => this.page.url()).toContain('watch');
    await expect(this.page.locator('h1[class*="govuk-heading"]')).toBeVisible({ timeout: 40_000 });
  }
}
