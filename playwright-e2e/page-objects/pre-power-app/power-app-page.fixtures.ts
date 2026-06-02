import { PageFixtures } from '../page.fixtures.js';
import { ApiFixtures } from '../../api-requests/api.fixtures.js';
import { PowerAppPages } from './power-app-pages.js';

export interface PowerAppPageFixtures {
  powerAppPages: PowerAppPages;
  navigateToPowerAppHomePage: () => Promise<void>;
  navigateToPowerAppCaseDetailsPage: () => Promise<void>;
  navigateToPowerAppScheduleRecordingsPage: (caseReference: string) => Promise<void>;
  navigateToPowerAppManageBookingsPage: () => Promise<void>;
  navigateToPowerAppViewLiveFeedPage: (caseReference: string) => Promise<void>;
  navigateToPowerAppViewRecordingsPage: () => Promise<void>;
  navigateToPowerAppAdminPage: () => Promise<void>;
  navigateToPowerAppManageCasesPage: () => Promise<void>;
  navigateToPowerAppManageUsersPage: () => Promise<void>;
  navigateToPowerAppAddUserPage: () => Promise<void>;
  navigateToPowerAppSearchUserPage: () => Promise<void>;
  navigateToPowerAppManageCourtAccessPage: () => Promise<void>;
  navigateToPowerAppManageRecordingsPage: () => Promise<void>;
}

/* Instantiates pages and provides page to the test via use()
 * can also contain steps before or after providing the page
 * this is the same behaviour as a beforeEach/afterEach hook
 */
