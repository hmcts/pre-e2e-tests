import { test, expect } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify buttons on the manage booking page are in correct state', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppManageBookingsPage }) => {
    await navigateToPowerAppManageBookingsPage();
  });

  test(
    'Verify when accessing the manage bookings Page and selecting an exisiting case all the buttons are in correct state',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ powerAppPages, apiClient }) => {
      await test.step('Pre-requisite step in order to create and select a exising case via api', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
        const caseData = await apiClient.getCaseData();
        await powerAppPages.manageBookingsPage.searchForABooking(caseData.caseReference);
      });

      await test.step('Verify following manage, amend and record buttons are visible', async () => {
        await expect(powerAppPages.manageBookingsPage.$interactive.manageButton).toBeVisible();
        await expect(powerAppPages.manageBookingsPage.$interactive.amendButton).toBeVisible();
        await expect(powerAppPages.manageBookingsPage.$interactive.recordButton).toBeVisible();
      });

      await test.step('Verify following manage, amend and record buttons are enabled', async () => {
        await expect(powerAppPages.manageBookingsPage.$interactive.manageButton).toBeEnabled();
        await expect(powerAppPages.manageBookingsPage.$interactive.amendButton).toBeEnabled();
        await expect(powerAppPages.manageBookingsPage.$interactive.recordButton).toBeEnabled();
      });
    },
  );
  test(
    'Verify when selecting option to manage a case all buttons are in the correct state',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ powerAppPages, apiClient }) => {
      await test.step('Pre-requisite step in order to select the option to manage an exisitng case', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
        const caseData = await apiClient.getCaseData();
        await powerAppPages.manageBookingsPage.searchForABooking(caseData.caseReference);
        await powerAppPages.manageBookingsPage.$interactive.manageButton.click();
      });

      await test.step('Verify following cancel, share and audit buttons are visible', async () => {
        await expect(powerAppPages.manageBookingsPage.$manageCaseModal.cancelButton).toBeVisible();
        await expect(powerAppPages.manageBookingsPage.$manageCaseModal.shareButton).toBeVisible();
        await expect(powerAppPages.manageBookingsPage.$manageCaseModal.auditButton).toBeVisible();
      });

      await test.step('Verify following cancel, share and audit buttons are enabled', async () => {
        await expect(powerAppPages.manageBookingsPage.$manageCaseModal.cancelButton).toBeEnabled();
        await expect(powerAppPages.manageBookingsPage.$manageCaseModal.shareButton).toBeEnabled();
        await expect(powerAppPages.manageBookingsPage.$manageCaseModal.auditButton).toBeEnabled();
      });
      await test.step('Verify following manage, amend and record buttons are disabled', async () => {
        await expect(powerAppPages.manageBookingsPage.$interactive.manageButton).toBeDisabled();
        await expect(powerAppPages.manageBookingsPage.$interactive.amendButton).toBeDisabled();
        await expect(powerAppPages.manageBookingsPage.$interactive.recordButton).toBeDisabled();
      });
    },
  );

  test(
    'Verify when selecting an option to share a case all buttons are in the correct state',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ powerAppPages, apiClient }) => {
      await test.step('Pre-requisite step in order to select the option to share an exisitng case', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
        const caseData = await apiClient.getCaseData();
        await powerAppPages.manageBookingsPage.searchForABooking(caseData.caseReference);
        await powerAppPages.manageBookingsPage.$interactive.manageButton.click();
        await powerAppPages.manageBookingsPage.$manageCaseModal.shareButton.click();
      });
      await test.step('Verify following cancel and grant access buttons are visible and enabled', async () => {
        await expect(powerAppPages.manageBookingsPage.$manageCaseModal.cancelButton).toBeVisible();
        await expect(powerAppPages.manageBookingsPage.$manageCaseModal.grantAccessButton).toBeVisible();
        await expect(powerAppPages.manageBookingsPage.$manageCaseModal.cancelButton).toBeEnabled();
        await expect(powerAppPages.manageBookingsPage.$manageCaseModal.grantAccessButton).toBeEnabled();
      });

      await test.step('Verify following manage, amend and record buttons are disabled', async () => {
        await expect(powerAppPages.manageBookingsPage.$interactive.manageButton).toBeDisabled();
        await expect(powerAppPages.manageBookingsPage.$interactive.amendButton).toBeDisabled();
        await expect(powerAppPages.manageBookingsPage.$interactive.recordButton).toBeDisabled();
      });
    },
  );

  test(
    'Verify when selecting option to audit a case all buttons are in the correct state',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ powerAppPages, apiClient }) => {
      await test.step('Pre-requisite step in order to select the option to audit an exisitng case', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
        const caseData = await apiClient.getCaseData();
        await powerAppPages.manageBookingsPage.searchForABooking(caseData.caseReference);
        await powerAppPages.manageBookingsPage.$interactive.manageButton.click();
        await powerAppPages.manageBookingsPage.$manageCaseModal.auditButton.click();
      });
      await test.step('Verify close button is enabled and visible', async () => {
        await expect(powerAppPages.manageBookingsPage.$manageCaseModal.closeAuditButton).toBeEnabled();
        await expect(powerAppPages.manageBookingsPage.$manageCaseModal.closeAuditButton).toBeVisible();
      });
      await test.step('Verify following manage, amend and record buttons are disabled', async () => {
        await expect(powerAppPages.manageBookingsPage.$interactive.manageButton).toBeDisabled();
        await expect(powerAppPages.manageBookingsPage.$interactive.amendButton).toBeDisabled();
        await expect(powerAppPages.manageBookingsPage.$interactive.recordButton).toBeDisabled();
      });
    },
  );

  test(
    'Verify when selecting a option to amend a case all three buttons are in the correct state',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ powerAppPages, apiClient }) => {
      await test.step('Pre-requisite step in order to select the option to amend an exisiitng case', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
        const caseData = await apiClient.getCaseData();
        await powerAppPages.manageBookingsPage.searchForABooking(caseData.caseReference);
        await powerAppPages.manageBookingsPage.$interactive.amendButton.click();
      });

      await test.step('Verify following cancel, save and delete buttons are visible', async () => {
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.cancelButton).toBeVisible();
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.saveButton).toBeVisible();
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.deleteButton).toBeVisible();
      });
      await test.step('Verify cancel and delete buttons are enabled', async () => {
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.cancelButton).toBeEnabled();
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.deleteButton).toBeEnabled();
      });
      await test.step('Verify save button is disabled', async () => {
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.saveButton).toBeDisabled();
      });
      await test.step('Verify following manage, amend and record buttons are disabled', async () => {
        await expect(powerAppPages.manageBookingsPage.$interactive.manageButton).toBeDisabled();
        await expect(powerAppPages.manageBookingsPage.$interactive.amendButton).toBeDisabled();
        await expect(powerAppPages.manageBookingsPage.$interactive.recordButton).toBeDisabled();
      });
    },
  );
  test(
    'Verify when cancelling amendments to an exisitng case, all buttons are in the correct state',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ powerAppPages, apiClient }) => {
      await test.step('Pre-requisite step in order to cancel amendment of an exisitng case', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
        const caseData = await apiClient.getCaseData();
        await powerAppPages.manageBookingsPage.searchForABooking(caseData.caseReference);
        await powerAppPages.manageBookingsPage.$interactive.amendButton.click();
        await powerAppPages.manageBookingsPage.$amendCaseModal.cancelButton.click();
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.modalWindow).toBeVisible();
      });

      await test.step('Verify yes and no buttons are visible and enabled', async () => {
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.yesToCancelButton).toBeEnabled();
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.noToCancelButton).toBeEnabled();
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.yesToCancelButton).toBeVisible();
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.noToCancelButton).toBeVisible();
      });
    },
  );

  test(
    'Verify when selecting option to delete an exisiting case, all buttons are in the correct state',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ powerAppPages, apiClient }) => {
      await test.step('Pre-requisite step in order to delete an exisitng case', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
        const caseData = await apiClient.getCaseData();
        await powerAppPages.manageBookingsPage.searchForABooking(caseData.caseReference);
        await powerAppPages.manageBookingsPage.$interactive.amendButton.click();
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.modalWindow).toBeVisible();
        await powerAppPages.manageBookingsPage.$amendCaseModal.deleteButton.click();
      });

      await test.step('Verify yes and no buttons are visible and enabled', async () => {
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.yesToDeleteButton).toBeEnabled();
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.noToDeleteButton).toBeEnabled();
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.yesToDeleteButton).toBeVisible();
        await expect(powerAppPages.manageBookingsPage.$amendCaseModal.noToDeleteButton).toBeVisible();
      });
      await test.step('Verify following manage,amend and record buttons are disabled', async () => {
        await expect(powerAppPages.manageBookingsPage.$interactive.manageButton).toBeDisabled();
        await expect(powerAppPages.manageBookingsPage.$interactive.amendButton).toBeDisabled();
        await expect(powerAppPages.manageBookingsPage.$interactive.recordButton).toBeDisabled();
      });
    },
  );

  test(
    'Verify when selecting option to record for an existing case, two buttons are in the correct state',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ powerAppPages, apiClient }) => {
      await test.step('Pre-requisite step in order to select the option to record an exisiting case', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
        const caseData = await apiClient.getCaseData();
        await powerAppPages.manageBookingsPage.searchForABooking(caseData.caseReference);
        await powerAppPages.manageBookingsPage.$interactive.recordButton.click();
        await powerAppPages.viewLiveFeedPage.verifyUserIsOnViewLiveFeedPage();
      });

      await test.step('Verify following back and start recording buttons are visible and enabled', async () => {
        await expect(powerAppPages.viewLiveFeedPage.$interactive.backButton).toBeVisible();
        await expect(powerAppPages.viewLiveFeedPage.$interactive.startRecordingButton).toBeVisible();
        await expect(powerAppPages.viewLiveFeedPage.$interactive.backButton).toBeEnabled();
        await expect(powerAppPages.viewLiveFeedPage.$interactive.startRecordingButton).toBeEnabled();
      });
    },
  );
});
