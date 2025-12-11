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
    async ({ powerApp_CaseDetailsPage, dataUtils, powerApp_ScheduleRecordingPage }) => {
      await test.step('Enter details for a new case and select save button', async () => {
        const caseDetails: BaseCaseDetails = dataUtils.generateRandomCaseDetails(2, 2);

        await powerApp_CaseDetailsPage.populateCaseDetails({
          caseReference: caseDetails.caseReference,
          defendantNames: caseDetails.defendantNames,
          witnessNames: caseDetails.witnessNames,
        });

        await powerApp_CaseDetailsPage.navigationClick(powerApp_CaseDetailsPage.$interactive.saveButton);
      });

      await test.step('Verify logo and text is displayed to indicate details have been saved', async () => {
        await expect(powerApp_CaseDetailsPage.$static.saveCaseSuccessLogo).toBeVisible();
        await expect(powerApp_CaseDetailsPage.$static.saveCaseSuccessText).toBeVisible();
      });

      await test.step('Verify user is redirected to the schedule recordings page', async () => {
        await powerApp_ScheduleRecordingPage.verifyUserIsOnScheduleRecordingsPage();
      });
    },
  );

  test(
    'Verify case details are correct when searching and selecting an exisiting case',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ powerApp_CaseDetailsPage, apiClient }) => {
      await test.step('Pre-requisite step in order to create a case via api', async () => {
        await apiClient.createCase(2, 2);
      });
      const caseData = await apiClient.getCaseData();

      await test.step('Verify case appears in search list when searched for', async () => {
        await powerApp_CaseDetailsPage.$inputs.caseReference.fill(caseData.caseReference);
        await expect(powerApp_CaseDetailsPage.$inputs.caseReference).toHaveValue(caseData.caseReference);
        await expect(powerApp_CaseDetailsPage.$static.searchResultExistingCasesTitle).toBeVisible();
      });

      await test.step('Verify correct details of case are displayed in search list', async () => {
        await expect(powerApp_CaseDetailsPage.$interactive.existingCaseFoundButtonInSearchList).toHaveCount(1);
        await expect(powerApp_CaseDetailsPage.$interactive.existingCaseFoundButtonInSearchList).toContainText(caseData.caseReference);
        await expect(powerApp_CaseDetailsPage.$interactive.existingCaseFoundButtonInSearchList).toContainText('Open');
        await expect(powerApp_CaseDetailsPage.$interactive.existingCaseFoundButtonInSearchList).toContainText('PRE');
        await expect(powerApp_CaseDetailsPage.$interactive.existingCaseFoundButtonInSearchList).toBeVisible();
      });

      await test.step('Verify case details are correct when exisiting case is selected from search list', async () => {
        await powerApp_CaseDetailsPage.$interactive.existingCaseFoundButtonInSearchList.click();
        await expect(powerApp_CaseDetailsPage.$static.selectedExistingCaseReferenceLabel).toContainText(caseData.caseReference);
        await expect(powerApp_CaseDetailsPage.$static.selectedExistingCaseReferenceLabel).toBeVisible();

        //Verify source label contains PRE .
        await expect(powerApp_CaseDetailsPage.$static.selectedExisitingCaseSourceLabel).toContainText('PRE');
        await expect(powerApp_CaseDetailsPage.$static.selectedExisitingCaseSourceLabel).toBeVisible();

        //Verify case status is Active.
        await expect(powerApp_CaseDetailsPage.$static.selectedExisitingCaseStatusLabel).toContainText('Active');
        await expect(powerApp_CaseDetailsPage.$static.selectedExisitingCaseStatusLabel).toBeVisible();

        //Verify defendant value appears correctly.
        const defendantValue = await powerApp_CaseDetailsPage.$inputs.defendants.inputValue();
        for (const defendantName of caseData.defendantNames) {
          expect(defendantValue).toContain(defendantName);
        }
        await expect(powerApp_CaseDetailsPage.$inputs.defendants).toBeVisible();

        //Verify witness value appears correctly.
        const witnessValue = await powerApp_CaseDetailsPage.$inputs.witnesses.inputValue();
        for (const witnessName of caseData.witnessNames) {
          expect(witnessValue).toContain(witnessName);
        }
        await expect(powerApp_CaseDetailsPage.$inputs.witnesses).toBeVisible();
      });
    },
  );
});
