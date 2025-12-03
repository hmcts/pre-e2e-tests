import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';
import { runAxeAuditIgnoringRules } from '../../../utils/accessibility.utils';

test.describe('Set of tests to verify accessibility of pages within pre power apps', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test(
    'Verify accessibility on home page',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToPowerAppHomePage, axeUtils }) => {
      await test.step('Navigate to home page', async () => {
        await navigateToPowerAppHomePage();
      });

      await test.step('Check accessibility on home page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on case details page',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToPowerAppCaseDetailsPage, axeUtils }) => {
      await test.step('Select option to book a recording in order to navigate to case details page', async () => {
        await navigateToPowerAppCaseDetailsPage();
      });

      await test.step('Check accessibility on case details page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on case details page once user begins searching for a case',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToPowerAppCaseDetailsPage, powerApp_CaseDetailsPage, axeUtils }) => {
      await test.step('Select option to book a recording in order to navigate to case details page', async () => {
        await navigateToPowerAppCaseDetailsPage();
      });

      await test.step('Search for cases beginning with PR- to obtain a list of existing cases', async () => {
        await powerApp_CaseDetailsPage.$inputs.caseReference.fill('PR-');
        await expect(powerApp_CaseDetailsPage.$static.searchResultExistingCasesTitle).toBeVisible();
      });

      await test.step('Check accessibility on case details page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on case details page once user has selected an existing case from the search results',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToPowerAppCaseDetailsPage, powerApp_CaseDetailsPage, axeUtils, apiClient }) => {
      await test.step('Pre-requisite step in order to setup an existing case via api', async () => {
        await apiClient.createCase(2, 2);
      });

      await test.step('Select option to book a recording in order to navigate to case details page', async () => {
        await navigateToPowerAppCaseDetailsPage();
      });

      await test.step('Search and select an existing case', async () => {
        const caseData = await apiClient.getCaseData();
        await powerApp_CaseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);
      });

      await test.step('Check accessibility on case details page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on case details page once user has selected option to modify an existing case from the search results',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToPowerAppCaseDetailsPage, powerApp_CaseDetailsPage, axeUtils, apiClient }) => {
      await test.step('Pre-requisite step in order to setup an existing case via api', async () => {
        await apiClient.createCase(2, 2);
      });

      await test.step('Select option to book a recording in order to navigate to case details page', async () => {
        await navigateToPowerAppCaseDetailsPage();
      });

      await test.step('Search and select an existing case', async () => {
        const caseData = await apiClient.getCaseData();
        await powerApp_CaseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);
      });

      await test.step('Select option to modify case that has been selected', async () => {
        await powerApp_CaseDetailsPage.$interactive.modifyButton.click();
        await expect(powerApp_CaseDetailsPage.$static.modifyCaseReferenceText).toBeVisible();
      });

      await test.step('Check accessibility on case details page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on schedule a recording page',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToPowerAppScheduleRecordingsPage, axeUtils, apiClient }) => {
      await test.step('Pre-requisite step in order to setup an existing case with a booking assigned via api', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
      });

      await test.step('Select option to book a recording in order to navigate to schedule recording page', async () => {
        const caseData = await apiClient.getCaseData();
        await navigateToPowerAppScheduleRecordingsPage(caseData.caseReference);
      });

      await test.step('Check accessibility on schedule recordings page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on manage bookings page',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToPowerAppManageBookingsPage, axeUtils }) => {
      await test.step('Navigate to manage bookings page', async () => {
        await navigateToPowerAppManageBookingsPage();
      });

      await test.step('Check accessibility on manage bookings page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility when selecting option to manage an existing case on manage bookings page',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToPowerAppManageBookingsPage, powerApp_ManageBookingsPage, axeUtils, apiClient }) => {
      await test.step('Pre-requisite step in order to setup an existing case with a booking assigned via api', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
      });

      await test.step('Navigate to manage bookings page and search for an existing case', async () => {
        await navigateToPowerAppManageBookingsPage();
        const caseData = await apiClient.getCaseData();
        await powerApp_ManageBookingsPage.searchForABooking(caseData.caseReference);
      });

      await test.step('Select option to manage existing case', async () => {
        await powerApp_ManageBookingsPage.$interactive.manageButton.click();
        await expect(powerApp_ManageBookingsPage.$manageCaseModal.modalWindow).toBeVisible();
      });

      await test.step('Check accessibility of manage modal on manage bookings page', async () => {
        await axeUtils.audit();
      });

      await test.step('Select option to audit within manage bookings modal', async () => {
        await powerApp_ManageBookingsPage.$manageCaseModal.auditButton.click();
        await expect(powerApp_ManageBookingsPage.$manageCaseModal.auditCaseInformationText).toBeVisible();
      });

      await test.step('Check accessibility of audit option within manage bookings modal', async () => {
        await axeUtils.audit();
      });

      await test.step('Select option to share within manage bookings modal', async () => {
        await powerApp_ManageBookingsPage.$manageCaseModal.closeAuditButton.click();
        await powerApp_ManageBookingsPage.$manageCaseModal.shareButton.click();
        await expect(powerApp_ManageBookingsPage.$manageCaseModal.shareWithUsersTitle).toBeVisible();
        await expect(powerApp_ManageBookingsPage.$manageCaseModal.shareDropdown).toBeVisible();
        await expect(powerApp_ManageBookingsPage.$manageCaseModal.grantAccessButton).toBeVisible();
      });

      await test.step('Check accessibility of share option within manage bookings modal', async () => {
        test.fail(true, 'Bug raised on PRE team board - S28-4337');
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility when selecting option to amend an existing case on manage bookings page',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToPowerAppManageBookingsPage, powerApp_ManageBookingsPage, axeUtils, apiClient }) => {
      await test.step('Pre-requisite step in order to setup an existing case with a booking assigned via api', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
      });

      await test.step('Navigate to manage bookings page and search for an existing case', async () => {
        await navigateToPowerAppManageBookingsPage();
        const caseData = await apiClient.getCaseData();
        await powerApp_ManageBookingsPage.searchForABooking(caseData.caseReference);
      });

      await test.step('Select option to amend existing case', async () => {
        await powerApp_ManageBookingsPage.$interactive.amendButton.click();
        await expect(powerApp_ManageBookingsPage.$amendCaseModal.modalWindow).toBeVisible();
      });

      await test.step('Check accessibility of amend modal on manage bookings page', async () => {
        await axeUtils.audit();
      });

      await test.step('Select option to delete case via amend modal', async () => {
        await powerApp_ManageBookingsPage.$amendCaseModal.deleteButton.click();
        await expect(powerApp_ManageBookingsPage.$amendCaseModal.deleteCaseText).toBeVisible();
      });

      await test.step('Check accessibility of delete option within amend modal', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on view live recording page',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToPowerAppViewLiveFeedPage, page, apiClient }) => {
      // test.fail(true, 'Bug raised on PRE team board - S28-4336');

      await test.step('Pre-requisite step in order to setup an existing case with a booking assigned via api', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
      });

      await test.step('Select option to record on manage bookings page in order to navigate to view live recording page', async () => {
        const caseData = await apiClient.getCaseData();
        await navigateToPowerAppViewLiveFeedPage(caseData.caseReference);
      });
      
      await test.step('Check accessibility on view live recording page', async () => {
        // Instead of calling axeUtils.audit(), ignore the axe violation 'scrollable-region-focusable' for now - it is not currently fixable in the current implementation of Power Apps
        // await axeUtils.audit();
        const filteredViolations = await runAxeAuditIgnoringRules(page, ['scrollable-region-focusable']);
        expect(filteredViolations).toEqual([]);
      });
    },
  );

  test(
    'Verify accessibility on view recordings page',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToPowerAppViewRecordingsPage, axeUtils }) => {
      await test.step('Navigate to view recordings page', async () => {
        await navigateToPowerAppViewRecordingsPage();
      });

      await test.step('Check accessibility on view recordings page', async () => {
        await axeUtils.audit();
      });
    },
  );
});
