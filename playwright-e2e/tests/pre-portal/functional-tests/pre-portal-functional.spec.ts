import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';
import { PortalHomePage, PortalWatchRecordingPage } from '../../../page-objects/pre-portal/pages/index.js';
test.describe('Set of tests to verify functionality of pre portal as a Level 3 user', () => {
  test.use({ storageState: config.portalUsers.preLevel3User.sessionFile });

  test(
    'Verify user is able to share recording with portal user, confirm playback is successful and unshare the recording afterwards',
    {
      tag: ['@smoke', '@functional'],
    },
    async ({ context, powerApp_MsSignInPage, powerApp_HomePage, powerApp_ViewRecordingsPage, networkInterceptUtils, apiClient }) => {
      await test.step('Pre-Rquisite step in order to create a case and assign a recording via API', async () => {
        await apiClient.createANewCaseAndAssignRecording(2, 2, 'today');
      });

      const caseData = await apiClient.getCaseData();

      await test.step('Navigate to view recordings page in power app', async () => {
        const user = config.powerAppUsers.preLevel1User;
        await powerApp_MsSignInPage.page.setViewportSize({ width: 1280, height: 720 });
        await powerApp_MsSignInPage.signIn(user.username, user.password);
        await powerApp_HomePage.verifyUserIsOnHomePage();
        await powerApp_HomePage.$interactive.viewRecordingsButton.click();
        await powerApp_ViewRecordingsPage.verifyUserIsOnViewRecordingsPage();
      });

      const userToShareRecordingWith = config.portalUsers.preLevel3User.username;
      await test.step('Search for recording by case reference and select option to share', async () => {
        await powerApp_ViewRecordingsPage.searchForCaseReference(caseData.caseReference, 'recordingAssignedByApi');
        await powerApp_ViewRecordingsPage.$interactive.shareRecordingButton.click();
        await expect(powerApp_ViewRecordingsPage.$shareRecordingModal.modalWindow).toBeVisible();
        await powerApp_ViewRecordingsPage.$shareRecordingModal.shareButton.click();
        await powerApp_ViewRecordingsPage.searchAndSelectUserToShareRecordingWith(userToShareRecordingWith);
        await powerApp_ViewRecordingsPage.$shareRecordingModal.grantAccessButton.click();
        await expect(powerApp_ViewRecordingsPage.$shareRecordingModal.listOfUsersRecordingIsSharedWith).toContainText(userToShareRecordingWith);
      });

      const prePortalTab = await context.newPage();
      const portal_HomePage = new PortalHomePage(prePortalTab);
      const portal_WatchRecordingPage = new PortalWatchRecordingPage(prePortalTab);

      await test.step('Navigate to pre-portal and verify playback of recording is successful', async () => {
        await portal_HomePage.page.bringToFront();
        await portal_HomePage.goTo();
        await portal_HomePage.verifyUserIsOnHomePage();
        await portal_HomePage.selectRecordingByCaseReference(caseData.caseReference);

        await networkInterceptUtils.interceptNetworkRequestToVerifyClearKeyRequestIsSuccessful(30_000, portal_WatchRecordingPage.page);
        await portal_WatchRecordingPage.verifyUserIsOnWatchRecordingPage();
        await expect(portal_WatchRecordingPage.$interactive.playRecordingButton).toBeVisible({ timeout: 30_000 });
        await portal_WatchRecordingPage.$interactive.playRecordingButton.click();

        await networkInterceptUtils.interceptNetworkRequestToVerifyVideoStreamIsReceivedFromMediaKind(15_000, portal_WatchRecordingPage.page);
        await networkInterceptUtils.interceptNetworkRequestToVerifyAudioStreamIsReceivedFromMediaKind(15_000, portal_WatchRecordingPage.page);
      });

      await test.step('Unshare the recording from the portal user within power app', async () => {
        await powerApp_ViewRecordingsPage.page.bringToFront();
        await powerApp_ViewRecordingsPage.removeAccessToRecordingFromUser(userToShareRecordingWith);
      });

      await test.step('Verify portal user is no longer able to access the recording after unsharing', async () => {
        await portal_WatchRecordingPage.page.bringToFront();
        await portal_WatchRecordingPage.page.reload();
        await expect(portal_WatchRecordingPage.page.locator('h1', { hasText: 'Page is not available' })).toBeVisible();
        await portal_HomePage.goTo();
        await portal_HomePage.verifyUserIsOnHomePage();
        await expect(portal_HomePage.$static.recording.filter({ hasText: caseData.caseReference })).not.toBeAttached();
      });
    },
  );
});

test.describe('Set of tests to verify functionality of pre portal as a super user', () => {
  test.use({ storageState: config.portalUsers.preSuperUser.sessionFile });

  test.beforeEach(async ({ portal_HomePage }) => {
    await portal_HomePage.goTo();
    await portal_HomePage.verifyUserIsOnHomePage();
  });

  test(
    'Verify super user is able to navigate to edit request page and submit an edit request for a recording',
    {
      tag: ['@functional'],
    },
    async ({ portal_HomePage, portal_EditRequestPage }) => {
      await test.step('Navigate to edit request page', async () => {
        await portal_HomePage.$interactive.editRequestButton.click();
        await portal_EditRequestPage.verifyUserIsOnEditRequestPage();
      });
    },
  );
});
