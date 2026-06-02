import { Page } from '@playwright/test';
import { PowerAppPageFixtures, powerAppPageFixtures } from './pre-power-app/power-app-page.fixtures.js';
import { CvpPageFixtures, cvpPageFixtures } from './cvp/cvp-page.fixtures.js';
import { PortalPageFixtures, portalPageFixtures } from './pre-portal/portal-page.fixtures.js';
import { PortalUserRole, PowerAppUserRole } from '../utils/config.utils.js';
import { config } from '../utils/config.utils.js';

export type PageFixtures = PowerAppPageFixtures &
  CvpPageFixtures &
  PortalPageFixtures & {
    determinePage: Page;
    newBrowserContextAndPage: (options: { powerappUser?: PowerAppUserRole; portalUser?: PortalUserRole }) => Promise<Page>;
  };

export const pageFixtures = {
  ...powerAppPageFixtures,
  ...cvpPageFixtures,
  ...portalPageFixtures,
  // If a performance test is executed, use the lighthouse created page instead
  determinePage: async ({ page, lighthousePage }, use, testInfo) => {
    if (testInfo.tags.includes('@performance')) {
      await use(lighthousePage);
    } else {
      await use(page);
    }
  },
  newBrowserContextAndPage: async ({ browser }, use) => {
    await use(async (options: { powerappUser?: PowerAppUserRole; portalUser?: PortalUserRole }) => {
      let page: Page;

      if (options.powerappUser) {
        const user = config.powerAppUsers[options.powerappUser];
        const context = await browser.newContext({ storageState: user.sessionFile });
        page = await context.newPage();
      } else if (options.portalUser) {
        const user = config.portalUsers[options.portalUser];
        const context = await browser.newContext({ storageState: user.sessionFile });
        page = await context.newPage();
      } else {
        throw new Error('Either powerappUser or portalUser must be specified to create a new browser context with the appropriate session.');
      }

      return page;
    });
  },
};
