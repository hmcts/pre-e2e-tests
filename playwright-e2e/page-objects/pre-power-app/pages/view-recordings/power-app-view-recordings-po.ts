import { Page, Locator, expect } from '@playwright/test';
import { PowerAppBase } from '../../power-app-base';
import { NavBarComponent } from '../../components';
import { ApiClient } from '../../../../api-requests';

export class PowerAppViewRecordingsPage extends PowerAppBase {
  private apiClient: ApiClient;
  constructor(page: Page, apiClient: ApiClient) {
    super(page);
    this.apiClient = apiClient;
  }
  private navBar = new NavBarComponent(this.page);

  public readonly $inputs = {
    caseReference: this.iFrame.getByPlaceholder('Case Reference'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    refreshResultsButton: this.iFrame.getByRole('button', { name: 'Refresh Data' }),
    viewRecordingButton: this.iFrame.locator('[data-control-name="viewRecordingsScrn_RecordingsGalleryRecord_Icn"]'),
    shareRecordingButton: this.iFrame.locator('[data-control-name="viewRecordingsScrn_RecordingsGalleryShare_Icn"]'),
    playVideoButton: this.iFrame.getByTitle('Play Video'),
    resumeVideoButton: this.iFrame.getByTitle('Play'),
    pauseVideoButton: this.iFrame.getByTitle('Pause'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    caseReferenceLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryReference_Lbl"]'),
    recordingVersionLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryVersion_Lbl"]'),
    courtLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryCourt_Lbl"]'),
    recordingIdLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryID_Lbl"]'),
    WitnessLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryWitness_Lbl"]'),
    defendantLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryDefendants_Lbl"]'),
    recordingDateLabelInSearchList: this.iFrame.locator('[data-control-name$="RecordingsGalleryDate_Lbl"]'),
    recordingSourceLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryDate_Lbl_3"]'),
    recordingDurationLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryDuration_Lbl"]'),
    StatusLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryDate_Lbl_1"]'),
    caseStatusLabelInSearchList: this.iFrame.locator('[data-control-name="Label1"]'),
    videoPlaybackText: this.iFrame.locator('[data-control-name="VidMessageText"] [data-control-part="text"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $recordingsMonitoredAndAuditedModal = {
    modalWindow: this.iFrame.locator('[data-control-name="BusJustWindow"]'),
    confirmButton: this.iFrame.locator('[data-control-name="BusJustSubmitButton"] button'),
    cancelButton: this.iFrame.locator('[data-control-name="BusJustCancelButton"] button'),
  } as const satisfies Record<string, Locator>;

  public readonly $shareRecordingModal = {
    modalWindow: this.iFrame.locator('[data-control-name="AdmMngCasesBackgroundIcn_6"]'),
    shareButton: this.iFrame.locator('[data-control-name="MngRecShareAccessBtn_3"] button'),
    grantAccessButton: this.iFrame.locator('[data-control-name="MngNewAcsGrpClearBtn_3"] button'),
    listOfUsersRecordingIsSharedWith: this.iFrame.locator('[data-control-name="VidPermsGal_3"]'),
    removeAccessButton: this.iFrame.locator('[data-control-name="MngRecRemoveShareAccessBtn_1"] button'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnViewRecordingsPage(): Promise<void> {
    await expect(this.navBar.$interactive.ViewRecordings).toBeVisible({ timeout: 15000 });
  }

  /**
   * Searches for a case reference in the view recordings page.
   * If the recording is not found and was assigned via API, it will create a new booking and assign the recording.
   * @param caseReference - The case reference to search for.
   * @param recordingCreationMethod - The method by which the recording was created/assigned.
   */
  public async searchForCaseReference(
    caseReference: string,
    recordingCreationMethod: 'recordingAssignedByApi' | 'recordingCreatedByUi',
  ): Promise<void> {
    switch (recordingCreationMethod) {
      case 'recordingAssignedByApi':
        try {
          await this.verifyCaseReferanceCanBeFoundInSearchResults(caseReference);
        } catch {
          const caseData = await this.apiClient.getCaseData();
          const bookingData = await this.apiClient.getBookingData();
          const recordingData = await this.apiClient.getRecordingData();
          const response = await this.apiClient.getRecordingDetailsByCaseReferenceApi(caseReference);
          const responseBody = await response.json();

          const recordings = responseBody?._embedded?.recordingDTOList || [];
          const idFound = recordings.some((r) => r.id === recordingData.recordingId);

          if (idFound) {
            throw new Error(
              `Case Reference ${caseReference} has a recording assigned during test run however unable to be found when searched for on view recordings page. Recording ID: ${recordingData.recordingId}`,
            );
          } else {
            const newBooking = await this.apiClient.createBookingForAnExistingCase(
              caseData.caseId,
              caseData.participants.witnesses.filter((w) => `${w.first_name} ${w.last_name}` === bookingData.witnessSelectedForCaseRecording)[0],
              caseData.participants.defendants,
              'today',
            );
            await this.apiClient.assignRecordingToAnExistingBooking(newBooking.bookingId);
            await this.$inputs.caseReference.clear();
            await this.verifyCaseReferanceCanBeFoundInSearchResults(caseData.caseReference);
          }
        }
        break;
      case 'recordingCreatedByUi':
        await this.verifyCaseReferanceCanBeFoundInSearchResults(caseReference);
        break;
    }
  }

  private async verifyCaseReferanceCanBeFoundInSearchResults(caseReference: string): Promise<void> {
    await this.$inputs.caseReference.fill(caseReference);
    await expect(this.$inputs.caseReference).toHaveValue(caseReference);

    await expect(async () => {
      await this.refreshResultsUntilASingleCaseReferenceIsReturned();
      await expect(this.$static.caseReferenceLabelInSearchList).toContainText(caseReference, { timeout: 2000 });
    }).toPass({ intervals: [1_000], timeout: 15_000 });
  }

  /**
   * Refreshes the search results until exactly one case reference is returned.
   */
  private async refreshResultsUntilASingleCaseReferenceIsReturned(): Promise<void> {
    const caseReferenceList = this.iFrame.locator('[data-control-name*="viewRecordingsScrn_RecordingsGallery_Gal"]').locator('[role="listitem"]');

    const count = await caseReferenceList.count();
    if (count > 1 || count < 1) {
      await this.$interactive.refreshResultsButton.click();
      await expect(caseReferenceList).toHaveCount(1);
    }
  }

  /**
   * Searches and selects a user to share the recording with by filling in the user email,
   * clicking on the user from the search results, and verifying that the user has been added to the list.
   * @param userEmail - The email of the user to share the recording with.
   */
  public async searchAndSelectUserToShareRecordingWith(userEmail: string): Promise<void> {
    await expect(async () => {
      await this.iFrame.locator('[data-control-name="MngNewAcsGrpCbx_3"]').click();
      await expect(this.iFrame.locator('[class="powerapps-flyout-portal"] input')).toBeVisible();
    }).toPass({ intervals: [2_000], timeout: 10_000 });

    await this.iFrame.locator('[class="powerapps-flyout-portal"] input').fill(userEmail);
    await this.iFrame.locator('li', { hasText: userEmail }).click();
    await expect(this.iFrame.locator('button[aria-label*="Remove"]')).toBeVisible();
  }

  /**
   * Removes access to the recording from a specified user by clicking the remove access button
   * next to the user's email in the list of users the recording is shared with.
   * Verifies that the user is no longer present in the list after removal.
   * @param userEmail - The email of the user to remove access from.
   */
  public async removeAccessToRecordingFromUser(userEmail: string): Promise<void> {
    await this.$shareRecordingModal.listOfUsersRecordingIsSharedWith
      .locator('[role="listitem"]', { hasText: userEmail })
      .locator('[data-control-name="VidPermsTrashIcon_3"] [role="button"]')
      .click();

    await this.$shareRecordingModal.removeAccessButton.click();
    await expect(this.$shareRecordingModal.listOfUsersRecordingIsSharedWith).not.toContainText(userEmail);
  }
}
