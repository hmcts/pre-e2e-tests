import { Page } from '@playwright/test';
import { ApiClient } from '../../api-requests';
import {
  PowerAppAddUserPage,
  PowerAppAdminPage,
  PowerAppCaseDetailsPage,
  PowerAppHomePage,
  PowerAppManageBookingsPage,
  PowerAppManageCasesPage,
  PowerAppManageCourtAccessPage,
  PowerAppManageRecordingsPage,
  PowerAppManageUsersPage,
  PowerAppMsSignInPage,
  PowerAppProcessingRecordingsPage,
  PowerAppScheduleRecordingPage,
  PowerAppSearchUserPage,
  PowerAppViewLiveFeedPage,
  PowerAppViewRecordingsPage,
} from './pages/index.js';
import { NavBarComponent } from './components/index.js';

export class PowerAppPages {
  private readonly page: Page;
  private apiClient: ApiClient;

  public msSignInPage: PowerAppMsSignInPage;
  public homePage: PowerAppHomePage;
  public caseDetailsPage: PowerAppCaseDetailsPage;
  public scheduleRecordingPage: PowerAppScheduleRecordingPage;
  public processingRecordingsPage: PowerAppProcessingRecordingsPage;
  public viewRecordingsPage: PowerAppViewRecordingsPage;
  public viewLiveFeedPage: PowerAppViewLiveFeedPage;
  public manageBookingsPage: PowerAppManageBookingsPage;
  public manageCasesPage: PowerAppManageCasesPage;
  public manageCourtAccessPage: PowerAppManageCourtAccessPage;
  public manageRecordingsPage: PowerAppManageRecordingsPage;
  public manageUsersPage: PowerAppManageUsersPage;
  public addUserPage: PowerAppAddUserPage;
  public adminPage: PowerAppAdminPage;
  public searchUserPage: PowerAppSearchUserPage;
  public navBarComponent: NavBarComponent;

  constructor(page: Page, apiClient: ApiClient) {
    this.page = page;
    this.apiClient = apiClient;
    this.msSignInPage = new PowerAppMsSignInPage(this.page);
    this.homePage = new PowerAppHomePage(this.page);
    this.caseDetailsPage = new PowerAppCaseDetailsPage(this.page);
    this.scheduleRecordingPage = new PowerAppScheduleRecordingPage(this.page);
    this.processingRecordingsPage = new PowerAppProcessingRecordingsPage(this.page);
    this.viewRecordingsPage = new PowerAppViewRecordingsPage(this.page, this.apiClient);
    this.viewLiveFeedPage = new PowerAppViewLiveFeedPage(this.page);
    this.manageBookingsPage = new PowerAppManageBookingsPage(this.page);
    this.manageCasesPage = new PowerAppManageCasesPage(this.page);
    this.manageCourtAccessPage = new PowerAppManageCourtAccessPage(this.page);
    this.manageRecordingsPage = new PowerAppManageRecordingsPage(this.page);
    this.manageUsersPage = new PowerAppManageUsersPage(this.page);
    this.addUserPage = new PowerAppAddUserPage(this.page);
    this.adminPage = new PowerAppAdminPage(this.page);
    this.searchUserPage = new PowerAppSearchUserPage(this.page);
    this.navBarComponent = new NavBarComponent(this.page);
  }

  /**
   * Creates a new PowerAppPages instance bound to another browser context or tab.
   * Allows multi-tab testing.
   */
  public async newBrowserContext(options: { pageContext: Page }): Promise<PowerAppPages> {
    return new PowerAppPages(options.pageContext, this.apiClient);
  }
}
