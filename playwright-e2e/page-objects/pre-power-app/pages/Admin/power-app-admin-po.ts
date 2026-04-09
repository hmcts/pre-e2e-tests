import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../../base';

export class PowerAppAdminPage extends Base {
  constructor(page: Page) {
    super(page);
  }
  public readonly $interactive = {
    manageCasesButton: this.iFrame.locator('[data-control-name="AdmManageCasesGrpBtn"]'),
    manageUsersButton: this.iFrame.locator('[data-control-name="AdmManageUsersGrpBtn"]'),
    manageRecordingsButton: this.iFrame.locator('[data-control-name="AdmManageRecordingsGrpBtn"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnAdminPage(): Promise<void> {
    await expect(this.$interactive.manageCasesButton).toBeVisible({ timeout: 15000 });
    await expect(this.$interactive.manageUsersButton).toBeVisible({ timeout: 15000 });
    await expect(this.$interactive.manageRecordingsButton).toBeVisible({ timeout: 15000 });
  }
}
