import { Page, Locator, expect } from '@playwright/test';
import { PowerAppBase } from '../../power-app-base';
import { DateTime } from 'luxon';

export class PowerAppManageBookingsPage extends PowerAppBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    caseReference: this.iFrame.getByRole('textbox', { name: 'Search Case Reference' }),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    refreshResultsButton: this.iFrame.getByRole('button', { name: 'Refresh Data' }),
    manageButton: this.iFrame.locator('[data-control-name="manageBookingScrn_Manage_Btn"] button'),
    amendButton: this.iFrame.locator('[data-control-name="manageBookingScrn_Amend_Btn"] button'),
    recordButton: this.iFrame.locator('[data-control-name="manageBookingScrn_Record_Btn"] button'),
    datePicker: this.iFrame.locator('[data-control-name="manageBookingScrn_BookingDate_Dte"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.iFrame.locator('[data-control-name="manageBookingScrn_BookedSrchRef_Lbl"]').filter({ hasText: 'Case Reference' }),
    searchResultGallery: this.iFrame.locator('[data-control-name="manageBookingScrn_Recordings_Gal"]'),
    listItemsInSearchResultsGallery: this.iFrame.locator('[data-control-name="manageBookingScrn_Recordings_Gal"]').locator('[role="listitem"]'),
    caseReferenceLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_CaseRef_Lbl"]'),
    witnessLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_Witness_Lbl"]'),
    defendantLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_Defendants_Lbl"]'),
    scheduledDateLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_RecDate_Lbl"]'),
    caseActionsStatusLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_Status_Lbl"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $datePickerModal = {
    modalWindow: this.iFrame.locator("[id*='datepicker'][id*='popup']"),
    monthOption: this.iFrame.locator("[aria-label='Month']"),
    yearOption: this.iFrame.locator("[aria-label='Year']"),
    okButton: this.iFrame.locator("[class*='datepicker-ok-button']"),
    cancelButton: this.iFrame.locator("[class*='datepicker-cancel-button']"),
  } as const satisfies Record<string, Locator>;

  public readonly $manageCaseModal = {
    modalWindow: this.iFrame.locator('[data-control-name="AdmMngCasesBackgroundIcn_6"]'),
    cancelButton: this.iFrame.locator('[data-control-name="EditReqDetailsBtn_3"] button'),
    shareButton: this.iFrame.locator('[data-control-name="MngRecShareAccessBtn_3"] button'),
    shareWithUsersTitle: this.iFrame.locator('[data-control-name="ShareComboboxLabelInput"] input'),
    shareDropdown: this.iFrame.locator('[data-control-name="MngNewAcsGrpCbx_3"]'),
    auditButton: this.iFrame.locator('[data-control-name="MngRecShareAccessBtn_5"] button'),
    auditCaseInformationText: this.iFrame.locator('[data-control-name="RepInfo-Manage_2"]'),
    auditReportDateLabel: this.iFrame.locator('[data-control-name="RepDte-Manage_2"]'),
    closeAuditButton: this.iFrame.locator('[data-control-name="AudClose-Manage_2"] button'),
    grantAccessButton: this.iFrame.locator('[data-control-name="MngNewAcsGrpClearBtn_3"] button'),
  } as const satisfies Record<string, Locator>;

  public readonly $amendCaseModal = {
    modalWindow: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingWindow_Shp_1"]'),
    caseReferenceText: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingCaseReference_Txt_1"]'),
    witnessDropdown: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingWitness_Cmb_1"]'),
    defendantsDropdown: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingDefendant_Cmb_1"]'),
    dateDropdown: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingDate_Dte_1"]'),
    cancelButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingCancel_Btn_1"] button'),
    yesToCancelButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendCancelConfirm_Btn_1"] button'),
    noToCancelButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendCancelCancel_Btn_1"] button'),
    deleteButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingDelete_Btn_1"] button'),
    deleteCaseText: this.iFrame.locator('[data-control-name="manageBookingsScrn_DeleteScheduleBody_Lbl_2"]'),
    yesToDeleteButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_DeleteScheduleDelete_Btn_2"] button'),
    noToDeleteButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_DeleteScheduleCancel_Btn_2"] button'),
    saveButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingSave_Btn_1"] button'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnManageBookingsPage(): Promise<void> {
    await expect(this.$static.pageHeading).toBeVisible({ timeout: 15000 });
  }

  /**
   * Searches for a booking using the provided case reference.
   * Fills the search input and verifies that the booking with the given reference is visible on the page.
   * @param caseReference - The case reference to search for.
   */
  public async searchForABooking(caseReference: string): Promise<void> {
    await this.$inputs.caseReference.fill(caseReference);
    await expect(this.$inputs.caseReference).toHaveValue(caseReference);

    await expect(async () => {
      await this.refreshResultsUntilASingleCaseReferenceIsReturned();
      await expect(this.$static.caseReferenceLabelInSearchList).toHaveText(caseReference);
    }).toPass({ intervals: [1_000], timeout: 15_000 });
  }

  /**
   * Refreshes the search results until exactly one case reference is returned.
   */
  public async refreshResultsUntilASingleCaseReferenceIsReturned(): Promise<void> {
    const count = await this.$static.listItemsInSearchResultsGallery.count();

    if (count > 1 || count < 1) {
      await this.$interactive.refreshResultsButton.click();
      await expect(this.$static.listItemsInSearchResultsGallery).toHaveCount(1);
    }
  }

  /**
   * Selects a date from the date picker with an optional offset.
   * The offset can be specified in days, months, and years.
   * Positive values move the date forward, while negative values move it backward.
   * If no offset is provided, today's date is selected by default.
   * @param offset - An object containing optional days, months, and years to offset from today.
   */
  public async selectDateFromDatePicker(offset: { days?: number; months?: number; years?: number } = {}): Promise<void> {
    const isDatePickerHidden = await this.$datePickerModal.modalWindow.getAttribute('aria-hidden');
    if (isDatePickerHidden === 'true') {
      await this.$interactive.datePicker.click();
      await expect(this.$datePickerModal.modalWindow).toHaveAttribute('aria-hidden', 'false');
    }

    let date = DateTime.now();

    if (offset.days) {
      date = date.plus({ days: offset.days });
    }
    if (offset.months) {
      date = date.plus({ months: offset.months });
    }
    if (offset.years) {
      date = date.plus({ years: offset.years });
    }

    await this.$datePickerModal.monthOption.selectOption({ index: date.month - 1 });
    await this.$datePickerModal.yearOption.selectOption({ label: date.year.toString() });
    await this.iFrame.locator(`[data-day='${date.day}'] button`).click();
    await this.$datePickerModal.okButton.click();

    await expect(this.$interactive.datePicker.locator('[type="text"]')).toHaveValue(
      `${date.day.toString().padStart(2, '0')}/${date.month.toString().padStart(2, '0')}/${date.year}`,
    );
  }
}
