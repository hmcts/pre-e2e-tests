import { Locator, expect } from '@playwright/test';
import { UserInterfaceUtils } from '../../utils/userInterface.utils';
import { Base } from '../base-page';

// A base page inherited by pages & components
// can contain any additional config needed + instantiated page object
type headerLinksType = 'Recordings' | 'User Admin' | 'Support' | 'System Status' | 'Management' | 'Sign out';
export abstract class PrePortalBase extends Base {
  private userInterfaceUtils = new UserInterfaceUtils(this.page);

  public async navigationClick(elementTOClick: Locator): Promise<void> {
    await this.userInterfaceUtils.navigationClick(elementTOClick);
  }

  public async selectHeaderLink(link: headerLinksType): Promise<void> {
    const headerLinkToSelect = this.page.getByRole('link', { name: link, exact: true });

    await this.navigationClick(headerLinkToSelect);
  }

  protected async verifyUserIsOnExpectedPage(options: { urlPath: string | string[]; pageHeading?: Locator; timeout?: number }): Promise<void> {
    const timeout = options.timeout ?? 15_000;
    const expectedUrlPaths = Array.isArray(options.urlPath) ? options.urlPath : [options.urlPath];

    await expect(async () => {
      const currentURL = this.page.url();
      const doesUrlMatchAnyExpectedPath = expectedUrlPaths.some((path) => currentURL.includes(path));
      expect(doesUrlMatchAnyExpectedPath, {
        message: `Verify page URL (${currentURL}) contains one of (${expectedUrlPaths.join(', ')})`,
      }).toBeTruthy();
    }).toPass({ intervals: [100], timeout: timeout });

    if (options.pageHeading) {
      await expect(options.pageHeading, { message: `Verify page heading is visible: ${options.pageHeading}` }).toBeVisible({ timeout: timeout });
    }
  }
}
