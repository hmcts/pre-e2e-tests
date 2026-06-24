import { Locator } from '@playwright/test';
import { UserInterfaceUtils } from '../../utils/userInterface.utils';
import { Base } from '../base-page';

// A base page inherited by pages & components
// can contain any additional config needed + instantiated page object
export abstract class PrePortalBase extends Base {
  private userInterfaceUtils = new UserInterfaceUtils(this.page);

  public async navigationClick(elementTOClick: Locator): Promise<void> {
    await this.userInterfaceUtils.navigationClick(elementTOClick);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(1000);
  }
}
