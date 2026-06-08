import { Page } from '@playwright/test';
import { ApiClient } from '../../../api-requests/index.js';
import { PowerAppPages } from '../../../page-objects/pre-power-app/power-app-pages.js';
import { CreatedCaseSummary, RecordingDetails } from '../../../types/index.js';
import { config } from '../../../utils/index.js';

type NewBrowserContextAndPage = (options: { powerappUser?: 'preLevel1User'; portalUser?: 'preLevel3User' }) => Promise<Page>;

export interface SharedPortalRecording {
  caseData: CreatedCaseSummary;
  recordingData: RecordingDetails;
}

export async function createAndShareRecordingWithPortalUser(
  apiClient: ApiClient,
  newBrowserContextAndPage: NewBrowserContextAndPage,
): Promise<SharedPortalRecording> {
  await apiClient.createANewCaseAndAssignRecording(2, 2, 'today');

  const caseData = await apiClient.getCaseData();
  await apiClient.verifyRecordingHasBeenSuccessfullyProcessedForCase(caseData.caseReference);

  const powerAppPage = await newBrowserContextAndPage({ powerappUser: 'preLevel1User' });
  const powerAppPages = new PowerAppPages(powerAppPage, apiClient);

  try {
    await powerAppPages.homePage.goTo();
    await powerAppPages.homePage.verifyUserIsOnHomePage();
    await powerAppPages.homePage.$interactive.viewRecordingsButton.click();
    await powerAppPages.viewRecordingsPage.verifyUserIsOnViewRecordingsPage();
    await powerAppPages.viewRecordingsPage.shareRecordingWithUser(caseData.caseReference, config.portalUsers.preLevel3User.username);
  } finally {
    await powerAppPage.context().close();
  }

  return {
    caseData,
    recordingData: await apiClient.getRecordingData(),
  };
}
