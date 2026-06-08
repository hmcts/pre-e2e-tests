import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';
import { createAndShareRecordingWithPortalUser } from '../helpers/portal-recording.helpers.js';

test.describe('Set of tests to verify accessibility of pages within pre portal', () => {
  test.use({ storageState: config.portalUsers.preLevel3User.sessionFile });

  test.beforeEach(async ({ navigateToPortalHomePage }) => {
    await navigateToPortalHomePage();
  });

  test(
    'Verify accessibility on home page',
    {
      tag: ['@accessibility'],
    },
    async ({ axeUtils }) => {
      await test.step('Check accessibility on home page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on watch recordings page',
    {
      tag: ['@accessibility'],
    },
    async ({ prePortalPages, axeUtils, apiClient, newBrowserContextAndPage }) => {
      const { caseData } = await test.step('Create and share a recording for the portal user', async () =>
        createAndShareRecordingWithPortalUser(apiClient, newBrowserContextAndPage));

      await test.step('Navigate to watch recording page', async () => {
        await prePortalPages.homePage.goTo();
        await prePortalPages.homePage.verifyUserIsOnHomePage();
        await prePortalPages.homePage.selectRecordingByCaseReferenceAndVersion(caseData.caseReference, 1);
        await prePortalPages.watchRecordingPage.verifyUserIsOnWatchRecordingPage();
        await expect(prePortalPages.watchRecordingPage.$interactive.playRecordingButton).toBeVisible({ timeout: 60_000 });
      });

      await test.step('Check accessibility on watch recordings page', async () => {
        await axeUtils.audit();
      });
    },
  );
});
