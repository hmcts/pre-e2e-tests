/* eslint-disable playwright/no-skipped-test */
import { test, expect } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify the schedule recording page UI is visually correct', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeAll(async ({ headless }) => {
    test.skip(!headless, 'Skipping visual tests in headed mode');
  });

  test(
    'Verify when accessing schedule recording page for an existing case that has no booking, it is visually correct',
    {
      tag: ['@visual'],
    },
    async ({ page, powerAppPages, apiClient, navigateToPowerAppScheduleRecordingsPage }) => {
      await test.step('Pre-requisite step in order to create a case and navigate to schedule recording page', async () => {
        const caseData = await apiClient.createCase(2, 2);
        await navigateToPowerAppScheduleRecordingsPage(caseData.caseReference);
      });
      const maskedElements = [
        powerAppPages.scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        powerAppPages.scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        powerAppPages.scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
      ];

      await test.step('Verify upon accessing schedule recording page, it is visually correct', async () => {
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(async () => {
          await expect(page).toHaveScreenshot('schedule-recordings-page-no-booking-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify when accessing schedule recording page for an existing case that has a booking, it is visually correct',
    {
      tag: ['@visual'],
    },
    async ({ page, powerAppPages, apiClient, navigateToPowerAppScheduleRecordingsPage, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to create a case and navigate to schedule recording page', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
        const caseData = await apiClient.getCaseData();
        await navigateToPowerAppScheduleRecordingsPage(caseData.caseReference);
      });
      const maskedElements = [
        powerAppPages.scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        powerAppPages.scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        powerAppPages.scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
      ];

      await test.step('Redact dynamic test data', async () => {
        const caseData = await apiClient.getCaseData();
        const bookingData = await apiClient.getBookingData();

        await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.scheduleRecordingPage.$static.listOfScheduledRecordings, [
          [/(\d{2}\/\d{2}\/\d{4})/, '01/01/0001'],
          [bookingData.witnessSelectedForCaseRecording, '{redacted-witness}'],
        ]);

        for (const defendant of caseData.defendantNames) {
          await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.scheduleRecordingPage.$static.listOfScheduledRecordings, [
            [defendant, '{redacted-defendant}'],
          ]);
        }
      });

      await test.step('Verify upon accessing schedule recording page, it is visually correct', async () => {
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(async () => {
          await expect(page).toHaveScreenshot('schedule-recordings-page-has-booking-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify when attempting to delete a scheduled recording on scheduled recording page, it is visually correct',
    {
      tag: ['@visual'],
    },
    async ({ page, powerAppPages, apiClient, navigateToPowerAppScheduleRecordingsPage, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to create a case, navigate to schedule recording page', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
        const caseData = await apiClient.getCaseData();
        await navigateToPowerAppScheduleRecordingsPage(caseData.caseReference);
      });
      const maskedElements = [
        powerAppPages.scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        powerAppPages.scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        powerAppPages.scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
      ];

      await test.step('Select option to delete scheduled recording', async () => {
        await powerAppPages.scheduleRecordingPage.$interactive.deleteScheduledRecordingButton.click();
        await expect(powerAppPages.scheduleRecordingPage.$deleteScheduleModal.modalWindow).toBeVisible();
      });

      await test.step('Redact dynamic test data', async () => {
        const caseData = await apiClient.getCaseData();
        const bookingData = await apiClient.getBookingData();

        await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.scheduleRecordingPage.$static.scheduledRecordingStartDateLabel, [
          [/(\d{2}\/\d{2}\/\d{4})/, '01/01/0001'],
        ]);

        await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.scheduleRecordingPage.$deleteScheduleModal.modalBody, [
          [caseData.caseReference, '{redacted}'],
          [/\b\d{2}\/\d{2}\/\d{4}\b/, '01/01/0001'],
          [bookingData.witnessSelectedForCaseRecording, '{redacted-witness}'],
        ]);

        for (const defendant of caseData.defendantNames) {
          await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.scheduleRecordingPage.$deleteScheduleModal.modalBody, [
            [defendant, '{redacted-defendant}'],
          ]);
        }
      });

      await test.step('Verify upon selecting option to delete a scheduled recording, it is visually correct', async () => {
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(async () => {
          await expect(page).toHaveScreenshot('schedule-recordings-page-delete-booking-modal-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify when viewing a booking that has a recording on scheduled recording page, it is visually correct',
    {
      tag: ['@visual'],
    },
    async ({ page, powerAppPages, apiClient, navigateToPowerAppScheduleRecordingsPage, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to create a case and navigate to schedule recording page', async () => {
        await apiClient.createANewCaseAndAssignRecording(2, 2, 'today');
        const caseData = await apiClient.getCaseData();
        await navigateToPowerAppScheduleRecordingsPage(caseData.caseReference);
      });

      await test.step('Redact dynamic test data', async () => {
        const caseData = await apiClient.getCaseData();
        const bookingData = await apiClient.getBookingData();

        await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.scheduleRecordingPage.$static.scheduledRecordingStartDateLabel, [
          [/(\d{2}\/\d{2}\/\d{4})/, '01/01/0001'],
        ]);

        await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.scheduleRecordingPage.$static.scheduledRecordingWitnessLabel, [
          [bookingData.witnessSelectedForCaseRecording, '{redacted-witness}'],
        ]);

        for (const defendant of caseData.defendantNames) {
          await userInterfaceUtils.replaceTextWithinStaticElement(powerAppPages.scheduleRecordingPage.$static.scheduledRecordingDefendantsLabel, [
            [defendant, '{redacted-defendant}'],
          ]);
        }
      });

      await test.step('Verify upon accessing schedule recording page, it is visually correct', async () => {
        const maskedElements = [
          powerAppPages.scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
          powerAppPages.scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
          powerAppPages.scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
        ];

        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(async () => {
          await expect(page).toHaveScreenshot('schedule-recordings-page-booking-has-recording-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );
});
