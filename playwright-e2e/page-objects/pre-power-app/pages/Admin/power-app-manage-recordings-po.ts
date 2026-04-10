import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../../base';

export class PowerAppManageRecordingsPage extends Base {
  searchForAnExistingRecording(caseReference: string) {
    throw new Error('Method not implemented.');
  }
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    manageRecordingsButton: this.iFrame.locator('[data-control-name="AdmManageRecordingsGrpBtn"]'),
    manageRecordingsLabel: this.iFrame.locator('[data-control-name="AdmManageSessionsGrpManageBookingsSearchTxt"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnManageRecordingsPage(): Promise<void> {
    await expect(this.$interactive.manageRecordingsLabel).toBeVisible({ timeout: 15000 });
  }
  public async navigateToManageRecordingsPage(): Promise<void> {
    await this.$interactive.manageRecordingsButton.click();
    const manageRecordingsLabelLocator = this.$interactive.manageRecordingsLabel;
    await expect(async () => {
      await expect(manageRecordingsLabelLocator).toBeVisible();
    }).toPass({ intervals: [1000], timeout: 15000 });
  }
}
