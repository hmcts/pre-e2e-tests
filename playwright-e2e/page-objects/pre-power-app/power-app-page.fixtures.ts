import { Page } from '@playwright/test';
import {
  PowerAppMsSignInPage,
  PowerAppHomePage,
  PowerAppCaseDetailsPage,
  PowerAppScheduleRecordingPage,
  PowerAppManageBookingsPage,
  PowerAppViewLiveFeedPage,
  PowerAppProcessingRecordingsPage,
  PowerAppViewRecordingsPage,
} from './pages/index.js';
import { NavBarComponent } from './components/index.js';

export interface PowerAppPageFixtures {
  determinePage: Page;
  powerApp_MsSignInPage: PowerAppMsSignInPage;
  powerApp_HomePage: PowerAppHomePage;
  powerApp_CaseDetailsPage: PowerAppCaseDetailsPage;
  powerApp_ScheduleRecordingPage: PowerAppScheduleRecordingPage;
  powerApp_NavBarComponent: NavBarComponent;
  powerApp_ManageBookingsPage: PowerAppManageBookingsPage;
  powerApp_ViewLiveFeedPage: PowerAppViewLiveFeedPage;
  powerApp_ProcessingRecordingsPage: PowerAppProcessingRecordingsPage;
  powerApp_ViewRecordingsPage: PowerAppViewRecordingsPage;
  navigateToPowerAppHomePage: () => Promise<void>;
  navigateToPowerAppCaseDetailsPage: () => Promise<void>;
  navigateToPowerAppScheduleRecordingsPage: (caseReference: string) => Promise<void>;
  navigateToPowerAppManageBookingsPage: () => Promise<void>;
  navigateToPowerAppViewLiveFeedPage: (caseReference: string) => Promise<void>;
  navigateToPowerAppViewRecordingsPage: () => Promise<void>;
}

/* Instantiates pages and provides page to the test via use()
 * can also contain steps before or after providing the page
 * this is the same behaviour as a beforeEach/afterEach hook
 */
