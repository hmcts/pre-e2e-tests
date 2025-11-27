import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';

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
    async ({ portal_HomePage, portal_WatchRecordingPage, axeUtils }) => {
      await test.step('Navigate to watch recording page', async () => {
        await portal_HomePage.selectRecordingByCaseReferenceAndVersion('PLAYWRIGHT', 1);
        await portal_WatchRecordingPage.verifyUserIsOnWatchRecordingPage();
        await expect(portal_WatchRecordingPage.$interactive.playRecordingButton).toBeVisible({ timeout: 30_000 });
      });

      await test.step('Check accessibility on watch recordings page', async () => {
        await axeUtils.audit();
      });
    },
  );
});
