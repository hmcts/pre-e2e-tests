import { Locator, expect } from '@playwright/test';
import { config } from '../../../utils';
import { CvpBase } from '../cvp-base';

export class CvpConferencePage extends CvpBase {
  public readonly $interactive = {
    settingsButton: this.page.getByRole('button', { name: 'Settings' }),
    connectButton: this.page.getByRole('button', { name: 'Connect' }),
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    conferenceAddress: this.page.getByRole('textbox', { name: 'Conference address' }),
    name: this.page.getByRole('textbox', { name: 'Your name' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    conferenceAddressText: this.page.getByText('Conference address'),
  } as const satisfies Record<string, Locator>;

  public readonly $settingsModal = {
    settingsModalHeading: this.page.getByRole('heading', { name: 'Settings' }),
    connectButton: this.page.locator('#connectFromDeviceModalButton'),
  } as const satisfies Record<string, Locator>;

  public async goTo(): Promise<void> {
    await this.page.goto(config.urls.cvpConferenceUrl);
  }

  public async verifyUserIsOnCvpConferencePage(): Promise<void> {
    await expect(this.$static.conferenceAddressText).toBeVisible({ timeout: 30000 });
  }

  /**
   * Connects to a CVP conference by filling in the conference address and user name,
   * clicking the connect button, and confirming connection in the settings modal.
   * Waits for the modal heading to appear before finalizing the connection.
   * @param conferenceAddress - The address of the conference to connect to.
   * @param name - The name to use for the conference connection.
   */
  public async connectToConference(conferenceAddress: string, name: string): Promise<void> {
    await this.$inputs.conferenceAddress.fill(conferenceAddress);
    await expect(this.$inputs.conferenceAddress).toHaveValue(conferenceAddress);
    await this.$inputs.name.fill(name);
    await expect(this.$inputs.name).toHaveValue(name);

    await this.$interactive.connectButton.click();
    await expect(this.$settingsModal.settingsModalHeading).toBeVisible();
    await this.$settingsModal.connectButton.click();
  }
}