export const powerAppPageFixtures = {
  // If a performance test is executed, use the lighthouse created page instead
  determinePage: async ({ page, lighthousePage }, use, testInfo) => {
    if (testInfo.tags.includes('@performance')) {
      await use(lighthousePage);
    } else {
      await use(page);
    }
  },
  powerApp_MsSignInPage: async ({ determinePage }, use) => {
    const powerApp_MsSignInPage = new PowerAppMsSignInPage(determinePage);
    await use(powerApp_MsSignInPage);
  },
  powerApp_HomePage: async ({ determinePage }, use) => {
    const powerApp_HomePage = new PowerAppHomePage(determinePage);
    await use(powerApp_HomePage);
  },
  powerApp_CaseDetailsPage: async ({ determinePage }, use) => {
    const powerApp_CaseDetailsPage = new PowerAppCaseDetailsPage(determinePage);
    await use(powerApp_CaseDetailsPage);
  },
  powerApp_ScheduleRecordingPage: async ({ determinePage }, use) => {
    const powerApp_ScheduleRecordingPage = new PowerAppScheduleRecordingPage(determinePage);
    await use(powerApp_ScheduleRecordingPage);
  },
  powerApp_NavBarComponent: async ({ determinePage }, use) => {
    const powerApp_NavBarComponent = new NavBarComponent(determinePage);
    await use(powerApp_NavBarComponent);
  },
  powerApp_ManageBookingsPage: async ({ determinePage }, use) => {
    const powerApp_ManageBookingsPage = new PowerAppManageBookingsPage(determinePage);
    await use(powerApp_ManageBookingsPage);
  },
  powerApp_ViewLiveFeedPage: async ({ determinePage }, use) => {
    const powerApp_ViewLiveFeedPage = new PowerAppViewLiveFeedPage(determinePage);
    await use(powerApp_ViewLiveFeedPage);
  },
  powerApp_ProcessingRecordingsPage: async ({ determinePage }, use) => {
    const powerApp_ProcessingRecordingsPage = new PowerAppProcessingRecordingsPage(determinePage);
    await use(powerApp_ProcessingRecordingsPage);
  },
  powerApp_ViewRecordingsPage: async ({ determinePage, apiClient }, use) => {
    const powerApp_ViewRecordingsPage = new PowerAppViewRecordingsPage(determinePage, apiClient);
    await use(powerApp_ViewRecordingsPage);
  },
  navigateToPowerAppHomePage: async ({ powerApp_HomePage, determinePage, powerApp_NavBarComponent }: PowerAppPageFixtures, use) => {
    await use(async () => {
      if (determinePage.url().includes('apps.powerapps.com') && !(await powerApp_HomePage.$static.heading.isVisible())) {
        await powerApp_NavBarComponent.$interactive.HomeButton.click();
      } else if (!determinePage.url().includes('apps.powerapps.com')) {
        await powerApp_HomePage.goTo();
      }
      await powerApp_HomePage.verifyUserIsOnHomePage();
    });
  },
  navigateToPowerAppCaseDetailsPage: async (
    { navigateToPowerAppHomePage, powerApp_HomePage, powerApp_CaseDetailsPage }: PowerAppPageFixtures,
    use,
  ) => {
    await use(async () => {
      await navigateToPowerAppHomePage();
      await powerApp_HomePage.navigationClick(powerApp_HomePage.$interactive.bookARecordingButton);
      await powerApp_CaseDetailsPage.verifyUserIsOnCaseDetailsPage();
    });
  },
  navigateToPowerAppScheduleRecordingsPage: async (
    { navigateToPowerAppCaseDetailsPage, powerApp_CaseDetailsPage, powerApp_ScheduleRecordingPage }: PowerAppPageFixtures,
    use,
  ) => {
    await use(async (caseReference: string) => {
      await navigateToPowerAppCaseDetailsPage();
      await powerApp_CaseDetailsPage.searchAndSelectExistingCase(caseReference);
      await powerApp_CaseDetailsPage.navigationClick(powerApp_CaseDetailsPage.$interactive.bookingsButton);
      await powerApp_ScheduleRecordingPage.verifyUserIsOnScheduleRecordingsPage();
    });
  },
  navigateToPowerAppManageBookingsPage: async (
    { navigateToPowerAppHomePage, powerApp_HomePage, powerApp_ManageBookingsPage }: PowerAppPageFixtures,
    use,
  ) => {
    await use(async () => {
      await navigateToPowerAppHomePage();
      await powerApp_HomePage.navigationClick(powerApp_HomePage.$interactive.manageBookingsButton);
      await powerApp_ManageBookingsPage.verifyUserIsOnManageBookingsPage();
    });
  },
  navigateToPowerAppViewLiveFeedPage: async (
    { navigateToPowerAppManageBookingsPage, powerApp_ManageBookingsPage, powerApp_ViewLiveFeedPage }: PowerAppPageFixtures,
    use,
  ) => {
    await use(async (caseReference: string) => {
      await navigateToPowerAppManageBookingsPage();
      await powerApp_ManageBookingsPage.searchForABooking(caseReference);
      await powerApp_ManageBookingsPage.navigationClick(powerApp_ManageBookingsPage.$interactive.recordButton);
      await powerApp_ViewLiveFeedPage.verifyUserIsOnViewLiveFeedPage();
    });
  },
  navigateToPowerAppViewRecordingsPage: async (
    { navigateToPowerAppHomePage, powerApp_HomePage, powerApp_ViewRecordingsPage }: PowerAppPageFixtures,
    use,
  ) => {
    await use(async () => {
      await navigateToPowerAppHomePage();
      await powerApp_HomePage.navigationClick(powerApp_HomePage.$interactive.viewRecordingsButton);
      await powerApp_ViewRecordingsPage.verifyUserIsOnViewRecordingsPage();
    });
  },
};