export const powerAppPageFixtures = {
  powerAppPages: async ({ determinePage, apiClient }: PageFixtures & ApiFixtures, use) => {
    const powerAppPages = new PowerAppPages(determinePage, apiClient);
    await use(powerAppPages);
  },
  navigateToPowerAppHomePage: async ({ powerAppPages, determinePage }: PageFixtures & PowerAppPageFixtures, use) => {
    await use(async () => {
      if (determinePage.url().includes('apps.powerapps.com') && !(await powerAppPages.homePage.$static.heading.isVisible())) {
        await powerAppPages.navBarComponent.$interactive.HomeButton.click();
      } else if (!determinePage.url().includes('apps.powerapps.com')) {
        await powerAppPages.homePage.goTo();
      }
      await powerAppPages.homePage.verifyUserIsOnHomePage();
    });
  },
  navigateToPowerAppCaseDetailsPage: async ({ navigateToPowerAppHomePage, powerAppPages }: PowerAppPageFixtures, use) => {
    await use(async () => {
      await navigateToPowerAppHomePage();
      await powerAppPages.homePage.navigationClick(powerAppPages.homePage.$interactive.bookARecordingButton);
      await powerAppPages.caseDetailsPage.verifyUserIsOnCaseDetailsPage();
    });
  },
  navigateToPowerAppScheduleRecordingsPage: async ({ navigateToPowerAppCaseDetailsPage, powerAppPages }: PowerAppPageFixtures, use) => {
    await use(async (caseReference: string) => {
      await navigateToPowerAppCaseDetailsPage();
      await powerAppPages.caseDetailsPage.searchAndSelectExistingCase(caseReference);
      await powerAppPages.caseDetailsPage.navigationClick(powerAppPages.caseDetailsPage.$interactive.bookingsButton);
      await powerAppPages.scheduleRecordingPage.verifyUserIsOnScheduleRecordingsPage();
    });
  },
  navigateToPowerAppManageBookingsPage: async ({ navigateToPowerAppHomePage, powerAppPages }: PowerAppPageFixtures, use) => {
    await use(async () => {
      await navigateToPowerAppHomePage();
      await powerAppPages.homePage.navigationClick(powerAppPages.homePage.$interactive.manageBookingsButton);
      await powerAppPages.manageBookingsPage.verifyUserIsOnManageBookingsPage();
    });
  },
  navigateToPowerAppViewLiveFeedPage: async ({ navigateToPowerAppManageBookingsPage, powerAppPages }: PowerAppPageFixtures, use) => {
    await use(async (caseReference: string) => {
      await navigateToPowerAppManageBookingsPage();
      await powerAppPages.manageBookingsPage.searchForABooking(caseReference);
      await powerAppPages.manageBookingsPage.navigationClick(powerAppPages.manageBookingsPage.$interactive.recordButton);
      await powerAppPages.viewLiveFeedPage.verifyUserIsOnViewLiveFeedPage();
    });
  },
  navigateToPowerAppViewRecordingsPage: async ({ navigateToPowerAppHomePage, powerAppPages }: PowerAppPageFixtures, use) => {
    await use(async () => {
      await navigateToPowerAppHomePage();
      await powerAppPages.homePage.navigationClick(powerAppPages.homePage.$interactive.viewRecordingsButton);
      await powerAppPages.viewRecordingsPage.verifyUserIsOnViewRecordingsPage();
    });
  },

  navigateToPowerAppAdminPage: async ({ navigateToPowerAppHomePage, powerAppPages }: PowerAppPageFixtures, use) => {
    await use(async () => {
      await navigateToPowerAppHomePage();
      await powerAppPages.homePage.navigationClick(powerAppPages.homePage.$interactive.adminButton);
      await powerAppPages.adminPage.verifyUserIsOnAdminPage();
    });
  },
  navigateToPowerAppManageCasesPage: async ({ navigateToPowerAppAdminPage, powerAppPages }: PowerAppPageFixtures, use) => {
    await use(async () => {
      await navigateToPowerAppAdminPage();
      await powerAppPages.adminPage.navigationClick(
        powerAppPages.adminPage.$interactive.manageCasesButton,
        powerAppPages.manageCasesPage.$static.casesLabel,
      );
      await powerAppPages.manageCasesPage.verifyUserIsOnManageCasesPage();
    });
  },

  navigateToPowerAppManageUsersPage: async ({ navigateToPowerAppAdminPage, powerAppPages }: PowerAppPageFixtures, use) => {
    await use(async () => {
      await navigateToPowerAppAdminPage();
      await powerAppPages.adminPage.navigationClick(
        powerAppPages.adminPage.$interactive.manageUsersButton,
        powerAppPages.manageUsersPage.$interactive.addUserButton,
      );
      await powerAppPages.manageUsersPage.verifyUserIsOnManageUsersPage();
    });
  },

  navigateToPowerAppAddUserPage: async ({ navigateToPowerAppAdminPage, powerAppPages }: PowerAppPageFixtures, use) => {
    await use(async () => {
      await navigateToPowerAppAdminPage();
      await powerAppPages.adminPage.navigationClick(
        powerAppPages.adminPage.$interactive.manageUsersButton,
        powerAppPages.manageUsersPage.$interactive.addUserButton,
      );
      await powerAppPages.addUserPage.verifyUserIsOnAddUserPage();
    });
  },

  navigateToPowerAppSearchUserPage: async ({ navigateToPowerAppAdminPage, powerAppPages }: PowerAppPageFixtures, use) => {
    await use(async () => {
      await navigateToPowerAppAdminPage();
      await powerAppPages.adminPage.navigationClick(
        powerAppPages.adminPage.$interactive.manageUsersButton,
        powerAppPages.manageUsersPage.$interactive.searchUserButton,
      );
      await powerAppPages.searchUserPage.verifyUserIsOnSearchUserPage();
    });
  },
  navigateToPowerAppManageCourtAccessPage: async ({ navigateToPowerAppAdminPage, powerAppPages }: PowerAppPageFixtures, use) => {
    await use(async () => {
      await navigateToPowerAppAdminPage();
      await powerAppPages.adminPage.navigationClick(
        powerAppPages.adminPage.$interactive.manageUsersButton,
        powerAppPages.manageUsersPage.$interactive.manageCourtAccessButton,
      );
      await powerAppPages.manageCourtAccessPage.verifyUserIsOnManageCourtAccessPage();
    });
  },
  navigateToPowerAppManageRecordingsPage: async ({ navigateToPowerAppAdminPage, powerAppPages }: PowerAppPageFixtures, use) => {
    await use(async () => {
      await navigateToPowerAppAdminPage();
      await powerAppPages.adminPage.navigationClick(
        powerAppPages.adminPage.$interactive.manageRecordingsButton,
        powerAppPages.manageRecordingsPage.$interactive.manageRecordingsLabel,
      );
      await powerAppPages.manageRecordingsPage.verifyUserIsOnManageRecordingsPage();
    });
  },
};
