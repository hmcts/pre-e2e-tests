import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../base';
import { config } from '../../../utils';

export class PortalHomePage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $static = {
    heading: this.page.locator('h1[class*="govuk-heading"]'),
    recordingHeading: this.page.locator('h2[class="govuk-heading-m"]'),
    recordingTableRow: this.page.locator('tr[id*="recording"]'),
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
    court: string;
    date: string;
    witness: string;
    defendants: string[];
    recordingVersion: number;
    status: 'Active';
  }): Promise<void> {
    const recordingListItem = this.$static.recordingTableRow.filter({ hasText: caseDetails.caseRef }).filter({
      has: this.page.locator(`td:text-is("${caseDetails.recordingVersion}")`),
    });

    await expect(recordingListItem).toBeVisible();
    await expect(recordingListItem.locator('td').nth(0)).toHaveText(caseDetails.caseRef);
    await expect(recordingListItem.locator('td').nth(1)).toHaveText(caseDetails.court);
    await expect(recordingListItem.locator('td').nth(2)).toHaveText(caseDetails.date);
    await expect(recordingListItem.locator('td').nth(3)).toContainText(caseDetails.witness);

    for (const defendant of caseDetails.defendants) {
      await expect(recordingListItem.locator('td').nth(4)).toContainText(defendant);
    }

    await expect(recordingListItem.locator('td').nth(5)).toHaveText(caseDetails.recordingVersion.toString());
    await expect(recordingListItem.locator('td').nth(6)).toHaveText(caseDetails.status);
  }
}
