import { Page } from '@playwright/test';
import { PortalB2cLoginPage, PortalHomePage, PortalWatchRecordingPage } from './pages/index';

export class PrePortalPages {
  private readonly page: Page;

  public b2cLoginPage: PortalB2cLoginPage;
  public homePage: PortalHomePage;
  public watchRecordingPage: PortalWatchRecordingPage;

  constructor(page: Page) {
    this.page = page;
    this.b2cLoginPage = new PortalB2cLoginPage(this.page);
    this.homePage = new PortalHomePage(this.page);
    this.watchRecordingPage = new PortalWatchRecordingPage(this.page);
  }

  /**
   * Creates a new PrePortalPages instance bound to another browser context or tab.
   * Allows multi-tab testing.
   */
  public async newBrowserContext(options: { pageContext: Page }): Promise<PrePortalPages> {
    return new PrePortalPages(options.pageContext);
  }
}
