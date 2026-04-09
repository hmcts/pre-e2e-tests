import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../../base';

export class PowerAppManageCourtAccessPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    manageCourtAccessButton: this.iFrame.locator('[data-control-name="AdmMngUsrsSrchUsrMenuGrpBtn_1"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    courtAccessLabel: this.iFrame.locator('[data-control-name="AdmMngCourtAccessHeader_Lbl"]'),
    selectedCourt: this.iFrame.locator('[data-control-name="AdmMngCourtAccessSelectCourt_DD"] .appmagic-dropdown-selected-text'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnManageCourtAccessPage(): Promise<void> {
    await expect(this.$interactive.manageCourtAccessButton).toBeVisible({ timeout: 15000 });
  }

  public async selectCourt(courtName: string): Promise<void> {
    await this.$interactive.manageCourtAccessButton.click();
    const optionToSelect = this.iFrame.locator(`[data-control-name="AdmMngCourtAccessSelectCourt_DD"] .appmagic-dropdown-option`, {
      hasText: courtName,
    });
    await optionToSelect.click();
    await expect(this.$static.selectedCourt).toHaveText(courtName, { timeout: 5000 });
  }
}
