/* eslint-disable playwright/no-skipped-test */
import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';

test.describe('Set of tests to verify the homepage UI is visually correct', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeAll(async ({ headless }) => {
    test.skip(!headless, 'Skipping visual tests in headed mode');
  });

  test.beforeEach(async ({ navigateToPowerAppHomePage }) => {
    await navigateToPowerAppHomePage();
  });

  test(
    'Verify homepage is visually correct',
    {
      tag: ['@visual'],
    },
    async ({ page, powerAppPages }) => {
      const maskedElements = [
        powerAppPages.homePage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        powerAppPages.homePage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        powerAppPages.homePage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
        powerAppPages.homePage.$maskedlocatorsForVisualTesting.applicationVersion,
        powerAppPages.homePage.$maskedlocatorsForVisualTesting.welcomeTextForUser,
      ];

      await test.step('Verify upon accessing homepage, it is visually correct', async () => {
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(page).toHaveScreenshot('home-page-visual.png', {
          mask: maskedElements,
        });
      });
    },
  );
});
