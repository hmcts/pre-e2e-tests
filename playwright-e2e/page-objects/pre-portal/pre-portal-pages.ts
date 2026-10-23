import { Page } from '@playwright/test';
import {
  PortalB2cLoginPage,
  PortalHomePage,
  PortalUserAdminPage,
  PortalSupportPage,
  PortalManagementPage,
  PortalSystemStatusPage,
  PortalWatchRecordingsPage,
  PortalHelpPage,
} from './pages/index';

export class PrePortalPages {
  private readonly page: Page;

  public b2cLoginPage: PortalB2cLoginPage;
  public homePage: PortalHomePage;
  public recordingPage: PortalWatchRecordingsPage;
  public recordingsPage: PortalWatchRecordingsPage;
  public watchRecordingPage: PortalWatchRecordingsPage;
  public userAdminPage: PortalUserAdminPage;
  public supportPage: PortalSupportPage;
  public helpPage: PortalHelpPage;
  public managementPage: PortalManagementPage;
  public systemStatusPage: PortalSystemStatusPage;

  constructor(page: Page) {
    this.page = page;
    this.b2cLoginPage = new PortalB2cLoginPage(this.page);
    this.homePage = new PortalHomePage(this.page);
    this.recordingsPage = new PortalWatchRecordingsPage(this.page);
    this.recordingPage = this.recordingsPage;
    this.watchRecordingPage = this.recordingsPage;
    this.userAdminPage = new PortalUserAdminPage(this.page);
    this.supportPage = new PortalSupportPage(this.page);
    this.helpPage = new PortalHelpPage(this.page);
    this.managementPage = new PortalManagementPage(this.page);
    this.systemStatusPage = new PortalSystemStatusPage(this.page);
  }

  /**
   * Creates a new PrePortalPages instance bound to another browser context or tab.
   * Allows multi-tab testing.
   */
  public async newBrowserContext(options: { pageContext: Page }): Promise<PrePortalPages> {
    return new PrePortalPages(options.pageContext);
  }
}
