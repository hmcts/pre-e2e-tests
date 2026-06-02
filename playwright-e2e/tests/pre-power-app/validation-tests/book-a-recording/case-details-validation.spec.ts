import { test, expect } from '../../../../fixtures';
import { config } from '../../../../utils';
import { faker } from '@faker-js/faker';

test.describe('Set of tests to verify validation of case details page is correct', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppCaseDetailsPage }) => {
    await navigateToPowerAppCaseDetailsPage();
  });

  test(
    'Verify case reference field when left empty shows validation error',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ powerAppPages, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out defendants and wintness fields with valid values', async () => {
        await powerAppPages.caseDetailsPage.$inputs.defendants.fill(dataUtils.generateRandomNames('fullName', 1)[0]);
        await powerAppPages.caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });

      await test.step('Verify error message is displayed once save button has been selected', async () => {
        await powerAppPages.caseDetailsPage.$interactive.saveButton.click();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.heading).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.text).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.text).toHaveText(
          'Please enter a case reference between 9 and 13 characters.',
        );
      });
    },
  );

  test(
    'Verify case reference containing less than 9 characters is rejected',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ powerAppPages, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out defendant and wintness fields with valid values', async () => {
        await powerAppPages.caseDetailsPage.$inputs.defendants.fill(dataUtils.generateRandomNames('fullName', 1)[0]);
        await powerAppPages.caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });

      await test.step('Verify case reference field is rejected when less than 9 characters', async () => {
        for (const length of [0, 8]) {
          const value = faker.string.alphanumeric(length);
          await powerAppPages.caseDetailsPage.$inputs.caseReference.clear();
          await powerAppPages.caseDetailsPage.$inputs.caseReference.fill(value);
          await powerAppPages.caseDetailsPage.$interactive.saveButton.click();

          await expect(powerAppPages.caseDetailsPage.$validationErrorModal.heading).toBeVisible();
          await expect(powerAppPages.caseDetailsPage.$validationErrorModal.text).toBeVisible();
          await expect(powerAppPages.caseDetailsPage.$validationErrorModal.text).toHaveText(
            'Please enter a case reference between 9 and 13 characters.',
          );

          await powerAppPages.caseDetailsPage.$interactive.validationErrorCloseButton.click();
          await expect(powerAppPages.caseDetailsPage.$validationErrorModal.heading).toBeHidden();
        }
      });
    },
  );

  test(
    'Verify case reference field trims values above 13 characters',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ powerAppPages }) => {
      const value = faker.string.alphanumeric(14);

      await test.step('Attempt to enter a case reference of 14 characters', async () => {
        await powerAppPages.caseDetailsPage.$inputs.caseReference.fill(value);
      });

      await test.step('Verify case reference field is trimmed to 13 characters', async () => {
        await expect(powerAppPages.caseDetailsPage.$inputs.caseReference).toHaveValue(value.slice(0, 13));
      });
    },
  );

  test(
    'Verify user is unable to create a dupiclate case using an existing case reference of a case in open status',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ powerAppPages, apiClient, dataUtils }) => {
      await test.step('Pre-requisite step in order to create a case via api', async () => {
        await apiClient.createCase(2, 2);
      });

      const caseData = await apiClient.getCaseData();
      const defendantNames = dataUtils.generateRandomNames('fullName', 1);
      const witnessNames = dataUtils.generateRandomNames('firstName', 1);

      await test.step('Populate case details and click on save button', async () => {
        await powerAppPages.caseDetailsPage.populateCaseDetails({
          caseReference: caseData.caseReference,
          defendantNames: defendantNames,
          witnessNames: witnessNames,
        });

        await powerAppPages.caseDetailsPage.$interactive.saveButton.click();
      });

      await test.step('Verify error message is displayed to state case reference already exists', async () => {
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.heading).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.text).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.text).toHaveText(
          'The case reference you have entered already exists, please navigate to that case or re-enter a new Case Ref.',
        );
      });
    },
  );

  test(
    'Verify user is unable to create a dupiclate case using an existing case reference of a case in deleted status',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ powerAppPages, apiClient, dataUtils }) => {
      test.fail(true, 'To be discussed with BA');

      await test.step('Pre-requisite step in order to create a new case and set it to deleted status via api', async () => {
        const caseData = await apiClient.createCase(2, 2);
        await apiClient.deleteCaseByCaseId(caseData.caseId);
      });

      const caseData = await apiClient.getCaseData();
      const defendantNames = dataUtils.generateRandomNames('fullName', 1);
      const witnessNames = dataUtils.generateRandomNames('firstName', 1);

      await test.step('Populate case details and click on save button', async () => {
        await powerAppPages.caseDetailsPage.populateCaseDetails({
          caseReference: caseData.caseReference,
          defendantNames: defendantNames,
          witnessNames: witnessNames,
        });

        await powerAppPages.caseDetailsPage.$interactive.saveButton.click();
      });

      await test.step('Verify error message is displayed to state case reference already exists', async () => {
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.heading).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.text).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.text).toHaveText(
          'The case reference you have entered already exists, please navigate to that case or re-enter a new Case Ref.',
        );
      });
    },
  );

  test(
    'Verify case reference containing special characters is rejected',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ powerAppPages, dataUtils }) => {
      test.fail(true, 'Known bug - S28-4032 & S28-4031');

      await test.step('Pre-requisite step in order to fill out defendants and wintness fields with valid values', async () => {
        await powerAppPages.caseDetailsPage.$inputs.defendants.fill(dataUtils.generateRandomNames('fullName', 1)[0]);
        await powerAppPages.caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });

      const specialCharacters = Array.from(new Set(';#<>?+_{}@:~=¬`|\\/*&^%$£"!'));

      for (const char of specialCharacters) {
        await test.step(`Validate invalid case reference containing special character '${char}' is rejected`, async () => {
          const invalidValue = faker.string.alphanumeric(12) + char;

          await powerAppPages.caseDetailsPage.$inputs.caseReference.clear();
          await powerAppPages.caseDetailsPage.$inputs.caseReference.fill(invalidValue);
          await powerAppPages.caseDetailsPage.$interactive.saveButton.click();

          const errorTextLocator = powerAppPages.caseDetailsPage.$validationErrorModal.text;
          const headingLocator = powerAppPages.caseDetailsPage.$validationErrorModal.heading;

          await expect(headingLocator).toBeVisible();
          await expect(errorTextLocator).toBeVisible();
          await expect(errorTextLocator).toHaveText('Case reference cannot include special characters: ;#<?>+_{}@:~=¬`|\\/*&^%$£""!');

          await powerAppPages.caseDetailsPage.$interactive.validationErrorCloseButton.click();
          await expect(headingLocator).toBeHidden();
        });
      }
    },
  );

  test(
    'Verify Defendants field when left empty shows validation error',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ powerAppPages, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out case Reference and wintness fields with valid values', async () => {
        await powerAppPages.caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await powerAppPages.caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });

      await test.step('Verify error message is displayed once save button has been selected', async () => {
        await powerAppPages.caseDetailsPage.$interactive.saveButton.click();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.heading).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.text).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.text).toHaveText('Please enter a defendant name into the defendant field.');
      });
    },
  );

  test(
    'Verify Defendants first name or Last name containing more than 25 characters are rejected',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ powerAppPages, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out case Reference and witness fields with valid values', async () => {
        await powerAppPages.caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await powerAppPages.caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });
      const validationErrorHeading = powerAppPages.caseDetailsPage.$validationErrorModal.heading;
      const validationErrorText = powerAppPages.caseDetailsPage.$validationErrorModal.text;

      await test.step('Verify defendants first name containing more than 25 is rejected', async () => {
        const firstName = faker.string.alpha(26);
        const lastName = faker.string.alpha(10);
        await powerAppPages.caseDetailsPage.$inputs.defendants.fill(`${firstName} ${lastName}`);

        await powerAppPages.caseDetailsPage.$interactive.saveButton.click();
        await expect(validationErrorHeading).toBeVisible();
        await expect(validationErrorText).toBeVisible();
        await expect(validationErrorText).toHaveText('Defendant name must be between 1 and 25 characters.');
        await powerAppPages.caseDetailsPage.$interactive.validationErrorCloseButton.click();
        await expect(validationErrorHeading).toBeHidden();
      });
      await test.step('Verify defendants last name containing more than 25 is rejected', async () => {
        const firstName = faker.string.alpha(10);
        const lastName = faker.string.alpha(26);
        await powerAppPages.caseDetailsPage.$inputs.defendants.fill(`${firstName} ${lastName}`);

        await powerAppPages.caseDetailsPage.$interactive.saveButton.click();
        await expect(validationErrorHeading).toBeVisible();
        await expect(validationErrorText).toBeVisible();
        await expect(validationErrorText).toHaveText('Defendant name must be between 1 and 25 characters.');
      });
    },
  );

  test(
    'Verify Defendants containing first name only is rejected',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ powerAppPages, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out case Reference and wintness fields with valid values', async () => {
        await powerAppPages.caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await powerAppPages.caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });

      await test.step('Verify error is shown when only first name is entered for defendants field', async () => {
        const firstName = dataUtils.generateRandomNames('firstName', 1)[0];
        await powerAppPages.caseDetailsPage.$inputs.defendants.fill(firstName);

        await powerAppPages.caseDetailsPage.$interactive.saveButton.click();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.heading).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.text).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.text).toHaveText('Defendant names should be first and last name only.');
      });
    },
  );

  test(
    'Verify Defendants name containing special characters is rejected',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ powerAppPages, dataUtils }) => {
      test.fail(true, 'Known bug - S28-4081');

      await test.step('Pre-requisite step in order to fill out case Reference and witness fields with valid values', async () => {
        await powerAppPages.caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await powerAppPages.caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });

      const specialCharacters = Array.from(new Set(';#<>?+_{}@:~=¬`|\\/*&^%$£"!'));

      for (const char of specialCharacters) {
        await test.step(`Validate Defendants name containing special character '${char}' is rejected`, async () => {
          const invalidValue = dataUtils.generateRandomNames('fullName', 1)[0] + char;
          await powerAppPages.caseDetailsPage.$inputs.defendants.clear();
          await powerAppPages.caseDetailsPage.$inputs.defendants.fill(invalidValue);
          await powerAppPages.caseDetailsPage.$interactive.saveButton.click();

          const errorTextLocator = powerAppPages.caseDetailsPage.$validationErrorModal.text;
          const headingLocator = powerAppPages.caseDetailsPage.$validationErrorModal.heading;

          await expect(headingLocator).toBeVisible();
          await expect(errorTextLocator).toBeVisible();
          await expect(errorTextLocator).toHaveText('Defendant name cannot include special characters: ;#<?>+_{}@:~=¬`|\\/*&^%$£\\""!');

          await powerAppPages.caseDetailsPage.$interactive.validationErrorCloseButton.click();
          await expect(headingLocator).toBeHidden();
        });
      }
    },
  );

  test(
    'Verify Witness field when left empty shows validation error',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ powerAppPages, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out case Reference and Defendants fields with valid values', async () => {
        await powerAppPages.caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await powerAppPages.caseDetailsPage.$inputs.defendants.fill(dataUtils.generateRandomNames('fullName', 1)[0]);
      });

      await test.step('Verify error message is displayed once save button has been selected', async () => {
        await powerAppPages.caseDetailsPage.$interactive.saveButton.click();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.heading).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.text).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.text).toHaveText('Please enter a witness name into the witness field.');
      });
    },
  );

  test(
    'Verify Witness containing last name is rejected',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ powerAppPages, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out case Reference and Defendants fields with valid values', async () => {
        await powerAppPages.caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await powerAppPages.caseDetailsPage.$inputs.defendants.fill(dataUtils.generateRandomNames('fullName', 1)[0]);
      });

      await test.step('Verify error is shown when witness name contains both first and last name', async () => {
        const name = dataUtils.generateRandomNames('fullName', 1)[0];

        await powerAppPages.caseDetailsPage.$inputs.witnesses.fill(name);

        await powerAppPages.caseDetailsPage.$interactive.saveButton.click();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.heading).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.text).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$validationErrorModal.text).toHaveText('Witness names should be first name only.');
      });
    },
  );

  test(
    'Verify Witness name containing special characters is rejected',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ powerAppPages, dataUtils }) => {
      test.fail(true, 'Known bug - S28-4081');

      await test.step('Pre-requisite step in order to fill out case Reference and Defendants fields with valid values', async () => {
        await powerAppPages.caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await powerAppPages.caseDetailsPage.$inputs.defendants.fill(dataUtils.generateRandomNames('fullName', 1)[0]);
      });

      const specialCharacters = Array.from(new Set(';#<>?+_{}@:~=¬`|\\/*&^%$£"!'));

      for (const char of specialCharacters) {
        await test.step(`Validate Witnesses name containing special character '${char}' is rejected`, async () => {
          const invalidValue = dataUtils.generateRandomNames('firstName', 1)[0] + char;
          await powerAppPages.caseDetailsPage.$inputs.witnesses.clear();
          await powerAppPages.caseDetailsPage.$inputs.witnesses.fill(invalidValue);
          await powerAppPages.caseDetailsPage.$interactive.saveButton.click();

          const errorTextLocator = powerAppPages.caseDetailsPage.$validationErrorModal.text;
          const headingLocator = powerAppPages.caseDetailsPage.$validationErrorModal.heading;

          await expect(headingLocator).toBeVisible();
          await expect(errorTextLocator).toBeVisible();
          await expect(errorTextLocator).toHaveText('Witness name cannot include special characters: ;#<?>+_{}@:~=¬`|\\/*&^%$£\\""!');

          await powerAppPages.caseDetailsPage.$interactive.validationErrorCloseButton.click();
          await expect(headingLocator).toBeHidden();
        });
      }
    },
  );

  test(
    'Verify Witness first name containing more than 25 characters are rejected',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ powerAppPages, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out case Reference and Defendants fields with valid values', async () => {
        await powerAppPages.caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await powerAppPages.caseDetailsPage.$inputs.defendants.fill(dataUtils.generateRandomNames('fullName', 1)[0]);
      });
      const validationErrorHeading = powerAppPages.caseDetailsPage.$validationErrorModal.heading;
      const validationErrorText = powerAppPages.caseDetailsPage.$validationErrorModal.text;

      await test.step('Verify Witnesses first name containing more than 25 is rejected', async () => {
        const firstName = faker.string.alpha(26);

        await powerAppPages.caseDetailsPage.$inputs.witnesses.fill(firstName);

        await powerAppPages.caseDetailsPage.$interactive.saveButton.click();
        await expect(validationErrorHeading).toBeVisible();
        await expect(validationErrorText).toBeVisible();
        await expect(validationErrorText).toHaveText('Witness name must be between 1 and 25 characters.');
        await powerAppPages.caseDetailsPage.$interactive.validationErrorCloseButton.click();
        await expect(validationErrorHeading).toBeHidden();
      });
    },
  );

  test(
    'Verify user is unable to modify an existing witness name with blank first name',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ powerAppPages, apiClient }) => {
      await test.step('Pre-requisite step in order to create a case via api and search / select the case that has been created', async () => {
        const caseData = await apiClient.createCase(1, 1);
        await powerAppPages.caseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);
      });

      await test.step('Modify case by amending witness first name to be blank', async () => {
        const caseData = await apiClient.getCaseData();
        await powerAppPages.caseDetailsPage.$interactive.modifyButton.click();
        await expect(powerAppPages.caseDetailsPage.$interactive.modifyCaseAddNewParticipantButton).toBeVisible();
        await powerAppPages.caseDetailsPage.$modifyCaseSelectOptionToAmendParticipant(caseData.witnessNames[0]);
        await powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.firstNameInput.clear();
        await expect(powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.firstNameInput).toBeEmpty();
      });

      await test.step('Verify user is unable to select the submit button', async () => {
        await expect(powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.submitButton).toBeDisabled();
      });
    },
  );

  test(
    'Verify user is unable to modify an existing defendant name with blank first name or last name',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ powerAppPages, apiClient }) => {
      await test.step('Pre-requisite step in order to create a case via api and search / select the case that has been created', async () => {
        const caseData = await apiClient.createCase(1, 1);
        await powerAppPages.caseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);
      });

      await test.step('Modify case by amending defendant first name to be blank', async () => {
        const caseData = await apiClient.getCaseData();
        await powerAppPages.caseDetailsPage.$interactive.modifyButton.click();
        await expect(powerAppPages.caseDetailsPage.$interactive.modifyCaseAddNewParticipantButton).toBeVisible();
        await powerAppPages.caseDetailsPage.$modifyCaseSelectOptionToAmendParticipant(caseData.defendantNames[0]);
        await powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.firstNameInput.clear();
        await expect(powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.firstNameInput).toBeEmpty();
      });

      await test.step('Verify user is unable to select the submit button', async () => {
        await expect(powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.submitButton).toBeDisabled();
      });

      await test.step('Re-populate first name field and set last name to be blank', async () => {
        await powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.firstNameInput.fill('John');
        await expect(powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.firstNameInput).toHaveValue('John');
        await powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.lastNameInput.clear();
        await expect(powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.lastNameInput).toBeEmpty();
      });

      await test.step('Verify user is unable to select the submit button', async () => {
        await expect(powerAppPages.caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.submitButton).toBeDisabled();
      });
    },
  );
});
