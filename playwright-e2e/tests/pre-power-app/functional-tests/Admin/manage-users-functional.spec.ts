import { test, expect } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify functionality of manage users for Level 1 user', async () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppManageUsersPage }) => {
    await test.step('Navigate to Manage Users page', async () => {
      await navigateToPowerAppManageUsersPage();
    });
  });

  test(
    'Verify user is able to view Manage Users page and see all three buttons',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ apiClient, powerApp_ManageUsersPage }) => {
      await test.step('Pre-requisite step verify Manage Users page is visible', async () => {
        await powerApp_ManageUsersPage.verifyUserIsOnManageUsersPage();
        await apiClient.createCase(1, 1);
      });

      await test.step('Verify user is able to view Manage Users page and see all three buttons', async () => {
        await powerApp_ManageUsersPage.verifyUserIsOnManageUsersPage();
      });

      await test.step('Verify Add user, Search user and Manage court access buttons are visible', async () => {
        await expect(powerApp_ManageUsersPage.$interactive.addUserButton).toBeVisible();
        await expect(powerApp_ManageUsersPage.$interactive.searchUserButton).toBeVisible();
        await expect(powerApp_ManageUsersPage.$interactive.manageCourtAccessButton).toBeVisible();
      });
    },
  );
});
