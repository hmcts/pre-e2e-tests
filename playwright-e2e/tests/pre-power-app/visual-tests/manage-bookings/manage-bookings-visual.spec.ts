/* eslint-disable playwright/no-skipped-test */
import { test, expect } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify the manage bookings page UI is visually correct', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeAll(async ({ headless }) => {
    test.skip(!headless, 'Skipping visual tests in headed mode');
  });

  test.beforeEach(async ({ navigateToPowerAppManageBookingsPage }) => {
    await navigateToPowerAppManageBookingsPage();
  });

  test(
    'Verify manage bookings page is visually correct',
    {
      tag: ['@visual'],
    },
    async ({ page, powerAppPages }) => {
      const maskedElements = [
        powerAppPages.manageBookingsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        powerAppPages.manageBookingsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        powerAppPages.manageBookingsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
        powerAppPages.manageBookingsPage.$static.searchResultGallery,
      ];

      await test.step('Verify manage bookings page is visually correct', async () => {
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(async () => {
          await expect(page).toHaveScreenshot('manage-bookings-page-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify whilst searching for an existing case, the manage bookings page is visually correct',
    {
      tag: ['@visual'],
    },
    async ({ page, powerAppPages, apiClient, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to create a case and assign a booking via api', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
      });

      await test.step('Search for an existing case and redact test data', async () => {
        const caseData = await apiClient.getCaseData();
        const bookingData = await apiClient.getBookingData();
        await powerAppPages.manageBookingsPage.searchForABooking(caseData.caseReference);

        await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.manageBookingsPage.$static.listItemsInSearchResultsGallery, [
          [caseData.caseReference, '{Redacted}'],
          [bookingData.witnessSelectedForCaseRecording, '{Redacted}'],
          [/\b\d{2}\/\d{2}\/\d{4}\b/g, '{Redacted}'],
        ]);

        for (const defendant of caseData.defendantNames) {
          await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.manageBookingsPage.$static.listItemsInSearchResultsGallery, [
            [defendant, '{Redacted}'],
          ]);
        }

        // Added the following click to ensure focus is removed from any given element
        await page.click('body');
      });

      await test.step('Verify manage bookings page is visually correct', async () => {
        const maskedElements = [
          powerAppPages.manageBookingsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
          powerAppPages.manageBookingsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
          powerAppPages.manageBookingsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
          powerAppPages.manageBookingsPage.$inputs.caseReference,
        ];

        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(async () => {
          await expect(page).toHaveScreenshot('manage-bookings-page-search-for-existing-case-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify booking page is visually correct when user selects option to manage an existing booking',
    {
      tag: ['@visual'],
    },
    async ({ page, powerAppPages, apiClient, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to create a case and assign a booking via api', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
      });

      const maskedElements = [
        powerAppPages.manageBookingsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        powerAppPages.manageBookingsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        powerAppPages.manageBookingsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
      ];

      const caseData = await apiClient.getCaseData();
      const bookingData = await apiClient.getBookingData();

      await test.step('Search for an existing case and select option to manage case', async () => {
        await powerAppPages.manageBookingsPage.searchForABooking(caseData.caseReference);
        await powerAppPages.manageBookingsPage.$interactive.manageButton.click();
        await expect(powerAppPages.manageBookingsPage.$manageCaseModal.modalWindow).toBeVisible();
      });

      await test.step('Redact dynamic test data', async () => {
        await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.manageBookingsPage.$static.listItemsInSearchResultsGallery, [
          [caseData.caseReference, '{Redacted}'],
          [bookingData.witnessSelectedForCaseRecording, '{Redacted}'],
        ]);

        await userInterfaceUtils.hideElements(powerAppPages.manageBookingsPage.$inputs.caseReference);
      });

      await test.step('Verify manage booking modal is visually correct', async () => {
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('manage-bookings-page-manage-booking-modal-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });

      await test.step('Select audit option and redact test data', async () => {
        await powerAppPages.manageBookingsPage.$manageCaseModal.auditButton.click();
        await expect(powerAppPages.manageBookingsPage.$manageCaseModal.auditButton).toBeHidden();

        await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.manageBookingsPage.$manageCaseModal.auditCaseInformationText, [
          [caseData.caseReference, '{Redacted}'],
          [/\b\d{2}\/\d{2}\/\d{4}\b/g, '{Redacted}'],
          [bookingData.witnessSelectedForCaseRecording, '{Redacted}'],
        ]);

        for (const defendant of caseData.defendantNames) {
          await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.manageBookingsPage.$manageCaseModal.auditCaseInformationText, [
            [defendant, '{Redacted}'],
          ]);
        }

        await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.manageBookingsPage.$manageCaseModal.auditReportDateLabel, [
          [/\b\d{2}\/\d{2}\/\d{4}\b/g, '{Redacted}'],
        ]);
      });

      await test.step('Verify audit information is visually correct', async () => {
        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('manage-booking-modal-audit-selected-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });

      await test.step('Close audit and select option to share', async () => {
        await powerAppPages.manageBookingsPage.$manageCaseModal.closeAuditButton.click();
        await expect(powerAppPages.manageBookingsPage.$manageCaseModal.closeAuditButton).toBeHidden();
        await powerAppPages.manageBookingsPage.$manageCaseModal.shareButton.click();
        await expect(powerAppPages.manageBookingsPage.$manageCaseModal.shareButton).toBeHidden();
      });

      await test.step('Verify whilst sharing booking, it is visually correct', async () => {
        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('manage-booking-modal-share-option-selected-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify booking page is visually correct when user selects option to amend an existing booking',
    {
      tag: ['@visual'],
    },
    async ({ page, powerAppPages, apiClient, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to create a case and assign a booking via api', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
      });

      const maskedElements = [
        powerAppPages.manageBookingsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        powerAppPages.manageBookingsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        powerAppPages.manageBookingsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
      ];

      const caseData = await apiClient.getCaseData();
      const bookingData = await apiClient.getBookingData();

      await test.step('Search for an existing case and select option to manage case', async () => {
        await powerAppPages.manageBookingsPage.searchForABooking(caseData.caseReference);
        await powerAppPages.manageBookingsPage.$interactive.amendButton.click();
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.modalWindow).toBeVisible();
      });

      await test.step('Redact dynamic test data', async () => {
        await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.manageBookingsPage.$static.listItemsInSearchResultsGallery, [
          [caseData.caseReference, '{Redacted}'],
          [bookingData.witnessSelectedForCaseRecording, '{Redacted}'],
        ]);

        await userInterfaceUtils.hideElements(powerAppPages.manageBookingsPage.$inputs.caseReference);

        await userInterfaceUtils.replaceTextWithinInput(powerAppPages.manageBookingsPage.$amendCaseModal.caseReferenceText.locator('input'), [
          [caseData.caseReference, '{Redacted}'],
        ]);
        await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.manageBookingsPage.$amendCaseModal.witnessDropdown, [
          [bookingData.witnessSelectedForCaseRecording, '{Redacted}'],
        ]);
        for (const defendant of caseData.defendantNames) {
          await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.manageBookingsPage.$amendCaseModal.defendantsDropdown, [
            [defendant, '{Redacted}'],
          ]);
        }
        await userInterfaceUtils.replaceTextWithinInput(powerAppPages.manageBookingsPage.$amendCaseModal.dateDropdown.locator('input'), [
          [/\b\d{2}\/\d{2}\/\d{4}\b/g, '01/01/0001'],
        ]);
      });

      await test.step('Verify amend booking modal is visually correct', async () => {
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('manage-bookings-page-amend-booking-modal-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });

      await test.step('Select option to delete case and redact dynamic test data', async () => {
        await powerAppPages.manageBookingsPage.$amendCaseModal.deleteButton.click();
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.deleteCaseText).toBeVisible();

        await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.manageBookingsPage.$amendCaseModal.deleteCaseText, [
          [caseData.caseReference, '{Redacted}'],
          [/\b\d{2}\/\d{2}\/\d{4}\b/g, '01/01/0001'],
          [bookingData.witnessSelectedForCaseRecording, '{Redacted}'],
        ]);

        for (const defendant of caseData.defendantNames) {
          await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.manageBookingsPage.$amendCaseModal.deleteCaseText, [
            [defendant, '{Redacted}'],
          ]);
        }
      });

      await test.step('Upon selecting option to delete case, verify amend booking modal is visually correct', async () => {
        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('amend-booking-modal-delete-option-selected-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });

      await test.step('Select option to cancel deletion of case and cancel amendmendts', async () => {
        await powerAppPages.manageBookingsPage.$amendCaseModal.noToDeleteButton.click();
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.noToDeleteButton).toBeHidden();
        await powerAppPages.manageBookingsPage.$amendCaseModal.cancelButton.click();
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.yesToCancelButton).toBeVisible();
      });

      await test.step('Upon selecting option to cancel case amendments, verify amend booking modal is visually correct', async () => {
        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('amend-booking-modal-cancel-amendments-option-selected-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );
});
