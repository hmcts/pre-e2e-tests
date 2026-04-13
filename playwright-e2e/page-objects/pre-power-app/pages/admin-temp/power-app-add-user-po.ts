import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../../base';

export class PowerAppAddUserPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    manageUsersButton: this.iFrame.locator('[data-control-name="AdmManageUsersGrpBtn"]'),
    addUserButton: this.iFrame.locator('[data-control-name="AdmMngUsrsAddUsrMenuGrpAddUserIcn"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $input = {
    addNewUser: this.iFrame.locator('[data-control-name="AdminMngUsrsHintTxt_lbl"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnAddUserPage(): Promise<void> {
    await expect(this.$interactive.manageUsersButton).toBeVisible({ timeout: 15000 });
  }

  public async verifyAddUserFormIsVisible(): Promise<void> {
    await expect(this.$interactive.addUserButton).toBeVisible({ timeout: 15000 });
    await expect(this.$input.addNewUser).toBeVisible({ timeout: 15000 });
  }
}
