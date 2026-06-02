import { test, expect } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify buttons on the case details page are in the correct state', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppCaseDetailsPage }) => {
    await navigateToPowerAppCaseDetailsPage();
  });

  test(
    'Verify when accessing the CaseDetailsPage all the three buttons are in the correct state',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ powerAppPages }) => {
      await test.step('Verify all the buttons on case details page are visible', async () => {
        await expect(powerAppPages.caseDetailsPage.$interactive.modifyButton).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$interactive.saveButton).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$interactive.bookingsButton).toBeVisible();
      });
      await test.step('Verify modify and bookings buttons are disabled when accessing case details page', async () => {
        await expect(powerAppPages.caseDetailsPage.$interactive.modifyButton).toBeDisabled();
        await expect(powerAppPages.caseDetailsPage.$interactive.bookingsButton).toBeDisabled();
      });
      await test.step('Verify save button is enabled when accessing case details page', async () => {
        await expect(powerAppPages.caseDetailsPage.$interactive.saveButton).toBeEnabled();
      });
    },
  );
  test(
    'Verify when selecting an exisiting case, four buttons are in the correct state',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ powerAppPages, apiClient }) => {
      await test.step('Pre-requisite step in order to create a case via api', async () => {
        await apiClient.createCase(2, 2);
      });
      const caseData = await apiClient.getCaseData();
      await powerAppPages.caseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);

      await test.step('Verify all four buttons are visible', async () => {
        await expect(powerAppPages.caseDetailsPage.$interactive.selectedCaseCloseButton).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$interactive.modifyButton).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$interactive.bookingsButton).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$interactive.saveButton).toBeVisible();
      });
      await test.step('Verify three buttons are enabled', async () => {
        await expect(powerAppPages.caseDetailsPage.$interactive.selectedCaseCloseButton).toBeEnabled();
        await expect(powerAppPages.caseDetailsPage.$interactive.modifyButton).toBeEnabled();
        await expect(powerAppPages.caseDetailsPage.$interactive.bookingsButton).toBeEnabled();
      });
      await test.step('Verify save button is disabled upon selecting an exisiting case', async () => {
        await expect(powerAppPages.caseDetailsPage.$interactive.saveButton).toBeDisabled();
      });
    },
  );

  test(
    'Verify when selecting options to close case,all the buttons are in the correct state',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ powerAppPages, apiClient }) => {
      await test.step('Pre-requisite step in order to create and select a new case', async () => {
        const caseData = await apiClient.createCase(2, 2);
        await powerAppPages.caseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);
        await powerAppPages.caseDetailsPage.$interactive.selectedCaseCloseButton.click();
      });

      await test.step('Verify buttons to cancel or save are visible upon selecting close case button', async () => {
        await expect(powerAppPages.caseDetailsPage.$interactive.selectedCaseCancelPendingClosureButton).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$closeCaseModal.saveButton).toBeVisible();
      });

      await test.step('Verify buttons to cancel or save are enabled upon selecting close case button', async () => {
        await expect(powerAppPages.caseDetailsPage.$interactive.selectedCaseCancelPendingClosureButton).toBeEnabled();
        await expect(powerAppPages.caseDetailsPage.$closeCaseModal.saveButton).toBeEnabled();
      });

      await test.step('Verify buttons to select yes or no are visible upon selecting save button', async () => {
        await powerAppPages.caseDetailsPage.$closeCaseModal.saveButton.click();
        await expect(powerAppPages.caseDetailsPage.$closeCaseModal.yesButton).toBeVisible();
        await expect(powerAppPages.caseDetailsPage.$closeCaseModal.noButton).toBeVisible();
      });

      await test.step('Verify buttons to select yes or no are enabled upon selecting save button', async () => {
        await expect(powerAppPages.caseDetailsPage.$closeCaseModal.yesButton).toBeEnabled();
        await expect(powerAppPages.caseDetailsPage.$closeCaseModal.noButton).toBeEnabled();
      });
    },
  );
});
