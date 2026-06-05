import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';
import { PortalHomePage, PortalWatchRecordingPage } from '../../../page-objects/pre-portal/pages/index.js';
import { createAndShareRecordingWithPortalUser } from '../helpers/portal-recording.helpers.js';
test.describe('Set of tests to verify functionality of pre portal as a Level 3 user', () => {
  test.use({ storageState: config.portalUsers.preLevel3User.sessionFile });

  test(
    'Verify user is able to share recording with portal user, confirm playback is successful and unshare the recording afterwards',
    {
      tag: ['@smoke', '@functional'],
    },
    async ({ context, powerAppPages, networkInterceptUtils, apiClient }) => {
      await test.step('Pre-Rquisite step in order to create a case and assign a recording via API', async () => {
        await apiClient.createANewCaseAndAssignRecording(2, 2, 'today');
      });

      const caseData = await apiClient.getCaseData();
      await apiClient.verifyRecordingHasBeenSuccessfullyProcessedForCase(caseData.caseReference);

      await test.step('Navigate to view recordings page in power app', async () => {
        const user = config.powerAppUsers.preLevel1User;
        await powerAppPages.msSignInPage.page.setViewportSize({ width: 1280, height: 720 });
        await powerAppPages.msSignInPage.signIn(user.username, user.password);
        await powerAppPages.homePage.verifyUserIsOnHomePage();
        await powerAppPages.homePage.$interactive.viewRecordingsButton.click();
        await powerAppPages.viewRecordingsPage.verifyUserIsOnViewRecordingsPage();
      });

      await test.step('Search for recording by case reference and select option to share', async () => {
        await powerAppPages.viewRecordingsPage.shareRecordingWithUser(caseData.caseReference, config.portalUsers.preLevel3User.username);
      });

      const prePortalTab = await context.newPage();
      const portal_HomePage = new PortalHomePage(prePortalTab);
      const portal_WatchRecordingPage = new PortalWatchRecordingPage(prePortalTab);

      await test.step('Navigate to pre-portal and verify playback of recording is successful', async () => {
        await portal_HomePage.page.bringToFront();
        await portal_HomePage.goTo();
        await portal_HomePage.verifyUserIsOnHomePage();
        await portal_HomePage.selectRecordingByCaseReferenceAndVersion(caseData.caseReference, 1);

        await networkInterceptUtils.interceptNetworkRequestToVerifyClearKeyRequestIsSuccessful(45_000, portal_WatchRecordingPage.page);
        await portal_WatchRecordingPage.verifyUserIsOnWatchRecordingPage();
        await expect(portal_WatchRecordingPage.$interactive.playRecordingButton).toBeVisible({ timeout: 15_000 });
        await portal_WatchRecordingPage.$interactive.playRecordingButton.click();

        await networkInterceptUtils.interceptNetworkRequestToVerifyVideoStreamIsReceivedFromMediaKind(15_000, portal_WatchRecordingPage.page);
        await networkInterceptUtils.interceptNetworkRequestToVerifyAudioStreamIsReceivedFromMediaKind(15_000, portal_WatchRecordingPage.page);
      });

      await test.step('Unshare the recording from the portal user within power app', async () => {
        await powerAppPages.viewRecordingsPage.page.bringToFront();
        await powerAppPages.viewRecordingsPage.removeAccessToRecordingFromUser(config.portalUsers.preLevel3User.username);
      });

      await portal_HomePage.page.close();
    },
  );

  test(
    'Verify details of version 1 existing recording is accurately displayed on pre-portal home page',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ prePortalPages, apiClient, newBrowserContextAndPage }) => {
      const { caseData, recordingData } = await test.step('Create and share a recording for the portal user', async () =>
        createAndShareRecordingWithPortalUser(apiClient, newBrowserContextAndPage));

      await test.step('Navigate to pre-portal home page', async () => {
        await prePortalPages.homePage.goTo();
        await prePortalPages.homePage.verifyUserIsOnHomePage();
      });

      await test.step('Verify details of the generated case reference are accurately displayed on the home page', async () => {
        await prePortalPages.homePage.verifyDetailsOfCaseReferenceOnHomePage({
          caseRef: caseData.caseReference,
          date: recordingData.recordingDate,
          witness: caseData.witnessNames[0],
          defendants: caseData.defendantNames,
          recordingVersion: 1,
          status: 'Active',
        });
      });
    },
  );

  test(
    'Verify user is able to playback version 1 of an existing recording which has been pre assigned to user',
    {
      tag: ['@smoke', '@functional'],
    },
    async ({ prePortalPages, networkInterceptUtils, apiClient, newBrowserContextAndPage }) => {
      const { caseData } = await test.step('Create and share a recording for the portal user', async () =>
        createAndShareRecordingWithPortalUser(apiClient, newBrowserContextAndPage));

      await test.step('Navigate to pre-portal home page and select the generated case reference', async () => {
        await prePortalPages.homePage.goTo();
        await prePortalPages.homePage.verifyUserIsOnHomePage();
        await prePortalPages.homePage.selectRecordingByCaseReferenceAndVersion(caseData.caseReference, 1);
      });

      await test.step('Verify playback of recording is successful', async () => {
        await networkInterceptUtils.interceptNetworkRequestToVerifyClearKeyRequestIsSuccessful(45_000);
        await prePortalPages.watchRecordingPage.verifyUserIsOnWatchRecordingPage();
        await expect(prePortalPages.watchRecordingPage.$interactive.playRecordingButton).toBeVisible({ timeout: 15_000 });
        await prePortalPages.watchRecordingPage.$interactive.playRecordingButton.click();

        await networkInterceptUtils.interceptNetworkRequestToVerifyVideoStreamIsReceivedFromMediaKind(15_000);
        await networkInterceptUtils.interceptNetworkRequestToVerifyAudioStreamIsReceivedFromMediaKind(15_000);
      });
    },
  );

  test(
    'Verify recording details are accurately displayed on pre-portal watch recordings page for version 1 of an existing recording',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ prePortalPages, apiClient, newBrowserContextAndPage }) => {
      const { caseData, recordingData } = await test.step('Create and share a recording for the portal user', async () =>
        createAndShareRecordingWithPortalUser(apiClient, newBrowserContextAndPage));

      await test.step('Navigate to pre-portal home page and select the generated case reference', async () => {
        await prePortalPages.homePage.goTo();
        await prePortalPages.homePage.verifyUserIsOnHomePage();
        await prePortalPages.homePage.selectRecordingByCaseReferenceAndVersion(caseData.caseReference, 1);
        await prePortalPages.watchRecordingPage.verifyUserIsOnWatchRecordingPage();
      });

      await test.step('Verify recording details are displayed accurately', async () => {
        await expect(prePortalPages.watchRecordingPage.$static.recordingDate).toHaveText(recordingData.recordingDate);
        await expect(prePortalPages.watchRecordingPage.$static.recordingVersion).toHaveText('1');
        await expect(prePortalPages.watchRecordingPage.$static.recordingCourt).not.toBeEmpty();
        await expect(prePortalPages.watchRecordingPage.$static.recordingWitness).toHaveText(caseData.witnessNames[0]);
        for (const defendant of caseData.defendantNames) {
          await expect(prePortalPages.watchRecordingPage.$static.recordingDefendants).toContainText(defendant);
        }
      });
    },
  );
});
