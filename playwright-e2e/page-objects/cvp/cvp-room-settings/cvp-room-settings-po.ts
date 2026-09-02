import { Locator, expect } from '@playwright/test';
import { config } from '../../../utils';
import { CvpBase } from '../cvp-base';

export class CvpRoomSettingsPage extends CvpBase {
  public readonly $interactive = {
    selectRoomDropdown: this.page.locator('#roomNameDropdown'),
    editRoomSettingsButton: this.page.getByRole('tab', { name: 'Edit room settings' }),
    saveSettingsButton: this.page.getByRole('button', { name: 'Save' }),
    recordButton: this.page.getByRole('button', { name: 'Record' }),
    endCallButton: this.page.getByRole('button', { name: 'End call' }),
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    rtmpsLinkInput: this.page.getByRole('textbox', { name: 'Recording URI:' }),
  } as const satisfies Record<string, Locator>;

  public async goTo(): Promise<void> {
    await this.page.goto(config.urls.cvpSettingsUrl);
  }

  public async verifyUserIsOnCvpRoomSettingsPage(): Promise<void> {
    await expect(this.$interactive.selectRoomDropdown).toBeAttached({ timeout: 15000 });
    await expect(this.$interactive.selectRoomDropdown).toBeVisible({ timeout: 15000 });
  }

  /**
   * Closes the room settings modal by clicking the "Close" button and waiting for the modal to be hidden.
   * This is a helper method used internally.
   */
  private async closeRoomSettingsModal(): Promise<void> {
    const modalHeading = this.page.getByRole('heading', { name: 'Room settings' });
    await expect(modalHeading).toBeVisible();
    await this.page.getByRole('button', { name: 'Close' }).click();
    await expect(modalHeading).toBeHidden();
  }

  /**
   * Selects a room by its name,
   * @param roomName - The room name to select ('PRE008' or 'PRE009').
   */
  public async selectRoomByName(roomName: 'PRE008' | 'PRE009' = 'PRE009'): Promise<void> {
    await this.page.locator('h2').filter({ hasText: roomName }).click();
    await this.closeRoomSettingsModal();
  }

  /**
   * Edits the room settings by clicking the edit button, clearing and filling the RTMPS link input,
   * verifying the input value, capturing the host PIN, and saving the settings.
   * @param rtmpsLink - The RTMPS link to set in the room settings.
   * @returns The captured host PIN as a string.
   */
  public async editRoomSettings(rtmpsLink: string): Promise<string> {
    await this.$interactive.editRoomSettingsButton.click();

    await expect(this.$inputs.rtmpsLinkInput).toBeVisible();
    await expect(this.$inputs.rtmpsLinkInput).toBeEditable();

    await expect(async () => {
      await this.$inputs.rtmpsLinkInput.clear();
      await this.$inputs.rtmpsLinkInput.fill(rtmpsLink);
      await expect(this.$inputs.rtmpsLinkInput).toHaveValue(rtmpsLink);
    }).toPass({ intervals: [2500], timeout: 10000 });

    const hostPin = await this.captureHostPin();
    await this.$interactive.saveSettingsButton.click();

    return hostPin;
  }

  /**
   * Captures the host PIN by clicking the "Show" button, waiting for the "Hide" button,
   * and reading the value from the host PIN input.
   * @returns The host PIN as a string.
   */
  private async captureHostPin(): Promise<string> {
    await expect(async () => {
      await expect(this.page.getByRole('button', { name: 'Show' })).toBeEnabled();
      await this.page.getByRole('button', { name: 'Show' }).click();
      await expect(this.page.getByRole('button', { name: 'Hide' })).toBeVisible({ timeout: 1000 });
    }).toPass({ intervals: [1500], timeout: 10000 });

    const hostPin = await this.page.getByRole('spinbutton', { name: 'Host PIN:' }).inputValue();
    return hostPin;
  }
  /**
   * Verifies that the "Recording" button is visible on the page.
   */
  public async verifyRecordingButtonIsVisible(): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'Recording' })).toBeVisible({ timeout: 20000 });
  }
}
