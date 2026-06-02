/* eslint-disable playwright/no-skipped-test */
import { test, expect } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify the case details page UI is visually correct', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeAll(async ({ headless }) => {
    test.skip(!headless, 'Skipping visual tests in headed mode');
  });

  test.beforeEach(async ({ navigateToPowerAppCaseDetailsPage }) => {
    await navigateToPowerAppCaseDetailsPage();
  });

  test(
    'Verify when accessing case details page, it is visually correct',
    {
      tag: ['@visual'],
    },
    async ({ page, powerAppPages }) => {
      const maskedElements = [
        powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
      ];

      await test.step('Verify upon accessing case details page, it is visually correct', async () => {
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(async () => {
          await expect(page).toHaveScreenshot('case-details-page-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify error message is visualy correct when trying to create a case with null values',
    {
      tag: ['@visual'],
    },
    async ({ page, powerAppPages }) => {
      const maskedElements = [
        powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
      ];

      await test.step('Attempt to create a case with null values', async () => {
        await powerAppPages.caseDetailsPage.$interactive.saveButton.click();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.modalWindow).toBeVisible();
      });

      await test.step('Verify error message is visually correct', async () => {
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));
        await expect(async () => {
          await expect(page).toHaveScreenshot('case-details-page-error-validation-modal-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify when searching for a case, it is visually correct',
    {
      tag: ['@visual'],
    },
    async ({ page, powerAppPages }) => {
      await test.step('Pre-requisite step in order to begin searching for a case', async () => {
        await powerAppPages.caseDetailsPage.$inputs.caseReference.fill('PR-');
        await expect(powerAppPages.caseDetailsPage.$inputs.caseReference).toHaveValue('PR-');
      });

      await test.step('Verify UI is visually correct when searching for a case', async () => {
        const maskedElements = [
          powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
          powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
          powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
          powerAppPages.caseDetailsPage.$maskedlocatorsForVisualTesting.searchResultExistingCaseContainer,
        ];

        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(async () => {
          await expect(page).toHaveScreenshot('case-details-page-search-for-case-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify when selecting an existing case, it is visually correct',
    {
      tag: ['@visual'],
    },
    async ({ page, powerAppPages, apiClient }) => {
      await test.step('Pre-requisite step in order to create a new case to search and select', async () => {
        const caseDetails = await apiClient.createCase(2, 2);
        await powerAppPages.caseDetailsPage.searchAndSelectExistingCase(caseDetails.caseReference);
      });

      await test.step('Verify UI is visually correct once an existing case has been selected', async () => {
        const maskedElements = [
          powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
          powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
          powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
          powerAppPages.caseDetailsPage.$static.searchResultExistingCaseReference,
          powerAppPages.caseDetailsPage.$static.selectedExistingCaseReferenceLabel,
          powerAppPages.caseDetailsPage.$inputs.defendants,
          powerAppPages.caseDetailsPage.$inputs.witnesses,
        ];

        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        // Added the following click to ensure focus is removed from any given element
        await page.click('body');

        await expect(async () => {
          await expect(page).toHaveScreenshot('case-details-page-selected-existing-case-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify once option to close case has been selected, it is visually correct',
    {
      tag: ['@visual'],
    },
    async ({ page, powerAppPages, apiClient, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to create a new case to search and select', async () => {
        const caseDetails = await apiClient.createCase(2, 2);
        await powerAppPages.caseDetailsPage.searchAndSelectExistingCase(caseDetails.caseReference);
      });

      const sharedMaskedElements = [
        powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
        powerAppPages.caseDetailsPage.$static.selectedExistingCaseReferenceLabel,
      ];

      /* 
      The following elements are hidden oppose to using playwrights masking feature becase
      the elements overlap with the modal that appears when closing a case.
      This is a workaround to ensure the modal is visible in the screenshot.
      */
      const elementsToHide = [powerAppPages.caseDetailsPage.$inputs.defendants, powerAppPages.caseDetailsPage.$inputs.witnesses];
      await userInterfaceUtils.hideElements(elementsToHide);

      await test.step('Verify UI is visually correct once close case button has been selected', async () => {
        await powerAppPages.caseDetailsPage.$interactive.selectedCaseCloseButton.click();
        await expect(powerAppPages.caseDetailsPage.$closeCaseModal.closeCaseModalWindow).toBeVisible();
        const testStepMaskedElement = powerAppPages.caseDetailsPage.$closeCaseModal.datePicker;

        const maskedElements = [...sharedMaskedElements, testStepMaskedElement];
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('case-details-page-close-case-modal-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });

      await test.step('Verify UI is visualy correct once save option in close case modal has been selected', async () => {
        await powerAppPages.caseDetailsPage.$closeCaseModal.saveButton.click();
        await expect(powerAppPages.caseDetailsPage.$closeCaseModal.yesButton).toBeVisible();

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('case-details-page-select-save-option-in-close-case-modal-visual.png', {
              mask: sharedMaskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });

      await test.step('Verify UI is visualy correct once yes option in close case modal has been selected', async () => {
        await powerAppPages.caseDetailsPage.$closeCaseModal.yesButton.click();
        await expect(powerAppPages.caseDetailsPage.$closeCaseModal.closeCaseModalWindow).toBeHidden();

        const testStepMaskedElements = [
          powerAppPages.caseDetailsPage.$static.closedCaseStatusInfo,
          powerAppPages.caseDetailsPage.$static.searchResultExistingCaseReference,
        ];
        const maskedElements = [...sharedMaskedElements, ...testStepMaskedElements];

        await Promise.all(testStepMaskedElements.map((element) => expect(element).toBeAttached()));

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('case-details-page-select-yes-option-in-close-case-modal-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify when selecting option to cancel closure of an existing case, it is visually correct',
    {
      tag: ['@visual'],
    },
    async ({ page, powerAppPages, apiClient, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to set a newly created case to status pending closure', async () => {
        const caseDetails = await apiClient.createCase(2, 2);
        await powerAppPages.caseDetailsPage.searchAndSelectExistingCase(caseDetails.caseReference);
        await powerAppPages.caseDetailsPage.setCaseToPendingClosure();
      });

      const maskedElements = [
        powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
        powerAppPages.caseDetailsPage.$static.selectedExistingCaseReferenceLabel,
      ];
      await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

      /* 
      The following elements are hidden oppose to using playwrights masking feature becase
      the elements overlap with the modal that appears when cancelling closure of case.
      This is a workaround to ensure the modal is visible in the screenshot.
      */
      const elementsToHide = [powerAppPages.caseDetailsPage.$inputs.defendants, powerAppPages.caseDetailsPage.$inputs.witnesses];
      await userInterfaceUtils.hideElements(elementsToHide);

      await test.step('Verify UI is visually correct once cancel button for case that is pending closure has been selected', async () => {
        const caseData = await apiClient.getCaseData();
        await powerAppPages.caseDetailsPage.$interactive.selectedCaseCancelPendingClosureButton.click();
        await expect(powerAppPages.caseDetailsPage.$cancelClosureOfCaseModal.cancelClosureOfCaseModalWindow).toBeVisible();

        // Replace dynamic text in the modal with placeholders for visual testing
        const dynamicTextArea = powerAppPages.caseDetailsPage.$cancelClosureOfCaseModal.modalTextArea;
        await userInterfaceUtils.replaceTextWithinInput(dynamicTextArea, [
          [caseData.caseReference, '{masked-visual}'],
          [/\d{2}\/\d{2}\/\d{4}/, '{masked-visual}'],
        ]);

        await expect(async () => {
          await expect(page).toHaveScreenshot('case-details-page-cancel-closure-of-case-modal-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify when selecting option to modify an existing case, it is visually correct',
    {
      tag: ['@visual'],
    },
    async ({ page, powerAppPages, apiClient, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to setup a new case and search/select the new case', async () => {
        const caseDetails = await apiClient.createCase(1, 1);
        await powerAppPages.caseDetailsPage.searchAndSelectExistingCase(caseDetails.caseReference);
      });

      const sharedMaskedElements = [
        powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        powerAppPages.caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
      ];

      await test.step('Verify UI is visually correct once user has selected option to modify case', async () => {
        await powerAppPages.caseDetailsPage.$interactive.modifyButton.click();

        const testStepMaskedElement = [
          powerAppPages.caseDetailsPage.$static.modifyCaseReferenceText,
          powerAppPages.caseDetailsPage.$static.modifyCaseParticipantFullNameText,
        ];
        const maskedElements = [...sharedMaskedElements, ...testStepMaskedElement];

        await Promise.all(maskedElements.map((element) => expect(element.first()).toBeAttached()));

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('case-details-page-modify-case-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });

      await test.step('Verify UI is visually correct once user has selected option to modify case reference', async () => {
        await powerAppPages.caseDetailsPage.$interactive.modifyCaseAmendCaseReferenceButton.click();
        await expect(powerAppPages.caseDetailsPage.$interactive.modifyCaseAmendCaseReferenceButton).toBeHidden();

        const testStepMaskedElement = [
          powerAppPages.caseDetailsPage.$static.modifyCaseParticipantFullNameText,
          powerAppPages.caseDetailsPage.$inputs.modifyCaseAmendCaseReferenceInput,
        ];
        const maskedElements = [...sharedMaskedElements, ...testStepMaskedElement];

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('case-details-page-modify-case-reference-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });

        await powerAppPages.caseDetailsPage.$interactive.modifyCaseCancelAmendmentOfCaseReferenceButton.click();
        await expect(powerAppPages.caseDetailsPage.$interactive.modifyCaseCancelAmendmentOfCaseReferenceButton).toBeHidden();
      });

      await test.step('Hide participant full names so that they do not appear in screenshots for the remaining test steps', async () => {
        // This step has been added because masking the participant full names overlaps with the modal that appears when adding or modifying participants.
        await userInterfaceUtils.hideElements(powerAppPages.caseDetailsPage.$static.modifyCaseParticipantFullNameText);
      });

      await test.step('Verify UI is visually correct once user has selected option to add new participant', async () => {
        await powerAppPages.caseDetailsPage.$interactive.modifyCaseAddNewParticipantButton.click();
        await expect(powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.ModalWindow).toBeVisible();

        const testStepMaskedElement = powerAppPages.caseDetailsPage.$static.modifyCaseReferenceText;
        const maskedElements = [...sharedMaskedElements, testStepMaskedElement];

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('case-details-page-modify-case-add-new-participant-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });

        await powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.cancelButton.click();
        await expect(powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.ModalWindow).toBeHidden();
      });

      await test.step('Verify UI is visually correct once user has selected option to amend existing witness', async () => {
        const caseData = await apiClient.getCaseData();
        await powerAppPages.caseDetailsPage.$modifyCaseSelectOptionToAmendParticipant(caseData.witnessNames[0]);

        const testStepMaskedElement = [
          powerAppPages.caseDetailsPage.$static.modifyCaseReferenceText,
          powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.firstNameInput,
        ];
        const maskedElements = [...sharedMaskedElements, ...testStepMaskedElement];

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('case-details-page-modify-case-amend-existing-witness-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });

        await powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.cancelButton.click();
        await expect(powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.ModalWindow).toBeHidden();
      });

      await test.step('Verify UI is visually correct once user has selected option to amend existing defendant', async () => {
        const caseData = await apiClient.getCaseData();
        await powerAppPages.caseDetailsPage.$modifyCaseSelectOptionToAmendParticipant(caseData.defendantNames[0]);

        const testStepMaskedElement = [
          powerAppPages.caseDetailsPage.$static.modifyCaseReferenceText,
          powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.firstNameInput,
          powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.lastNameInput,
        ];
        const maskedElements = [...sharedMaskedElements, ...testStepMaskedElement];

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('case-details-page-modify-case-amend-existing-defendant-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );
});
