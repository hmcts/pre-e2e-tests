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
    async ({ context, powerAppPages, networkInterceptUtils, apiClient }) => {
      await test.step('Pre-Rquisite step in order to create a case and assign a recording via API', async () => {
        await apiClient.createANewCaseAndAssignRecording(2, 2, 'today');
      });

      const caseData = await apiClient.getCaseData();

      await test.step('Navigate to view recordings page in power app', async () => {
        const user = config.powerAppUsers.preLevel1User;
        await powerAppPages.msSignInPage.page.setViewportSize({ width: 1280, height: 720 });
        await powerAppPages.msSignInPage.signIn(user.username, user.password);
        await powerAppPages.homePage.verifyUserIsOnHomePage();
        await powerAppPages.homePage.$interactive.viewRecordingsButton.click();
        await powerAppPages.viewRecordingsPage.verifyUserIsOnViewRecordingsPage();
      });

      const userToShareRecordingWith = config.portalUsers.preLevel3User.username;
      await test.step('Search for recording by case reference and select option to share', async () => {
        await powerAppPages.viewRecordingsPage.searchForCaseReference(caseData.caseReference, 'recordingAssignedByApi');
        await powerAppPages.viewRecordingsPage.$interactive.shareRecordingButton.click();
        await expect(powerAppPages.viewRecordingsPage.$shareRecordingModal.modalWindow).toBeVisible();
        await powerAppPages.viewRecordingsPage.$shareRecordingModal.shareButton.click();
        await powerAppPages.viewRecordingsPage.searchAndSelectUserToShareRecordingWith(userToShareRecordingWith);
        await powerAppPages.viewRecordingsPage.$shareRecordingModal.grantAccessButton.click();
        await expect(powerAppPages.viewRecordingsPage.$shareRecordingModal.listOfUsersRecordingIsSharedWith).toContainText(userToShareRecordingWith);
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
        await powerAppPages.viewRecordingsPage.removeAccessToRecordingFromUser(userToShareRecordingWith);
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
    async ({ prePortalPages }) => {
      await test.step('Navigate to pre-portal home page', async () => {
        await prePortalPages.homePage.goTo();
        await prePortalPages.homePage.verifyUserIsOnHomePage();
      });

      await test.step('Verify details of case reference (PLAYWRIGHT) are accurately displayed on the home page', async () => {
        await prePortalPages.homePage.verifyDetailsOfCaseReferenceOnHomePage({
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
    async ({ prePortalPages, networkInterceptUtils }) => {
      await test.step('Navigate to pre-portal home page and select case reference (PLAYWRIGHT)', async () => {
        await prePortalPages.homePage.goTo();
        await prePortalPages.homePage.verifyUserIsOnHomePage();
        await prePortalPages.homePage.selectRecordingByCaseReferenceAndVersion('PLAYWRIGHT', 1);
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
    async ({ prePortalPages }) => {
      await test.step('Navigate to pre-portal home page and select case reference (PLAYWRIGHT)', async () => {
        await prePortalPages.homePage.goTo();
        await prePortalPages.homePage.verifyUserIsOnHomePage();
        await prePortalPages.homePage.selectRecordingByCaseReferenceAndVersion('PLAYWRIGHT', 1);
        await prePortalPages.watchRecordingPage.verifyUserIsOnWatchRecordingPage();
      });

      await test.step('Verify recording details are displayed accurately', async () => {
        await expect(prePortalPages.watchRecordingPage.$static.recordingDate).toHaveText('25/11/2025');
        await expect(prePortalPages.watchRecordingPage.$static.recordingVersion).toHaveText('1');
        await expect(prePortalPages.watchRecordingPage.$static.recordingCourt).toHaveText('102 Petty France');
        await expect(prePortalPages.watchRecordingPage.$static.recordingWitness).toHaveText('WitnessOne');
        await expect(prePortalPages.watchRecordingPage.$static.recordingDefendants).toContainText('Defendant One');
        await expect(prePortalPages.watchRecordingPage.$static.recordingDefendants).toContainText('Defendant Two');
      });
    },
  );
});
