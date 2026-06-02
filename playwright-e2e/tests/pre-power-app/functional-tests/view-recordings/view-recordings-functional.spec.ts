import { test, expect } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify functionality of view recordings page for Level 1 user', () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppViewRecordingsPage, apiClient }) => {
    await apiClient.createANewCaseAndAssignRecording(2, 2, 'today');
    await navigateToPowerAppViewRecordingsPage();
  });

  test(
    'Verify user is able to search for a case and confirm the list search details are correct',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ apiClient, powerAppPages }) => {
      const caseData = await apiClient.getCaseData();

      await test.step('Verify recording can be found in view recordings page', async () => {
        await powerAppPages.viewRecordingsPage.searchForCaseReference(caseData.caseReference, 'recordingAssignedByApi');
      });

      await test.step('Verify case and recording details are correct in search list', async () => {
        const bookingData = await apiClient.getBookingData();
        const recordingData = await apiClient.getRecordingData();

        await expect(powerAppPages.viewRecordingsPage.$static.caseReferenceLabelInSearchList).toHaveText(`Case Reference: ${caseData.caseReference}`);
        await expect(powerAppPages.viewRecordingsPage.$static.recordingVersionLabelInSearchList).toHaveText('V.1');
        await expect(powerAppPages.viewRecordingsPage.$static.courtLabelInSearchList).toContainText('Court:');
        await expect(powerAppPages.viewRecordingsPage.$static.recordingIdLabelInSearchList).toHaveText(`Recording UID: ${recordingData.recordingId}`);
        await expect(powerAppPages.viewRecordingsPage.$static.WitnessLabelInSearchList).toHaveText(
          `Witness: ${bookingData.witnessSelectedForCaseRecording}`,
        );
        for (const defendantName of caseData.defendantNames) {
          await expect(powerAppPages.viewRecordingsPage.$static.defendantLabelInSearchList.filter({ hasText: 'Defendants:' })).toContainText(
            defendantName,
          );
        }
        await expect(powerAppPages.viewRecordingsPage.$static.recordingDateLabelInSearchList).toHaveText(
          `Recording Date: ${recordingData.recordingDate} ${recordingData.recordingTime}`,
        );
        await expect(powerAppPages.viewRecordingsPage.$static.recordingSourceLabelInSearchList).toHaveText('Source: PRE');
        await expect(powerAppPages.viewRecordingsPage.$static.recordingDurationLabelInSearchList).toHaveText(
          `Duration: ${recordingData.recordingDuration}`,
        );
        await expect(powerAppPages.viewRecordingsPage.$static.StatusLabelInSearchList).toHaveText('Status: ');
        await expect(powerAppPages.viewRecordingsPage.$static.caseStatusLabelInSearchList).toHaveText('Active');
      });
    },
  );

  test(
    'Verify user is able to view a recording for an existing case',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ apiClient, powerAppPages, networkInterceptUtils }) => {
      const caseData = await apiClient.getCaseData();

      await test.step('Search and select an existing recording', async () => {
        await powerAppPages.viewRecordingsPage.searchForCaseReference(caseData.caseReference, 'recordingAssignedByApi');
        await powerAppPages.viewRecordingsPage.$interactive.viewRecordingButton.click();
      });

      await test.step('Select option to confirm playback of recordings is actively monitored', async () => {
        await expect(powerAppPages.viewRecordingsPage.$recordingsMonitoredAndAuditedModal.modalWindow).toBeVisible();
        await powerAppPages.viewRecordingsPage.$recordingsMonitoredAndAuditedModal.confirmButton.click();
        await expect(powerAppPages.viewRecordingsPage.$static.videoPlaybackText).toHaveText('Media selection loading,Please wait.');
      });

      await test.step('Verify video and audio stream is received from media kind via network requests', async () => {
        await networkInterceptUtils.interceptNetworkRequestToVerifyVideoStreamIsReceivedFromMediaKind(60_000);
        await networkInterceptUtils.interceptNetworkRequestToVerifyAudioStreamIsReceivedFromMediaKind(15_000);
        await networkInterceptUtils.interceptNetworkRequestToVerifyClearKeyRequestIsSuccessful(15_000);
      });

      await test.step('Verify user is able to play back the recording', async () => {
        await expect(powerAppPages.viewRecordingsPage.$interactive.playVideoButton).toBeVisible({ timeout: 15_000 });
        await powerAppPages.viewRecordingsPage.$interactive.playVideoButton.click();
        await expect(powerAppPages.viewRecordingsPage.$interactive.playVideoButton).toBeHidden();
        await expect(powerAppPages.viewRecordingsPage.$interactive.pauseVideoButton).toBeVisible();
      });
    },
  );
});
