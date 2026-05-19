import path from 'path';
import fs from 'fs';
import { Page, expect } from '@playwright/test';
import { PowerAppHomePage } from '../page-objects/pre-power-app/pages';

export class NetworkInterceptUtils {
  constructor(public readonly page: Page) {}
  private homePage = new PowerAppHomePage(this.page);

  /**
   * Intercepts the network response for the user data and stores it in a specified file.
   * This method waits for a response from the Power App API that contains user and court information.
   * If the response is not received within the specified timeout, an error is thrown.
   * @param pathToFile - The path to the file where user data will be stored.
   */
  public async interceptAndStoreUserDataUponLogin(pathToFile: string): Promise<void> {
    const timeoutMs = 60000;

    let userId: string | undefined;
    let x_userId: string | undefined;
    let defaultCourtId: string | undefined;

    await expect
      .poll(
        async () => {
          await this.homePage.provideConsentToStreamingManagerIfPrompted();
          const response = await this.page
            .waitForResponse(
              (res) => res.url().includes('environment.api.powerplatform.com/connectors/runtime/invoke') && res.request().method() === 'GET',
              { timeout: 5000 },
            )
            .catch(() => null);

          if (!response) return false;

          try {
            const responseBody = await response.json();
            userId = responseBody?.user?.id;
            x_userId = responseBody?.app_access?.[0]?.id;

            if (Array.isArray(responseBody.app_access)) {
              for (const access of responseBody.app_access) {
                if (access.default_court === true) {
                  defaultCourtId = access.court?.id;
                  break;
                }
              }
            }
          } catch (err) {
            console.warn('Failed to parse response body:', err);
            return false;
          }

          return !!userId && !!x_userId && !!defaultCourtId;
        },
        {
          timeout: timeoutMs,
          message: `Timeout: Did not find valid /invoke response with default court within ${timeoutMs / 1000} seconds.`,
        },
      )
      .toBeTruthy();

    const dir = path.dirname(pathToFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(pathToFile, JSON.stringify({ userId, x_userId, defaultCourtId }));
  }

  /**
   * Intercepts a network request to verify that a recording is taking place for a specific case reference.
   * It waits for a response from the Power App API and checks if the response body contains the expected case reference
   * and that the status is 'RECORDING'. If the expected response is not received within the specified timeout, an error is thrown.
   * @param caseReference - The case reference to verify in the response.
   * @param timeoutMs - The maximum time to wait for the expected response.
   */
  public async interceptNetworkRequestToVerifyRecordingIsTakingPlace(caseReference: string, timeoutMs: number): Promise<void> {
    await expect
      .poll(
        async () => {
          const response = await this.page
            .waitForResponse((res) => res.url().includes('/invoke') && res.request().method() === 'POST', { timeout: 5000 })
            .catch(() => null);

          if (!response) return false;

          try {
            const body = await response.json();

            const hasExpectedReference = body?.case_dto?.reference === caseReference;
            const isRecording = body?.capture_sessions?.[0]?.status === 'RECORDING';

            return hasExpectedReference && isRecording;
          } catch (err) {
            console.warn('Error parsing JSON response:', err);
            return false;
          }
        },
        {
          timeout: timeoutMs,
          message: `Timeout: Expected POST /invoke response with 'RECORDING' status and reference '${caseReference}' within ${timeoutMs / 1000} seconds in order to confirm recording is taking place in powerapps.`,
        },
      )
      .toBeTruthy();
  }

  /**
   * Intercepts a network request to verify that a video stream is being received from MediaKind.
   * It waits for a GET request to a URL containing 'streaming.mediakind' and 'video'.
   * If the expected request is not received within the specified timeout, an error is thrown.
   * @param timeoutMs - The maximum time to wait for the expected request.
   */
  public async interceptNetworkRequestToVerifyVideoStreamIsReceivedFromMediaKind(timeoutMs: number, pageContext?: Page): Promise<void> {
    const activePage = pageContext ?? this.page;

    await expect
      .poll(
        async () => {
          const response = await activePage
            .waitForResponse((res) => res.request().method() === 'GET' && res.url().includes('streaming.mediakind') && res.url().includes('video'), {
              timeout: 5000,
            })
            .catch(() => null);

          if (!response) return false;

          return true;
        },
        {
          timeout: timeoutMs,
          message: `Timeout: Expected GET request to URL containing 'streaming.mediakind' and 'video' within ${timeoutMs / 1000} seconds.`,
        },
      )
      .toBeTruthy();
  }

  /**
   * Intercepts a network request to verify that an audio stream is being received from MediaKind.
   * It waits for a GET request to a URL containing 'streaming.mediakind' and 'audio'.
   * If the expected request is not received within the specified timeout, an error is thrown.
   * @param timeoutMs - The maximum time to wait for the expected request.
   */
  public async interceptNetworkRequestToVerifyAudioStreamIsReceivedFromMediaKind(timeoutMs: number, pageContext?: Page): Promise<void> {
    const activePage = pageContext ?? this.page;

    await expect
      .poll(
        async () => {
          const response = await activePage
            .waitForResponse((res) => res.request().method() === 'GET' && res.url().includes('streaming.mediakind') && res.url().includes('audio'), {
              timeout: 5000,
            })
            .catch(() => null);

          if (!response) return false;

          return true;
        },
        {
          timeout: timeoutMs,
          message: `Timeout: Expected GET request to URL containing 'streaming.mediakind' and 'audio' within ${timeoutMs / 1000} seconds.`,
        },
      )
      .toBeTruthy();
  }

  /**
   * Intercepts a network request to verify that a Clear Key request is successful.
   * It waits for a GET request to a URL containing 'clear-key'.
   * If the expected request is not received within the specified timeout, an error is thrown.
   * @param timeoutMs - The maximum time to wait for the expected request.
   */
  public async interceptNetworkRequestToVerifyClearKeyRequestIsSuccessful(timeoutMs: number, pageContext?: Page): Promise<void> {
    const activePage = pageContext ?? this.page;

    await expect
      .poll(
        async () => {
          const response = await activePage
            .waitForResponse((res) => res.request().method() === 'GET' && res.url().includes('clear-key'), {
              timeout: 5000,
            })
            .catch(() => null);

          if (!response) return false;

          return true;
        },
        {
          timeout: timeoutMs,
          message: `Timeout: Expected GET request to URL containing 'clear-key' within ${timeoutMs / 1000} seconds.`,
        },
      )
      .toBeTruthy();
  }
}
