import { test } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify functionality of add users page for Level 1 user', async () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppAddUserPage }) => {
    await test.step('Navigate to Add User page', async () => {
      await navigateToPowerAppAddUserPage();
    });
  });

  test(
    'Verify user is able to click on Add user button and see add user form',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ apiClient, powerApp_AddUserPage }) => {
      await test.step('Pre-requisite step click on Add user button', async () => {
        await apiClient.createCase(1, 1);
      });

      await test.step('Verify user can click on Add User button see add user form', async () => {
        await powerApp_AddUserPage.$interactive.addUserButton.click();
        await powerApp_AddUserPage.verifyAddUserFormIsVisible();
      });

      await test.step('Verify user is able to fill all the details in add user form and submit the form successfully', async () => {});
    },
  );
});
