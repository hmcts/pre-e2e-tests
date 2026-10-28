import { test as setup } from './fixtures';

/**
 * Sets up test sessions for all required user roles and stores session data.
 * This setup script can be reused for each user type individually.
 * Note: Manually signing out during tests will invalidate the stored session.
 */

setup.describe('Set up users and retrieve tokens', () => {
  setup('Store session data for Level 3 user', async ({ prePortalPages, context, config }) => {
    const user = config.portalUsers.preLevel3User;
    await prePortalPages.homePage.goTo();
    await prePortalPages.b2cLoginPage.signIn(user.username, user.password);
    await prePortalPages.homePage.verifyUserIsOnHomePage();
    await context.storageState({ path: user.sessionFile });
  });

  setup('Store session data for super user', async ({ prePortalPages, context, config }) => {
    const user = config.portalUsers.preSuperUser;
    await prePortalPages.homePage.goTo();
    await prePortalPages.b2cLoginPage.signIn(user.username, user.password);
    await prePortalPages.homePage.page.waitForLoadState('domcontentloaded');
    await prePortalPages.homePage.verifyUserIsOnHomePage();
    await context.storageState({ path: user.sessionFile });
  });

  setup('Store dynamic data for Level 1 power app user', async ({ config, powerAppPages, networkInterceptUtils }) => {
    const user = config.powerAppUsers.preLevel1User;

    await powerAppPages.msSignInPage.page.setViewportSize({ width: 1280, height: 720 });
    await powerAppPages.msSignInPage.signIn(user.username, user.password);
    await networkInterceptUtils.interceptAndStoreUserDataUponLogin(user.userDataFile);
  });
});
