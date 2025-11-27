/* eslint-disable playwright/no-skipped-test */
import { test, expect } from '../../../fixtures.js';
import { config } from '../../../utils/index.js';
test.describe('Set of tests to verify pre portal UI is visually correct as Level 3 user', () => {
  test.use({ storageState: config.portalUsers.preLevel3User.sessionFile });

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
    async ({ portal_HomePage, page, userInterfaceUtils }) => {
      await test.step('Remove dynamic test data displayed within recordings table', async () => {
        await page.evaluate(() => {
          const tbody = document.querySelector('tbody.govuk-table__body');
          if (tbody) {
            tbody.remove();
          }
        });
      });

      await test.step('Redact dynamic data', async () => {
        await userInterfaceUtils.replaceTextWithinStaticElement(portal_HomePage.$static.heading, [[/^Welcome back,.*$/, 'Welcome back, Test User']]);
        await userInterfaceUtils.replaceTextWithinStaticElement(portal_HomePage.$static.recordingHeading, [[/^\s*Recording.*$/im, 'Recordings']]);
      });

      await test.step('Verify portal home page is visually correct', async () => {
        await expect(async () => {
          await expect(portal_HomePage.page).toHaveScreenshot('portal-home-page-visual.png', {
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
    async ({ portal_HomePage, portal_WatchRecordingPage }) => {
      await test.step('Navigate to watch recording page', async () => {
        await portal_HomePage.selectRecordingByCaseReferenceAndVersion('PLAYWRIGHT', 1);
        await portal_WatchRecordingPage.verifyUserIsOnWatchRecordingPage();
        await expect(portal_WatchRecordingPage.$interactive.playRecordingButton).toBeVisible({ timeout: 30_000 });
      });

      await test.step('Verify watch recording page is visually correct', async () => {
        await expect(async () => {
          await expect(portal_WatchRecordingPage.page).toHaveScreenshot('portal-watch-recording-page-visual.png', {
            fullPage: true,
            mask: [portal_WatchRecordingPage.$static.recordingUID],
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );
});
