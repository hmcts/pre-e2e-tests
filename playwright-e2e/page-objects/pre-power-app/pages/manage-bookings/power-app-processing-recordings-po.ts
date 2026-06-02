import { Page, expect } from '@playwright/test';
import { PowerAppBase } from '../../power-app-base';
import { NavBarComponent } from '../../components';

export class PowerAppProcessingRecordingsPage extends PowerAppBase {
  private navBar = new NavBarComponent(this.page);
  constructor(page: Page) {
    super(page);
  }

  public async verifyUserIsOnProcessingRecordingsPage(): Promise<void> {
    await expect(this.navBar.$interactive.ProcessingRecordings).toBeVisible({ timeout: 15000 });
  }

  /**
   * Verifies that a recording for the given case reference is processed.
   * Checks that the case reference is visible in the list and that its status is "PROCESSING".
   * Waits for the processing to complete and ensures that the status is no longer "PROCESSING".
   * @param caseReference - The case reference to check for processing status.
   */
  public async verifyRecordingIsProcessed(caseReference: string): Promise<void> {
    const caseProcessingLocator = this.iFrame
      .locator('[data-control-name="ProcessingRecordingsListGallery"]')
      .locator('[data-control-part="gallery-item"]')
      .filter({ hasText: caseReference })
      .getByText('PROCESSING');

    await expect(this.iFrame.getByText(caseReference, { exact: true })).toBeVisible({ timeout: 30_000 });
    await expect(caseProcessingLocator).toBeVisible();

    // Allow time for the recording to be processed, Currently set to 5 minutes.
    const processingTimeout = 300_000;
    try {
      await expect(caseProcessingLocator).not.toBeVisible({ timeout: processingTimeout });
    } catch (error) {
      throw new Error(
        `Processing of recording for case reference ${caseReference} did not complete within ${processingTimeout / 60000} minutes. Please investigate further. Error: ${error}`,
      );
    }
  }
}
