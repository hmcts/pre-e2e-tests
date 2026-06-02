import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';

test.describe('Set of tests to verify the homepage buttons are in the correct state', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppHomePage }) => {
    await navigateToPowerAppHomePage();
  });

  test(
    'Verify all buttons on the homepage are visible and enabled',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ powerAppPages }) => {
      await test.step('Verify all buttons on homepage are visible', async () => {
        await expect(powerAppPages.homePage.$interactive.bookARecordingButton).toBeVisible();
        await expect(powerAppPages.homePage.$interactive.manageBookingsButton).toBeVisible();
        await expect(powerAppPages.homePage.$interactive.viewRecordingsButton).toBeVisible();
        await expect(powerAppPages.homePage.$interactive.adminButton).toBeVisible();
      });

      await test.step('Verify all buttons on homepage are enabled', async () => {
        await expect(powerAppPages.homePage.$interactive.bookARecordingButton).toBeEnabled();
        await expect(powerAppPages.homePage.$interactive.manageBookingsButton).toBeEnabled();
        await expect(powerAppPages.homePage.$interactive.viewRecordingsButton).toBeEnabled();
        await expect(powerAppPages.homePage.$interactive.adminButton).toBeEnabled();
      });
    },
  );
});
