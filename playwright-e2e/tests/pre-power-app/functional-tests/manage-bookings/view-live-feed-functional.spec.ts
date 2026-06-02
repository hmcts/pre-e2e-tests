import { test, expect } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify functionality of view live feed page for Level 1 user', () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppViewLiveFeedPage, apiClient }) => {
    await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
    const caseData = await apiClient.getCaseData();
    await navigateToPowerAppViewLiveFeedPage(caseData.caseReference);
  });

  test(
    'Verify correct recording details are displayed when user selects show link button',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ powerAppPages }) => {
      await test.step('Given user has selected option to start a recording', async () => {
        await powerAppPages.viewLiveFeedPage.selectStartRecordingButton();
        await expect(powerAppPages.viewLiveFeedPage.$startRecordingModal.recordingLinkGeneratedText).toBeVisible({ timeout: 90000 });
        await powerAppPages.viewLiveFeedPage.selectOkButtonToDismissStartRecordingModal();
      });

      await test.step('When user selects the show link button', async () => {
        await powerAppPages.viewLiveFeedPage.$interactive.showLinkButton.click();
      });

      await test.step('The correct details are displayed on modal', async () => {
        await expect(powerAppPages.viewLiveFeedPage.$startRecordingModal.recordingLinkGeneratedText).toBeVisible();
        await expect(powerAppPages.viewLiveFeedPage.$startRecordingModal.recordingLinkGeneratedText).toHaveValue(
          'We are now ready to Record. \n\nPlease open CVP and copy the link below:',
        );

        const rtmpsLinkValue = await powerAppPages.viewLiveFeedPage.$startRecordingModal.generatedRtmpsLink.inputValue();
        await expect(powerAppPages.viewLiveFeedPage.$startRecordingModal.generatedRtmpsLink).toBeVisible();
        expect(rtmpsLinkValue).toContain('rtmps://');

        await expect(powerAppPages.viewLiveFeedPage.$startRecordingModal.dontForgetToStartRecordingText).toBeVisible();
        await expect(powerAppPages.viewLiveFeedPage.$startRecordingModal.dontForgetToStartRecordingText).toHaveText(
          "Don't forget to press Record...",
        );

        await expect(powerAppPages.viewLiveFeedPage.$startRecordingModal.okButton).toBeVisible();
        await expect(powerAppPages.viewLiveFeedPage.$startRecordingModal.okButton).toHaveText('Ok');
      });
    },
  );
});
