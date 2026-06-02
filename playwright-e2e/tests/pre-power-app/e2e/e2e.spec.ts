import { test, expect } from '../../../fixtures';
import { BaseCaseDetails } from '../../../types';
import { config } from '../../../utils';

test.describe('Ensure e2e journey is working as expected', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppHomePage }) => {
    await navigateToPowerAppHomePage();
  });

  test(
    'Verify user is able to complete the e2e journey',
    {
      tag: ['@smoke', '@e2e'],
    },
    async ({
      powerAppPages,
      dataUtils,
      cvpPages,
      networkInterceptUtils,
      apiClient,
      navigateToPowerAppCaseDetailsPage,
      navigateToPowerAppViewLiveFeedPage,
      navigateToPowerAppViewRecordingsPage,
    }) => {
      /**
       * Increased the timeout to allow e2e journey to complete, set to a total of 9 minutes.
       * This ensures the test has sufficient time for the following:
       * Navigating between pages
       * Waiting for recording link to be generated
       * Waiting for network request to confirm the recording is taking place
       * Waiting for the recording to be processed and appear in the view recordings page.
       * Note: The processing of recordings can take a significant amount of time, I have for now placed a limit of 5 minutes prompting investigation when exceeded.
       * Video processing is done by media kind which works in order of a queue to process 2 at a time, so if there are multiple recordings being processed, it can take longer.
       * There has been an addition of a Cron job on (24/07/2025) to check the status of recordings which has a default polling interval of 5 minutes however reduced to 1 minute for lower Envs.
       */
      test.setTimeout(540_000);
      const caseDetails: BaseCaseDetails = dataUtils.generateRandomCaseDetails(2, 2);
      let rtmpsLink: string;
      let hostPin: string;

      await test.step('Verify user is able to open a new case', async () => {
        await powerAppPages.homePage.page.bringToFront();
        await navigateToPowerAppCaseDetailsPage();
        await powerAppPages.caseDetailsPage.populateCaseDetails({
          caseReference: caseDetails.caseReference,
          defendantNames: caseDetails.defendantNames,
          witnessNames: caseDetails.witnessNames,
        });
        await powerAppPages.caseDetailsPage.navigationClick(powerAppPages.caseDetailsPage.$interactive.saveButton);
        await powerAppPages.scheduleRecordingPage.verifyUserIsOnScheduleRecordingsPage();
        const Test = 'TestOnce';
        console.log(Test);
      });

      await test.step('Verify user is able to book a recording for the new case', async () => {
        await powerAppPages.scheduleRecordingPage.selectDateFromToday();
        await powerAppPages.scheduleRecordingPage.selectWitnessFromDropDown(caseDetails.witnessNames[0]);
        await powerAppPages.scheduleRecordingPage.selectAllDefendantsFromDropDown();
        await powerAppPages.scheduleRecordingPage.$interactive.saveButton.click();
        await expect(
          powerAppPages.scheduleRecordingPage.iFrame.locator(
            '[data-control-name="bookingScrn_BookingsGallery_Gal"] [data-control-part="gallery-item"]',
          ),
        ).toBeVisible();
      });

      await test.step('Verify user is able to begin recording by obtaining rtmps link', async () => {
        await navigateToPowerAppViewLiveFeedPage(caseDetails.caseReference);
        await expect(powerAppPages.viewLiveFeedPage.$static.notRecordingText).toBeVisible();
        rtmpsLink = await powerAppPages.viewLiveFeedPage.startRecordingAndCaptureRtmpsLink();
      });

      await test.step('Verify user is able to configure a cvp room with rtmps link', async () => {
        await cvpPages.signInPage.page.bringToFront();
        await cvpPages.signInPage.goTo();
        await cvpPages.signInPage.verifyUserIsOnCvpSignInPage();
        await cvpPages.signInPage.signIn(config.cvpUser.username, config.cvpUser.password);

        await cvpPages.roomSettingsPage.verifyUserIsOnCvpRoomSettingsPage();
        await cvpPages.roomSettingsPage.selectRoomByName('PRE008');
        hostPin = await cvpPages.roomSettingsPage.editRoomSettings(rtmpsLink);
      });

      await test.step('Verify user is able to connect to the conference using the host pin', async () => {
        await cvpPages.conferencePage.page.bringToFront();
        await cvpPages.conferencePage.goTo();
        await cvpPages.conferencePage.verifyUserIsOnCvpConferencePage();
        await cvpPages.conferencePage.connectToConference(config.cvpUser.cvpConferenceUser, caseDetails.witnessNames[0]);

        await cvpPages.selectRolePage.verifyUserIsOnCvpSelectRolePage();
        await cvpPages.selectRolePage.connectAsHost(hostPin);
        await cvpPages.recordingCallPage.verifyUserIsOnCvpRecordingCallPage();
      });

      await test.step('Verify user begins recording in cvp and live feed received in power app', async () => {
        await cvpPages.roomSettingsPage.page.bringToFront();
        await cvpPages.roomSettingsPage.beginRecording(config.cvpUser.serviceId, config.cvpUser.locationCode, caseDetails.caseReference);
        await powerAppPages.viewLiveFeedPage.page.bringToFront();

        try {
          await networkInterceptUtils.interceptNetworkRequestToVerifyRecordingIsTakingPlace(caseDetails.caseReference, 90000);
          await expect(powerAppPages.viewLiveFeedPage.$static.notRecordingText).toBeHidden({ timeout: 90000 });
        } catch (error) {
          await cvpPages.roomSettingsPage.page.bringToFront();
          await cvpPages.roomSettingsPage.$interactive.endCallButton.click();
          throw new Error(`Live feed for recording failed to start for case reference: ${caseDetails.caseReference}. Error: ${error}`);
        }
      });

      await test.step('Verify user is disconected from call once call has been ended in cvp', async () => {
        await cvpPages.roomSettingsPage.page.bringToFront();
        await cvpPages.roomSettingsPage.$interactive.endCallButton.click();
        await expect(cvpPages.roomSettingsPage.$interactive.recordButton).toBeVisible();

        await cvpPages.recordingCallPage.page.bringToFront();
        await cvpPages.recordingCallPage.verifyUserHasBeenDisconnectedFromCall();
        await cvpPages.conferencePage.verifyUserIsOnCvpConferencePage();
      });

      await test.step('Verify recording is processed in power app once user has clicked finish', async () => {
        await powerAppPages.viewLiveFeedPage.page.bringToFront();
        await powerAppPages.viewLiveFeedPage.finishRecording();
        await powerAppPages.processingRecordingsPage.verifyUserIsOnProcessingRecordingsPage();
        await powerAppPages.processingRecordingsPage.verifyRecordingIsProcessed(caseDetails.caseReference);
        await apiClient.verifyRecordingHasBeenSuccessfullyProcessedForCase(caseDetails.caseReference);
      });

      await test.step('Verify recording is now available in view recordings page', async () => {
        await navigateToPowerAppViewRecordingsPage();
        await powerAppPages.viewRecordingsPage.searchForCaseReference(caseDetails.caseReference, 'recordingCreatedByUi');
      });
    },
  );
});
