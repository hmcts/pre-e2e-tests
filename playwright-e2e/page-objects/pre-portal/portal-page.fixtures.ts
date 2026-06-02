import { PrePortalPages } from './pre-portal-pages.js';
import { PageFixtures } from '../page.fixtures.js';

export interface PortalPageFixtures {
  prePortalPages: PrePortalPages;
  navigateToPortalHomePage: () => Promise<void>;
}

/* Instantiates pages and provides page to the test via use()
 * can also contain steps before or after providing the page
 * this is the same behaviour as a beforeEach/afterEach hook
 */
export const portalPageFixtures = {
  prePortalPages: async ({ determinePage }: PageFixtures, use) => {
    const prePortalPages = new PrePortalPages(determinePage);
    await use(prePortalPages);
  },
  navigateToPortalHomePage: async ({ prePortalPages }: PortalPageFixtures, use) => {
    await use(async () => {
      await prePortalPages.homePage.goTo();
      await prePortalPages.homePage.verifyUserIsOnHomePage();
    });
  },
};
