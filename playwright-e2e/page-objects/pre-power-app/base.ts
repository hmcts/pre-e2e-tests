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

  public async navigationClick(elementTOClick: Locator, verifyLocatorIsVisible?: Locator): Promise<void> {
    await this.userInterfaceUtils.navigationClick(elementTOClick, verifyLocatorIsVisible);
  }
  public async navigationClickAndWaitForElementToDisappear(elementToClickOn: Locator, elementToDisappear: Locator): Promise<void> {
    await this.userInterfaceUtils.navigationClick(elementToClickOn);
    await this.userInterfaceUtils.navigationClick(elementToClickOn, elementToDisappear);
  }

  public async clickAndWaitForElementToDisappear(elementToClickOn: Locator, elementToDisappear: Locator): Promise<void> {
    await this.userInterfaceUtils.navigationClick(elementToClickOn, elementToDisappear);
  }

  public async hideElements(elementToHide: Locator | Locator[]): Promise<void> {
    await this.userInterfaceUtils.hideElements(elementToHide);
  }
  public async replaceTextWithinInput(locator: Locator, replacements: Array<[string | RegExp, string]>): Promise<void> {
    await this.userInterfaceUtils.replaceTextWithinInput(locator, replacements);
  }
  public async replaceTextWithinStaticElement(locator: Locator, replacements: Array<[string | RegExp, string]>): Promise<void> {
    await this.userInterfaceUtils.replaceTextWithinStaticElement(locator, replacements);
  }
  public async clickAndWaitForElementToAppear(elementToClickOn: Locator, elementToAppear: Locator): Promise<void> {
    await this.userInterfaceUtils.clickAndWaitForElementToAppear(elementToClickOn, elementToAppear);
  }
}
