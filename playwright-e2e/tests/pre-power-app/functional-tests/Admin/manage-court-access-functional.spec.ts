import { test } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify functionality of manage court access page for Level 1 user', async () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppManageCourtAccessPage }) => {
    await test.step('Navigate to manage court access page', async () => {
      await navigateToPowerAppManageCourtAccessPage();
    });
  });

  test(
    'Verify user is able to click on Manage Court Access button and see the deatails',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ apiClient, powerApp_ManageCourtAccessPage }) => {
      await test.step('Pre-requisite step click on Manage Court Access button', async () => {
        await apiClient.createCase(1, 1);
      });

      await test.step('Verify user can click on Manage Court Access button see add user form', async () => {
        await powerApp_ManageCourtAccessPage.$interactive.manageCourtAccessButton.click();
        await powerApp_ManageCourtAccessPage.verifyUserIsOnManageCourtAccessPage();
      });

      await test.step('Verify user is able to fill all the details in add user form and submit the form successfully', async () => {});
    },
  );
});
