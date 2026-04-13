import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../../base';

export class PowerAppSearchUserPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    manageUsersButton: this.iFrame.locator('[data-control-name="AdmManageUsersGrpBtn"]'),
    searchUserButton: this.iFrame.locator('[data-control-name="AdmMngUsrsSrchUsrMenuGrpBtn"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    searchUserLabel: this.iFrame.locator('[data-control-name="AdmMngUsrsSrchUserLbl"]'),
    listItemsInSearchResultsGallery: this.iFrame.locator('[data-control-part="gallery-item"]'),
    userNameInSearchResults: this.iFrame.locator('[data-control-name="AdmMngUsrsUsrNameLbl"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnSearchUserPage(): Promise<void> {
    await expect(this.$interactive.searchUserButton).toBeVisible({ timeout: 10_000 });
  }

  public async searchForAnExistingUser(userName: string): Promise<void> {
    await expect(async () => {
      await this.$interactive.searchUserButton.fill(userName);
      await expect(this.$interactive.searchUserButton).toHaveValue(userName, { timeout: 5000 });
      await this.verifySingleUserNameIsReturned();
    }).toPass({ intervals: [1_000], timeout: 15_000 });
    await expect(this.$static.userNameInSearchResults).toContainText(userName);
  }
  private async verifySingleUserNameIsReturned(): Promise<void> {
    await expect(this.$static.listItemsInSearchResultsGallery).toHaveCount(1, { timeout: 5000 });
  }
}
