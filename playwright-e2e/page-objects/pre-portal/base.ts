import { Page, Locator } from '@playwright/test';
import { UserInterfaceUtils } from '../../utils/userInterface.utils';

// A base page inherited by pages & components
// can contain any additional config needed + instantiated page object
export abstract class Base {
  constructor(public readonly page: Page) {}
  private userInterfaceUtils = new UserInterfaceUtils(this.page);

  public async navigationClick(elementTOClick: Locator): Promise<void> {
    await this.userInterfaceUtils.navigationClick(elementTOClick);
  }
}
