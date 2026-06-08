import { Page, Locator, expect } from '@playwright/test';
import { PrePortalBase } from '../pre-portal-base';
import { config } from '../../../utils';

export class PortalHomePage extends PrePortalBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $static = {
    heading: this.page.locator('h1[class*="govuk-heading"]'),
    recordingHeading: this.page.locator('h2[class="govuk-heading-m"]'),
    recordingTableRow: this.page.locator('tr[id*="recording"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    caseReferenceSearchInput: this.page.locator('#caseReference'),
    caseReferenceSearchButton: this.page.getByRole('button', { name: 'Search' }),
  } as const satisfies Record<string, Locator>;

  public async goTo(): Promise<void> {
    await this.page.goto(config.urls.prePortalUrl);
  }

  public async verifyUserIsOnHomePage(): Promise<void> {
    await expect(this.$static.heading).toBeVisible({ timeout: 30_000 });
  }

  /**
   *  Selects a recording by case reference and version number
   * @param caseRef
   * @param recordingVersion
   */
  public async selectRecordingByCaseReferenceAndVersion(caseRef: string, recordingVersion: number): Promise<void> {
    await this.searchForCaseReferenceIfAvailable(caseRef);
    const recordingLink = this.$static.recordingTableRow
      .filter({ hasText: caseRef })
      .filter({
        has: this.page.locator(`td:text-is("${recordingVersion}")`),
      })
      .locator('[class="govuk-link"]');
    await this.navigationClick(recordingLink);
  }

  /**
   *
   * @param caseDetails - An object containing details of the case to verify on the home page
   * Verifies the details of a case reference on the home page
   *
   */
  public async verifyDetailsOfCaseReferenceOnHomePage(caseDetails: {
    caseRef: string;
    court?: string;
    date?: string;
    witness: string;
    defendants: string[];
    recordingVersion: number;
    status: 'Active';
  }): Promise<void> {
    await this.searchForCaseReferenceIfAvailable(caseDetails.caseRef);
    const recordingListItem = this.$static.recordingTableRow.filter({ hasText: caseDetails.caseRef }).filter({
      has: this.page.locator(`td:text-is("${caseDetails.recordingVersion}")`),
    });

    await expect(recordingListItem).toBeVisible();
    await expect(recordingListItem.locator('td').nth(0)).toHaveText(caseDetails.caseRef);
    if (caseDetails.court) {
      await expect(recordingListItem.locator('td').nth(1)).toHaveText(caseDetails.court);
    }
    if (caseDetails.date) {
      await expect(recordingListItem.locator('td').nth(2)).toHaveText(caseDetails.date);
    }
    await expect(recordingListItem.locator('td').nth(3)).toContainText(caseDetails.witness);

    for (const defendant of caseDetails.defendants) {
      await expect(recordingListItem.locator('td').nth(4)).toContainText(defendant);
    }

    await expect(recordingListItem.locator('td').nth(5)).toHaveText(caseDetails.recordingVersion.toString());
    await expect(recordingListItem.locator('td').nth(6)).toHaveText(caseDetails.status);
  }

  public async verifyRecordingIsNotListed(caseReference: string): Promise<void> {
    await expect(async () => {
      await this.goTo();
      await this.verifyUserIsOnHomePage();
      await this.searchForCaseReferenceIfAvailable(caseReference);
      await expect(this.$static.recordingTableRow.filter({ hasText: caseReference })).not.toBeAttached({ timeout: 2_000 });
    }).toPass({ intervals: [2_000], timeout: 30_000 });
  }

  private async searchForCaseReferenceIfAvailable(caseRef: string): Promise<void> {
    if (!(await this.$interactive.caseReferenceSearchInput.isVisible())) {
      return;
    }

    await this.$interactive.caseReferenceSearchInput.fill(caseRef);
    await expect(this.$interactive.caseReferenceSearchInput).toHaveValue(caseRef);
    await this.$interactive.caseReferenceSearchButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.$interactive.caseReferenceSearchInput).toHaveValue(caseRef);
  }
}
