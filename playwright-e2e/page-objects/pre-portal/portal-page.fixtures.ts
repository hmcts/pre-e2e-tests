import { Page } from '@playwright/test';
import { PortalHomePage, PortalB2cLoginPage, PortalWatchRecordingPage } from './pages/index.js';
import { PortalEditRequestPage } from './pages/portal-edit-request-page.po.js';

export interface PortalPageFixtures {
  determinePage: Page;
  portal_HomePage: PortalHomePage;
  portal_B2cLoginPage: PortalB2cLoginPage;
  portal_WatchRecordingPage: PortalWatchRecordingPage;
  portal_EditRequestPage: PortalEditRequestPage;
  navigateToPortalHomePage: () => Promise<void>;
}

/* Instantiates pages and provides page to the test via use()
 * can also contain steps before or after providing the page
 * this is the same behaviour as a beforeEach/afterEach hook
 */
export const portalPageFixtures = {
  // If a performance test is executed, use the lighthouse created page instead
  determinePage: async ({ page, lighthousePage }, use, testInfo) => {
    if (testInfo.tags.includes('@performance')) {
      await use(lighthousePage);
    } else {
      await use(page);
    }
  },
  portal_HomePage: async ({ determinePage }, use) => {
    const portalHomePage = new PortalHomePage(determinePage);
    await use(portalHomePage);
  },
  portal_B2cLoginPage: async ({ determinePage }, use) => {
    const portalB2cLoginPage = new PortalB2cLoginPage(determinePage);
    await use(portalB2cLoginPage);
  },
  portal_WatchRecordingPage: async ({ determinePage }, use) => {
    const portalWatchRecordingPage = new PortalWatchRecordingPage(determinePage);
    await use(portalWatchRecordingPage);
  },

  portal_EditRequestPage: async ({ determinePage }, use) => {
    const portalEditRequestPage = new PortalEditRequestPage(determinePage);
    await use(portalEditRequestPage);
  },
  navigateToPortalHomePage: async ({ portal_HomePage }: PortalPageFixtures, use) => {
    await use(async () => {
      await portal_HomePage.goTo();
    });
  },
};
