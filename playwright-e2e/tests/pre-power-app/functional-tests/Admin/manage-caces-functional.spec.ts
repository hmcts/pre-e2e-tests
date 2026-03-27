import { test } from '../../../../fixtures';
import { BaseCaseDetails } from '../../../../types';
import { config } from '../../../../utils';

test.describe('Set of tests to verify functionality of delete cases for Level 1 user', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppManageCasesPage }) => {
    await navigateToPowerAppManageCasesPage();
  });

  test(
    'Verify user is able to search for an existing case and delete the case successfully',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ apiClient, powerApp_ManageCasesPage }) => {
      await test.step('Pre-requisite step create a new case using api', async () => {
        await apiClient.createCase(1, 1);
      });

      const caseData: BaseCaseDetails = await apiClient.getCaseData();

      await test.step('Verify existing case is available on manage cases page', async () => {
        await powerApp_ManageCasesPage.searchForAnExistingCase(caseData.caseReference);
      });

      await test.step('Verify user is able to delete the case successfully', async () => {
        await powerApp_ManageCasesPage.$interactive.deleteCaseButton.click();
      });
    },
  );
});
