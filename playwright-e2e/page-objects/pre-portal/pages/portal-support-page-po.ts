import { Page, Locator } from '@playwright/test';
import { PrePortalBase } from '../pre-portal-base';

export class PortalSupportPage extends PrePortalBase {
  constructor(page: Page) {
    super(page);
  }
  public readonly $static = {
    heading: this.page.getByRole('heading', { level: 1, name: 'Edit Request', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $editRequest = {
    heading: this.page.getByRole('heading', { name: 'Edit Request', exact: true }),
    caseReferenceTextbox: this.page.getByRole('textbox', { name: 'Case reference' }),
    searchByCaseReferenceButton: this.page.getByRole('button', { name: 'Search by case reference' }),
    sourceRecordingId: this.page.getByRole('textbox', { name: 'Source recording ID' }),
    uploadACsvFile: this.page.getByRole('button', { name: 'Upload a CSV file' }),
    submitEditRequestButton: this.page.getByRole('button', { name: 'Submit' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnSupportPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ pageHeading: this.$editRequest.heading, urlPath: '/support/edit-request' });
  }
}
