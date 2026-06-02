import { test, expect } from '../../../../fixtures';
import { BaseCaseDetails } from '../../../../types';
import { config } from '../../../../utils';

test.describe('Set of tests to verify functionality of case details page as a Level 1 user', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppCaseDetailsPage }) => {
    await navigateToPowerAppCaseDetailsPage();
  });

  test(
    'Verify user is able to open a new case and is redirected to the schedule recordings page',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ powerAppPages, dataUtils }) => {
      await test.step('Enter details for a new case and select save button', async () => {
        const caseDetails: BaseCaseDetails = dataUtils.generateRandomCaseDetails(2, 2);

        await powerAppPages.caseDetailsPage.populateCaseDetails({
          caseReference: caseDetails.caseReference,
          defendantNames: caseDetails.defendantNames,
          witnessNames: caseDetails.witnessNames,
        });

        await powerAppPages.caseDetailsPage.navigationClick(powerAppPages.caseDetailsPage.$interactive.saveButton);
      });

      await test.step('Verify logo and text is displayed to indicate details have been saved', async () => {
        await expect(powerAppPages.caseDetailsPage.$static.saveCaseSuccessLogo).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$static.saveCaseSuccessText).toBeVisible();
      });

      await test.step('Verify user is redirected to the schedule recordings page', async () => {
        await powerAppPages.scheduleRecordingPage.verifyUserIsOnScheduleRecordingsPage();
      });
    },
  );

  test(
    'Verify case details are correct when searching and selecting an exisiting case',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ powerAppPages, apiClient }) => {
      await test.step('Pre-requisite step in order to create a case via api', async () => {
        await apiClient.createCase(2, 2);
      });
      const caseData = await apiClient.getCaseData();

      await test.step('Verify case appears in search list when searched for', async () => {
        await powerAppPages.caseDetailsPage.$inputs.caseReference.fill(caseData.caseReference);
        await expect(powerAppPages.caseDetailsPage.$inputs.caseReference).toHaveValue(caseData.caseReference);
        await expect(powerAppPages.caseDetailsPage.$static.searchResultExistingCasesTitle).toBeVisible();
      });

      await test.step('Verify correct details of case are displayed in search list', async () => {
        await expect(powerAppPages.caseDetailsPage.$interactive.existingCaseFoundButtonInSearchList).toHaveCount(1);
        await expect(powerAppPages.caseDetailsPage.$interactive.existingCaseFoundButtonInSearchList).toContainText(caseData.caseReference);
        await expect(powerAppPages.caseDetailsPage.$interactive.existingCaseFoundButtonInSearchList).toContainText('Open');
        await expect(powerAppPages.caseDetailsPage.$interactive.existingCaseFoundButtonInSearchList).toContainText('PRE');
        await expect(powerAppPages.caseDetailsPage.$interactive.existingCaseFoundButtonInSearchList).toBeVisible();
      });

      await test.step('Verify case details are correct when exisiting case is selected from search list', async () => {
        await powerAppPages.caseDetailsPage.$interactive.existingCaseFoundButtonInSearchList.click();
        await expect(powerAppPages.caseDetailsPage.$static.selectedExistingCaseReferenceLabel).toContainText(caseData.caseReference);
        await expect(powerAppPages.caseDetailsPage.$static.selectedExistingCaseReferenceLabel).toBeVisible();

        //Verify source label contains PRE .
        await expect(powerAppPages.caseDetailsPage.$static.selectedExisitingCaseSourceLabel).toContainText('PRE');
        await expect(powerAppPages.caseDetailsPage.$static.selectedExisitingCaseSourceLabel).toBeVisible();

        //Verify case status is Active.
        await expect(powerAppPages.caseDetailsPage.$static.selectedExisitingCaseStatusLabel).toContainText('Active');
        await expect(powerAppPages.caseDetailsPage.$static.selectedExisitingCaseStatusLabel).toBeVisible();

        //Verify defendant value appears correctly.
        const defendantValue = await powerAppPages.caseDetailsPage.$inputs.defendants.inputValue();
        for (const defendantName of caseData.defendantNames) {
          expect(defendantValue).toContain(defendantName);
        }
        await expect(powerAppPages.caseDetailsPage.$inputs.defendants).toBeVisible();

        //Verify witness value appears correctly.
        const witnessValue = await powerAppPages.caseDetailsPage.$inputs.witnesses.inputValue();
        for (const witnessName of caseData.witnessNames) {
          expect(witnessValue).toContain(witnessName);
        }
        await expect(powerAppPages.caseDetailsPage.$inputs.witnesses).toBeVisible();
      });
    },
  );
});
