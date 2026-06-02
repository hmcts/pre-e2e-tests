import { Page } from '@playwright/test';
import { CvpSignInPage, CvpRoomSettingsPage, CvpConferencePage, CvpSelectRolePage, CvpRecordingCallPage } from './index';

export class CvpPages {
  private readonly page: Page;
  public signInPage: CvpSignInPage;
  public roomSettingsPage: CvpRoomSettingsPage;
  public conferencePage: CvpConferencePage;
  public selectRolePage: CvpSelectRolePage;
  public recordingCallPage: CvpRecordingCallPage;

  constructor(page: Page) {
    this.page = page;
    this.signInPage = new CvpSignInPage(this.page);
    this.roomSettingsPage = new CvpRoomSettingsPage(this.page);
    this.conferencePage = new CvpConferencePage(this.page);
    this.selectRolePage = new CvpSelectRolePage(this.page);
    this.recordingCallPage = new CvpRecordingCallPage(this.page);
  }

  /**
   * Creates a new CvpPages instance bound to another browser context or tab.
   * Allows multi-tab testing.
   */
  public async newBrowserContext(options: { pageContext: Page }): Promise<CvpPages> {
    return new CvpPages(options.pageContext);
  }
}
