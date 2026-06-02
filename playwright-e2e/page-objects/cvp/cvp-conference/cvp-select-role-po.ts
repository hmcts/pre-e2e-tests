import { Locator, expect } from '@playwright/test';
import { CvpBase } from '../cvp-base';

export class CvpSelectRolePage extends CvpBase {
  public readonly $interactive = {
    cancelButton: this.page.getByRole('button', { name: 'Cancel' }),
    connectButton: this.page.getByRole('button', { name: 'Connect' }),
    hostRadioButton: this.page.getByText('Host'),
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    hostPin: this.page.getByRole('textbox', { name: 'Host PIN' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    selectRoleText: this.page.getByText('Select your role'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnCvpSelectRolePage(): Promise<void> {
    await expect(this.$static.selectRoleText).toBeVisible({ timeout: 15000 });
  }

  /**
   * Connects as a host by selecting the host radio button, entering the provided host PIN,
   * verifying the PIN input value, and clicking the connect button.
   * @param hostPin - The host PIN to use for connection.
   */
  public async connectAsHost(hostPin: string): Promise<void> {
    await this.$interactive.hostRadioButton.click();
    await this.$inputs.hostPin.fill(hostPin);
    await expect(this.$inputs.hostPin).toHaveValue(hostPin);
    await this.$interactive.connectButton.click();
  }
}
