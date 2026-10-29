import { test } from '../../../fixtures';
import { config } from '../../../utils';

test.describe('Set of tests to verify accessibility of pages within pre portal', () => {
  test.use({ storageState: config.portalUsers.preSuperUser.sessionFile });

  test.beforeEach(async ({ navigateToPortalHomePage }) => {
    await navigateToPortalHomePage();
  });

  test(
    'Verify accessibility on user admin page',
    {
      tag: ['@accessibility'],
    },
    async ({ prePortalPages, axeUtils }) => {
      await test.step('Navigate to user admin page', async () => {
        await prePortalPages.homePage.selectHeaderLink('User Admin');
        await prePortalPages.userAdminPage.verifyUserIsOnPage();
      });

      await test.step('Check accessibility on user admin page', async () => {
        await axeUtils.audit();
      });
    },
  );
});
