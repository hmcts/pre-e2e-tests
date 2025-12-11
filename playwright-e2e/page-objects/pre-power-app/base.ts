import { Page, FrameLocator, Locator } from '@playwright/test';
import { UserInterfaceUtils } from '../../utils';

// A base page inherited by pages & components
// can contain any additional config needed + instantiated page object
export abstract class Base {
  public readonly iFrame: FrameLocator = this.page.frameLocator('#fullscreen-app-host');
  private userInterfaceUtils = new UserInterfaceUtils(this.page);
  constructor(public readonly page: Page) {}

  public readonly $globalMaskedlocatorsForVisualTesting = {
    powerAppsHeaderContainer: this.page.locator('[id*="HeaderContainer"]'),
    applicationCourtTitle: this.iFrame.locator('[data-control-name="HeaderCourtTitle"]'),
    applicationEnvironment: this.iFrame.locator('[data-control-name="HeaderEnvLabel"]'),
  } as const satisfies Record<string, Locator>;

  public async navigationClick(elementTOClick: Locator): Promise<void> {
    await this.userInterfaceUtils.navigationClick(elementTOClick);
  }
}
