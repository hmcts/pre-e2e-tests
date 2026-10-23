/* eslint-disable playwright/no-skipped-test */
import { test, expect } from '../../../fixtures.js';
import { config } from '../../../utils/index.js';

// test.describe('Set of tests to verify pre portal UI is visually correct as Level 3 user', () => {
//   test.use({ storageState: config.portalUsers.preLevel3User.sessionFile });

test.describe('Set of tests to verify pre portal UI is visually correct as super user', () => {
  test.use({ storageState: config.portalUsers.preSuperUser.sessionFile });

  test.beforeAll(async ({ headless }) => {
    test.skip(!headless, 'Skipping visual tests in headed mode');
  });

  test.beforeEach(async ({ navigateToPortalHomePage }) => {
    await navigateToPortalHomePage();
  });

  test(
    'Verify home page is visually correct',
    {
      tag: ['@regression', '@visual'],
    },
    async ({ prePortalPages, page, userInterfaceUtils }) => {
      await test.step('Remove dynamic test data displayed within recordings table', async () => {
        await page.evaluate(() => {
          const tbody = document.querySelector('tbody.govuk-table__body');
          if (tbody) {
            tbody.remove();
          }
        });
      });

      await test.step('Redact dynamic data', async () => {
        await userInterfaceUtils.replaceTextWithinStaticElement(prePortalPages.homePage.$static.heading, [
          [/^Welcome back,.*$/, 'Welcome back, Test User'],
        ]);
        await userInterfaceUtils.replaceTextWithinStaticElement(prePortalPages.homePage.$static.recordingHeading, [
          [/^\s*Recording.*$/im, 'Recordings'],
        ]);
      });

      await test.step('Verify portal home page is visually correct', async () => {
        await expect(async () => {
          await prePortalPages.homePage.$static.heading.waitFor({ state: 'visible', timeout: 60_000 });
          await expect(prePortalPages.homePage.page).toHaveScreenshot('portal-home-page-visual.png', {
            fullPage: true,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify watch recording page is visually correct',
    {
      tag: ['@regression', '@visual'],
    },
    async ({ prePortalPages }) => {
      await test.step('Navigate to watch recording page', async () => {
        await prePortalPages.homePage.selectRecordingByCaseReferenceAndVersion('PLAYWRIGHT', 1);
        await prePortalPages.watchRecordingPage.verifyUserIsOnWatchRecordingPage();
        await expect(prePortalPages.watchRecordingPage.$interactive.playRecordingButton).toBeVisible({ timeout: 60_000 });
      });

      await test.step('Verify watch recording page is visually correct', async () => {
        const maskedElements = [
          prePortalPages.watchRecordingPage.$static.recordingUID,
          prePortalPages.watchRecordingPage.$static.recordingDefendants,
          prePortalPages.watchRecordingPage.page.locator('div[id="videoWrapper"]'),
        ];

        await prePortalPages.watchRecordingPage.$static.heading.waitFor({ state: 'visible', timeout: 60_000 });
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(async () => {
          await expect(prePortalPages.watchRecordingPage.page).toHaveScreenshot('portal-watch-recording-page-visual.png', {
            fullPage: true,
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );
});
