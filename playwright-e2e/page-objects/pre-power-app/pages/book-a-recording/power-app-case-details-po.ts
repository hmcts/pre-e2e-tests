import { Page, Locator, expect } from '@playwright/test';
import { PowerAppBase } from '../../power-app-base';
import { BaseCaseDetails } from '../../../../types';

export class PowerAppCaseDetailsPage extends PowerAppBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    caseReference: this.iFrame.getByRole('textbox', { name: 'Enter Case' }),
    defendants: this.iFrame.getByRole('textbox', { name: 'Enter your Defendants' }),
    witnesses: this.iFrame.getByRole('textbox', { name: 'Enter your Witnesses' }),
    modifyCaseAmendCaseReferenceInput: this.iFrame.locator('[appmagic-control="bookingScrn_ManageCaseReference_Txttextbox"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    modifyButton: this.iFrame.getByRole('button', { name: 'Modify' }),
    saveButton: this.iFrame.getByRole('button', { name: 'Save' }),
    bookingsButton: this.iFrame.getByRole('button', { name: 'Bookings' }),
    validationErrorCloseButton: this.iFrame.getByRole('button', { name: 'Close' }),
    existingCaseFoundButtonInSearchList: this.iFrame
      .locator('[data-control-name="bookingScrn_ExistingCasesGallery_Gal"]')
      .locator('[data-control-part="gallery-item"]'),
    selectedCaseCloseButton: this.iFrame.getByRole('button', { name: 'Close Case' }),
    selectedCaseCancelPendingClosureButton: this.iFrame.getByRole('button', { name: 'Cancel' }),
    modifyCaseAddNewParticipantButton: this.iFrame.locator('[data-control-name="bookingScrn_ParticipantInputAdd_Icn"]'),
    modifyCaseAmendCaseReferenceButton: this.iFrame.locator('[data-control-name="bookingScrn_ManageCaseEdit_Icn"]'),
    modifyCaseCancelAmendmentOfCaseReferenceButton: this.iFrame.locator('[data-control-name="bookingScrn_ManageCaseCancel_Icn"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.iFrame.getByRole('heading', { name: 'Case Details' }),
    saveCaseSuccessLogo: this.iFrame.locator('[data-control-name*="SaveConfirmationCheck"]'),
    saveCaseSuccessText: this.iFrame.getByText('Case Opened', { exact: true }),
    searchResultExistingCasesTitle: this.iFrame.locator('[data-control-name="bookingScrn_ExistingCasesTitle_Txt"]'),
    searchResultExistingCaseReference: this.iFrame.locator('[data-control-name="bookingScrn_ExistingCasesReference_Lbl"]'),
    searchResultExistingCaseStatus: this.iFrame.locator('[data-control-name="bookingScrn_ExistingCasesCourt_Lbl"]'),
    searchResultExistingCaseSource: this.iFrame.locator('[data-control-name="bookingScrn_ExistingCasesSource_Lbl_1"]'),
    selectedExistingCaseReferenceLabel: this.iFrame.locator('[data-control-name="bookingScrn_SelectedReference_Lbl"]'),
    selectedExisitingCaseSourceLabel: this.iFrame.locator('[data-control-name="bookingScrn_ClosureStatusLabel_Lbl_2"]'),
    selectedExisitingCaseStatusLabel: this.iFrame.locator('[data-control-name="bookingScrn_ClosureStatus_Lbl"]'),
    closedCaseStatusInfo: this.iFrame.locator('[data-control-name="bookingScrn_ClosureStatusInfo_Lbl"]'),
    modifyCaseReferenceText: this.iFrame.locator('[data-control-name="bookingScrn_ManageCaseReference_Txt"]'),
    modifyCaseParticipantFullNameText: this.iFrame.locator('[data-control-name="bookingScrn_ManageCaseParticipantGalleryName_Txt"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $maskedlocatorsForVisualTesting = {
    searchResultExistingCaseContainer: this.iFrame.locator('[aria-label="Existing Cases"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $validationErrorModal = {
    modalWindow: this.iFrame.locator('[data-control-name="ErrorWindow"]'),
    heading: this.iFrame.locator("div[appmagic-control*='errorLabel']"),
    text: this.iFrame.locator('[data-control-name="ErrorMessage"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $closeCaseModal = {
    closeCaseModalWindow: this.iFrame.locator('[data-control-name="CloseCaseWindow"]'),
    datePicker: this.iFrame.getByPlaceholder('Date'),
    saveButton: this.iFrame.locator('[data-control-name="CloseCaseSaveBtn"]'),
    yesButton: this.iFrame.getByRole('button', { name: 'Yes' }),
    noButton: this.iFrame.getByRole('button', { name: 'No' }),
  } as const satisfies Record<string, Locator>;

  public readonly $cancelClosureOfCaseModal = {
    cancelClosureOfCaseModalWindow: this.iFrame.locator('[data-control-name="CancelCaseClosureWindow"]'),
    modalTextArea: this.iFrame.locator('[appmagic-control="CancelCaseClosureBodyInputtextarea"]'),
    yesButton: this.iFrame.getByRole('button', { name: 'Yes' }),
  } as const satisfies Record<string, Locator>;

  public readonly $modifyCaseAmendOrAddNewParticipantModal = {
    ModalWindow: this.iFrame.locator('[data-control-name="ParImpWindow"]'),
    firstNameInput: this.iFrame.getByRole('textbox', { name: 'First Name' }),
    lastNameInput: this.iFrame.getByRole('textbox', { name: 'Last Name' }),
    submitButton: this.iFrame.getByRole('button', { name: 'Submit' }),
    cancelButton: this.iFrame.getByRole('button', { name: 'Cancel' }),
  } as const satisfies Record<string, Locator>;

  /**
   * Selects the option to amend the name of a participant in the case.
   * @param nameOfParticipantToAmend - The name of the participant whose details need to be amended.
   * This method locates the participant in the gallery, clicks the edit button, and verifies the amendment modal is visible.
   */
  public async $modifyCaseSelectOptionToAmendParticipant(nameOfParticipantToAmend: string): Promise<void> {
    const modifyParticipantButton = this.iFrame
      .locator('[data-control-name="bookingScrn_ManageCaseParticipantGallery_Gal"]')
      .locator('[data-control-part="gallery-item"]')
      .filter({ hasText: nameOfParticipantToAmend })
      .locator('[data-control-name="bookingScrn_ManageCaseParticipantGalleryEdit_Icn"]');

    await modifyParticipantButton.click();
    await expect(this.$modifyCaseAmendOrAddNewParticipantModal.ModalWindow).toBeVisible();
  }

  public async verifyUserIsOnCaseDetailsPage(): Promise<void> {
    await expect(this.$static.pageHeading).toBeVisible({ timeout: 15000 });
    await expect(this.$static.pageHeading).toHaveText('Case Details');
  }

  /**
   * Populates the case details form with the provided details.
   * @param details - An object containing case reference, defendants, and witnesses.
   */
  public async populateCaseDetails(details: BaseCaseDetails): Promise<void> {
    await this.$inputs.caseReference.fill(details.caseReference);
    await this.$inputs.defendants.fill(details.defendantNames.join(', '));
    await this.$inputs.witnesses.fill(details.witnessNames.join(', '));
  }

  /**
   * Searches for an existing case by its reference and selects it.
   * @param caseReference - Reference of the case to search for.
   * Verifies the case reference provided has been selected.
   */
  public async searchAndSelectExistingCase(caseReference: string): Promise<void> {
    const locator = this.iFrame.getByRole('button', { name: `Case reference ${caseReference}` });

    await this.$inputs.caseReference.fill(caseReference);
    await expect(locator).toBeVisible();
    await locator.click();
    await expect(this.iFrame.locator('[data-control-name*="SelectedReference_Lbl"]').filter({ hasText: caseReference })).toBeVisible();
  }

  /**
   * Sets the current case to pending closure.
   * Clicks the "Close Case" button, confirms the modal, and waits for the modal to close.
   * Verifies the case status is updated to "Pending Closure".
   * This simulates the user flow for marking a case as pending closure.
   * Before using this method, ensure the case is already selected.
   */
  public async setCaseToPendingClosure(): Promise<void> {
    await this.$interactive.selectedCaseCloseButton.click();
    await expect(this.$closeCaseModal.closeCaseModalWindow).toBeVisible();
    await this.$closeCaseModal.saveButton.click();
    await expect(this.$closeCaseModal.yesButton).toBeVisible();
    await this.$closeCaseModal.yesButton.click();
    await expect(this.$closeCaseModal.closeCaseModalWindow).toBeHidden();
    await expect(this.$static.selectedExisitingCaseStatusLabel).toHaveText('Pending Closure');
  }
}
