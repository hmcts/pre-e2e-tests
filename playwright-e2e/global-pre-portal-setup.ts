import { test as setup } from './fixtures';

/**
 * Sets up test sessions for all required user roles and stores session data.
 * This setup script can be reused for each user type individually.
 * Note: Manually signing out during tests will invalidate the stored session.
 */
setup.describe('Set up users and retrieve tokens', () => {
  setup('Store session data for Level 3 user', async ({ portal_HomePage, portal_B2cLoginPage, context, config }) => {
    const user = config.portalUsers.preLevel3User;
    await portal_HomePage.goTo();
    await portal_B2cLoginPage.signIn(user.username, user.password);
    await portal_HomePage.verifyUserIsOnHomePage();
    await context.storageState({ path: user.sessionFile });
  });

  setup('Store session data for super user', async ({ portal_HomePage, portal_B2cLoginPage, context, config }) => {
    const user = config.portalUsers.preSuperUser;
    await portal_HomePage.goTo();
    await portal_B2cLoginPage.signIn(user.username, user.password);
    await portal_HomePage.verifyUserIsOnHomePage();
    await context.storageState({ path: user.sessionFile });
  });

  setup('Store dynamic data for Level 1 power app user', async ({ config, powerApp_MsSignInPage, networkInterceptUtils }) => {
    // Storing dynamic data to allow api client to use user id and court id,
    // the reason for using try catch block is to allow tests that do not depend on this to continue execution.
    const user = config.powerAppUsers.preLevel1User;
    const maxRetries = 3;

    await powerApp_MsSignInPage.page.setViewportSize({ width: 1280, height: 720 });
    await powerApp_MsSignInPage.signIn(user.username, user.password);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await networkInterceptUtils.interceptAndStoreUserDataUponLogin(user.userDataFile);
        return;
      } catch (error) {
        if (attempt === maxRetries) {
          console.log('Error storing dynamic data for Level 1 power app user:', error);
        } else {
          await powerApp_MsSignInPage.page.reload();
        }
      }
    }
  });
});
