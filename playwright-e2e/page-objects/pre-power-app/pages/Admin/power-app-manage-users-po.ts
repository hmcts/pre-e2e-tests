import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../../base';

export class PowerAppManageUsersPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    PowerAppManageUsersPageTitle: this.iFrame.locator('[data-control-name="AdmMngUsrsTitle"]'),
    addUserButton: this.iFrame.locator('[data-control-name="AdmMngUsrsAddUsrMenuGrpAddUserBtn"]'),
    searchUserButton: this.iFrame.locator('[data-control-name="AdmMngUsrsSrchUsrMenuGrpBtn"]'),
    manageCourtAccessButton: this.iFrame.locator('[data-control-name="AdmMngUsrsSrchUsrMenuGrpBtn_1"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnManageUsersPage(): Promise<void> {
    await expect(this.$interactive.addUserButton).toBeVisible({ timeout: 15000 });
  }
}
