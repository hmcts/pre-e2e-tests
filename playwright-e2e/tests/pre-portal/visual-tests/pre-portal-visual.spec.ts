/* eslint-disable playwright/no-skipped-test */
import { test, expect } from '../../../fixtures.js';
import { config } from '../../../utils/index.js';
import { createAndShareRecordingWithPortalUser } from '../helpers/portal-recording.helpers.js';
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
    async ({ prePortalPages, page, userInterfaceUtils }) => {
      await test.step('Remove dynamic test data displayed within recordings table', async () => {
        await page.evaluate(() => {
          document
            .querySelectorAll(
              'form[action="/browse"], tbody.govuk-table__body, .govuk-pagination, nav[aria-label*="pagination" i], [class*="pagination"]',
            )
            .forEach((element) => element.remove());
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
    async ({ prePortalPages, userInterfaceUtils, apiClient, newBrowserContextAndPage }) => {
      const { caseData } = await test.step('Create and share a recording for the portal user', async () =>
        createAndShareRecordingWithPortalUser(apiClient, newBrowserContextAndPage));

      await test.step('Navigate to watch recording page', async () => {
        await prePortalPages.homePage.goTo();
        await prePortalPages.homePage.verifyUserIsOnHomePage();
        await prePortalPages.homePage.selectRecordingByCaseReferenceAndVersion(caseData.caseReference, 1);
        await prePortalPages.watchRecordingPage.verifyUserIsOnWatchRecordingPage();
        await expect(prePortalPages.watchRecordingPage.$interactive.playRecordingButton).toBeVisible({ timeout: 60_000 });
      });

      await test.step('Verify watch recording page is visually correct', async () => {
        await userInterfaceUtils.replaceTextWithinStaticElement(prePortalPages.watchRecordingPage.$static.heading, [
          [/^Case Ref:.*$/, 'Case Ref: PLAYWRIGHT'],
        ]);
        await userInterfaceUtils.replaceTextWithinStaticElement(prePortalPages.watchRecordingPage.$static.recordingDate, [[/[\s\S]*/, '25/11/2025']]);
        await userInterfaceUtils.replaceTextWithinStaticElement(prePortalPages.watchRecordingPage.$static.recordingCourt, [
          [/[\s\S]*/, '102 Petty France'],
        ]);
        await userInterfaceUtils.replaceTextWithinStaticElement(prePortalPages.watchRecordingPage.$static.recordingWitness, [
          [/[\s\S]*/, 'WitnessOne'],
        ]);
        await userInterfaceUtils.replaceTextWithinStaticElement(prePortalPages.watchRecordingPage.$static.recordingDefendants, [
          [/[\s\S]*/, '{Redacted Name}<br>{Redacted Name}'],
        ]);
        await expect(async () => {
          await expect(prePortalPages.watchRecordingPage.page).toHaveScreenshot('portal-watch-recording-page-visual.png', {
            fullPage: true,
            mask: [prePortalPages.watchRecordingPage.$static.recordingUID],
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );
});
