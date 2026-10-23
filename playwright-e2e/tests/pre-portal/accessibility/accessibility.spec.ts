import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';

test.describe('Set of tests to verify accessibility of pages within pre portal', () => {
  test.use({ storageState: config.portalUsers.preSuperUser.sessionFile });

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
    async ({ prePortalPages, axeUtils }) => {
      await test.step('Navigate to watch recording page', async () => {
        await prePortalPages.homePage.selectRecordingByCaseReferenceAndVersion('PLAYWRIGHT', 1);
        await prePortalPages.recordingPage.verifyUserIsOnWatchRecordingPage();
        await expect(prePortalPages.recordingPage.$interactive.playRecordingButton).toBeVisible({ timeout: 60_000 });
      });

      await test.step('Check accessibility on watch recordings page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on help page',
    {
      tag: ['@accessibility'],
    },
    async ({ prePortalPages, axeUtils }) => {
      await test.step('Navigate to help page', async () => {
        await prePortalPages.homePage.goToHelpPage();
        await prePortalPages.helpPage.verifyUserIsOnHelpPage();
      });

      await test.step('Check accessibility on help page', async () => {
        await axeUtils.audit();
      });
    },
  );
});
