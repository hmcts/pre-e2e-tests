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
        await portal_HomePage.selectRecordingByCaseReferenceAndVersion(caseData.caseReference, 1);

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
        await expect(portal_HomePage.$static.recordingTableRow.filter({ hasText: caseData.caseReference })).not.toBeAttached();
      });
    },
  );

  test(
    'Verify details of version 1 existing recording is accurately displayed on pre-portal home page',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ portal_HomePage }) => {
      await test.step('Navigate to pre-portal home page', async () => {
        await portal_HomePage.goTo();
        await portal_HomePage.verifyUserIsOnHomePage();
      });

      await test.step('Verify details of case reference (PLAYWRIGHT) are accurately displayed on the home page', async () => {
        await portal_HomePage.verifyDetailsOfCaseReferenceOnHomePage({
          caseRef: 'PLAYWRIGHT',
          court: '102 Petty France',
          date: '25/11/2025',
          witness: 'WitnessOne',
          defendants: ['Defendant One', 'Defendant Two'],
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
    async ({ portal_HomePage, portal_WatchRecordingPage, networkInterceptUtils }) => {
      await test.step('Navigate to pre-portal home page and select case reference (PLAYWRIGHT)', async () => {
        await portal_HomePage.goTo();
        await portal_HomePage.verifyUserIsOnHomePage();
        await portal_HomePage.selectRecordingByCaseReferenceAndVersion('PLAYWRIGHT', 1);
      });

      await test.step('Verify playback of recording is successful', async () => {
        await networkInterceptUtils.interceptNetworkRequestToVerifyClearKeyRequestIsSuccessful(30_000);
        await portal_WatchRecordingPage.verifyUserIsOnWatchRecordingPage();
        await expect(portal_WatchRecordingPage.$interactive.playRecordingButton).toBeVisible({ timeout: 30_000 });
        await portal_WatchRecordingPage.$interactive.playRecordingButton.click();

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
    async ({ portal_HomePage, portal_WatchRecordingPage }) => {
      await test.step('Navigate to pre-portal home page and select case reference (PLAYWRIGHT)', async () => {
        await portal_HomePage.goTo();
        await portal_HomePage.verifyUserIsOnHomePage();
        await portal_HomePage.selectRecordingByCaseReferenceAndVersion('PLAYWRIGHT', 1);
        await portal_WatchRecordingPage.verifyUserIsOnWatchRecordingPage();
      });

      await test.step('Verify recording details are displayed accurately', async () => {
        await expect(portal_WatchRecordingPage.$static.recordingDate).toHaveText('25/11/2025');
        await expect(portal_WatchRecordingPage.$static.recordingVersion).toHaveText('1');
        await expect(portal_WatchRecordingPage.$static.recordingCourt).toHaveText('102 Petty France');
        await expect(portal_WatchRecordingPage.$static.recordingWitness).toHaveText('WitnessOne');
        await expect(portal_WatchRecordingPage.$static.recordingDefendants).toContainText('Defendant One');
        await expect(portal_WatchRecordingPage.$static.recordingDefendants).toContainText('Defendant Two');
      });
    },
  );
});
