import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../base';

export class PortalEditRequestPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    caseReference: this.page.getByRole('textbox', { name: 'Case Reference' }),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    sourceRecordingId: this.page.getByLabel('Source Recording id'),
    submitEditRequest: this.page.getByRole('button', { name: 'Submit edit request' }),
  };

  public async verifyUserIsOnEditRequestPage(): Promise<void> {
    await expect(this.$static.title).toHaveText('Edit Request');
  }

  public readonly $static = {
    title: this.page.locator('h1'),
  };

  // async editRequest(requestId: string, newDetails: any) {
  //   await this.page.goto(`/requests/${requestId}/edit`);
  //   await this.page.fill('input[name="title"]', newDetails.title);
  //   await this.page.fill('textarea[name="description"]', newDetails.description);
  //   await this.page.click('button[type="submit"]');
  //}
}
