import { Page, Locator, expect } from '@playwright/test';
import { PowerAppBase } from '../../power-app-base';

export class PowerAppViewLiveFeedPage extends PowerAppBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    startRecordingButton: this.iFrame.getByRole('button', { name: 'Start Recording' }),
    finishRecordingButton: this.iFrame.getByRole('button', { name: 'Finish' }),
    showLinkButton: this.iFrame.getByRole('button', { name: 'Show Link' }),
    backButton: this.iFrame.locator('[data-control-name="recordedFeedScrn_Back_Btn_1"] button'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.iFrame.locator('[data-control-name*="HeaderText"]').filter({ hasText: 'Livestream Viewer' }),
    notRecordingText: this.iFrame.locator('[data-control-name="App_LiveStreamOverlay_Cmp_1"] [data-control-part="text"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $startRecordingModal = {
    recordingLinkIsBeingGeneratedText: this.iFrame.getByText('A link will be generated.'),
    recordingLinkGeneratedText: this.iFrame.locator('[data-control-name="CVPPromptGrpRdyToRecordLbl_Input"] textarea'),
    recordingLinkIsBeingGeneratedSpinner: this.iFrame.locator('[data-control-name="RTMPSSpinner"]'),
    generatedRtmpsLink: this.iFrame.locator('[data-control-name*="CVPRTMPUrlTxt"] textarea'),
    dontForgetToStartRecordingText: this.iFrame.locator('[data-control-name*="DontForgetToPressRecordLbl"] [class="appmagic-label-text"]'),
    copyLinkButton: this.iFrame.getByRole('button', { name: 'Copy Link' }),
    closeButton: this.iFrame.getByRole('button', { name: 'Close' }),
  } as const satisfies Record<string, Locator>;

  public readonly $finishRecordingModal = {
    finishRecordingText: this.iFrame.locator('[data-control-name="FinishRecordingTextInputLbl"]'),
    yesButton: this.iFrame.getByRole('button', { name: 'Yes' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnViewLiveFeedPage(): Promise<void> {
    await expect(this.$static.pageHeading).toBeVisible({ timeout: 15000 });
  }

  /**
   * Starts the recording by clicking the "Start Recording" button, waits for the RTMPS link modal to appear,
   * verifies the link is generated, captures the RTMPS link value, and closes the modal.
   * Throws an error if the RTMPS link is empty.
   * @returns The generated RTMPS link as a trimmed string.
   */
  public async startRecordingAndCaptureRtmpsLink(): Promise<string> {
    await this.selectStartRecordingButton();

    await expect(this.$startRecordingModal.recordingLinkIsBeingGeneratedText).toBeVisible();
    // await expect(this.$startRecordingModal.recordingLinkGeneratedText).toBeVisible({ timeout: 90_000 });
    await expect(this.$startRecordingModal.recordingLinkIsBeingGeneratedSpinner).toBeHidden({ timeout: 90_000 });
    await expect(this.$startRecordingModal.generatedRtmpsLink).toBeVisible({ timeout: 90_000 });
    await expect(this.$startRecordingModal.copyLinkButton).toBeVisible({ timeout: 90_000 });

    let rtmpsLinkValue = '';
    await expect
      .poll(
        async () => {
          rtmpsLinkValue = (await this.$startRecordingModal.generatedRtmpsLink.inputValue()).trim();
          return rtmpsLinkValue;
        },
        { timeout: 90_000, intervals: [1000, 2000, 3000] },
      )
      .toContain('rtmps://');

    await this.$startRecordingModal.copyLinkButton.click();

    await this.selectCloseButtonToDismissStartRecordingModal();
    return rtmpsLinkValue;
  }

  /**
   * Selects the "Start Recording" button and waits for the RTMPS window to be visible.
   * This is done to ensure that the recording process is initiated correctly.
   */
  public async selectStartRecordingButton(): Promise<void> {
    await expect(async () => {
      await this.$interactive.startRecordingButton.click();
      await expect(this.iFrame.locator('[data-control-name="RTMPSWindow"]')).toBeVisible();
    }).toPass({ intervals: [3000], timeout: 12_000 });
  }

  public async copyLinkButton(): Promise<void> {
    await expect(async () => {
      await this.$startRecordingModal.copyLinkButton.click();
      await expect(this.$startRecordingModal.generatedRtmpsLink).toBeVisible();
    }).toPass({ intervals: [3000], timeout: 12_000 });
  }

  /**
   * Selects the "Close" button to dismiss the start recording modal and waits for the modal to be hidden.
   * This is done to ensure that the modal is closed properly after starting the recording.
   */
  public async selectCloseButtonToDismissStartRecordingModal(): Promise<void> {
    await expect(async () => {
      await this.$startRecordingModal.closeButton.click();
      await expect(this.iFrame.locator('[data-control-name*="CVPPrompt"]').first()).toBeHidden();
    }).toPass({ intervals: [3000], timeout: 12_000 });
  }

  /**
   * Finishes the recording by clicking the "Finish" button,
   * confirming the action in the modal, and clicking "Yes" to complete.
   */
  public async finishRecording(): Promise<void> {
    await this.$interactive.finishRecordingButton.click();
    await expect(this.$finishRecordingModal.finishRecordingText).toBeVisible();
    await this.navigationClick(this.$finishRecordingModal.yesButton);
  }
}
