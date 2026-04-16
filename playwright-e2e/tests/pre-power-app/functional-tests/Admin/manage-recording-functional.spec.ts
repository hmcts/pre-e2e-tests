import { expect, test } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify functionality of manage recordings page for pre-level 1 user', () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppManageRecordingsPage }) => {
    await test.step('Navigate to manage recordings page', async () => {
      await navigateToPowerAppManageRecordingsPage();
    });
  });

  test(
    'Verify user is able to view recordings on manage recordings page',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ apiClient, powerApp_ManageRecordingsPage }) => {
      await test.step('Pre-requisite step click on manage recordings button', async () => {
        await powerApp_ManageRecordingsPage.$interactive.manageRecordingsButton.click();
        await powerApp_ManageRecordingsPage.verifyUserIsOnManageRecordingsPage();
      });
      await test.step('Verify user is able to view the recording details on manage recordings page', async () => {
        await expect(powerApp_ManageRecordingsPage.$interactive.manageRecordingsLabel).toBeVisible({ timeout: 15000 });
      });
    },
  );
});
