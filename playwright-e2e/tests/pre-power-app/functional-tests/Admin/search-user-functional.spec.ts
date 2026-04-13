import { test } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify functionality of search user page for Level 1 user', async () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppSearchUserPage }) => {
    await test.step('Navigate to Search User page', async () => {
      await navigateToPowerAppSearchUserPage();
    });
  });

  test(
    'Verify user is able to click on Search button and see search user form',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ apiClient, powerApp_SearchUserPage }) => {
      await test.step('Pre-requisite step click on Search User button', async () => {
        await apiClient.createCase(1, 1);
      });

      await test.step('Verify user can click on Search User button', async () => {
        await powerApp_SearchUserPage.$interactive.searchUserButton.click();
        await powerApp_SearchUserPage.verifyUserIsOnSearchUserPage();
      });

      await test.step('Verify user is able to search for a user successfully', async () => {});
    },
  );
});
