import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { BookingDetails, CreatedCaseSummary, RecordingDetails } from '../types';
import {
  CreateNewCaseApi,
  CreateBookingApi,
  GetCaseDetailsByCaseReferenceApi,
  CreateOrUpdateCaptureSessionApi,
  GetRecordingDetailsAtRandomApi,
  GetRecordingDetailsByCaseRefApi,
  CreateOrUpdateRecordingApi,
  GetBookingDetailsByCaseReferenceApi,
  DeleteCaseApi,
} from './index.js';

export class ApiClient {
  private caseData?: CreatedCaseSummary;
  private bookingData?: BookingDetails;
  private recordingData?: RecordingDetails;

  private createNewCaseApi: CreateNewCaseApi;
  private createBookingApi: CreateBookingApi;
  private createOrUpdateCaptureSessionApi: CreateOrUpdateCaptureSessionApi;
  private createOrUpdateRecordingApi: CreateOrUpdateRecordingApi;
  private getCaseDetailsByCaseReferenceApi: GetCaseDetailsByCaseReferenceApi;
  private geRecordingDetailsAtRandomApi: GetRecordingDetailsAtRandomApi;
  private getRecordingDetailsByCaseRefApi: GetRecordingDetailsByCaseRefApi;
  private getBookingDetailsByCaseReferenceApi: GetBookingDetailsByCaseReferenceApi;
  private deleteCaseApi: DeleteCaseApi;

  constructor(apiContext: APIRequestContext, userId: string, courtId: string) {
    this.createNewCaseApi = new CreateNewCaseApi(apiContext, courtId);
    this.createBookingApi = new CreateBookingApi(apiContext);
    this.createOrUpdateCaptureSessionApi = new CreateOrUpdateCaptureSessionApi(apiContext, userId);
    this.createOrUpdateRecordingApi = new CreateOrUpdateRecordingApi(apiContext);
    this.getCaseDetailsByCaseReferenceApi = new GetCaseDetailsByCaseReferenceApi(apiContext, courtId);
    this.geRecordingDetailsAtRandomApi = new GetRecordingDetailsAtRandomApi(apiContext);
    this.getRecordingDetailsByCaseRefApi = new GetRecordingDetailsByCaseRefApi(apiContext);
    this.getBookingDetailsByCaseReferenceApi = new GetBookingDetailsByCaseReferenceApi(apiContext, courtId);
    this.deleteCaseApi = new DeleteCaseApi(apiContext);
  }

  /**
   * Creates a new case using the provided number of defendants, and witnesses.
   * Stores the created case data internally and verifies the case has been created.
   * @param numberOfDefendants - Number of defendants for the case.
   * @param numberOfWitnesses - Number of witnesses for the case.
   * @returns The created case summary.
   */
  public async createCase(numberOfDefendants: number, numberOfWitnesses: number): Promise<CreatedCaseSummary> {
    const caseData: CreatedCaseSummary = await this.createNewCaseApi.request(numberOfDefendants, numberOfWitnesses);
    await this.verifyCaseHasBeenCreated(caseData.caseReference);
    this.caseData = caseData;
    return caseData;
  }

  /**
   * Polls the API to verify that a case with the given reference exists.
   * Throws an error if the case is not found within the timeout period.
   * @param caseReference - The reference of the case to verify.
   */
  public async verifyCaseHasBeenCreated(caseReference: string): Promise<void> {
    await expect
      .poll(
        async () => {
          const response = await this.getCaseDetailsByCaseReferenceApi.request(caseReference);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const caseDTOList = (response as any)?._embedded?.caseDTOList;
          return Array.isArray(caseDTOList) && caseDTOList.some((caseDTO) => caseDTO.reference === caseReference);
        },
        {
          timeout: 60000,
          intervals: [2000],
        },
      )
      .toBe(true);
  }

  /**
   * Creates a booking for an existing case using the provided witness and defendants.
   * Stores the created booking data internally.
   * @param caseId - The ID of the case for which the booking is being created.
   * @param witnessToSelectForCaseBooking - The witness details.
   * @param defendantsToAssignForCaseBooking - An array of defendant details.
   * @param scheduledFor - The date for which the recording is scheduled ('today' or 'tomorrow').
   * @returns The created booking details.
   */
  public async createBookingForAnExistingCase(
    caseId: string,
    witnessToSelectForCaseBooking: {
      first_name: string;
      last_name: string;
      id: string;
      participant_type: string;
    },
    defendantsToAssignForCaseBooking: {
      first_name: string;
      last_name: string;
      id: string;
      participant_type: string;
    }[],
    scheduledFor: 'today' | 'tomorrow',
  ): Promise<BookingDetails> {
    const bookingId = await this.createBookingApi.request(caseId, witnessToSelectForCaseBooking, defendantsToAssignForCaseBooking, scheduledFor);
    const bookingData: BookingDetails = {
      bookingId: bookingId,
      witnessSelectedForCaseRecording: witnessToSelectForCaseBooking.first_name,
    };
    this.bookingData = bookingData;
    return bookingData;
  }

  /**
   * Assigns a recording to a booking by creating and updating capture sessions and recordings.
   * Stores the created recording data internally.
   * @param bookingId - The ID of the booking to which the recording will be assigned.
   * @returns The created recording details.
   */
  public async assignRecordingToAnExistingBooking(bookingId: string): Promise<RecordingDetails> {
    // Create a capture session for the booking with status 'STANDBY'
    const captureSessionDetails = await this.createOrUpdateCaptureSessionApi.request(bookingId, 'STANDBY');
    // Retrieve the latest recording created by the test suite
    const recordingDetailsFetched = await this.geRecordingDetailsAtRandomApi.request();
    // Update the capture session with the recording details obtained from the latest recording
    await this.createOrUpdateRecordingApi.request(captureSessionDetails.captureSessionId, {
      recordingDuration: recordingDetailsFetched.recordingDuration,
      recordingFileName: recordingDetailsFetched.recordingFilename,
      recordingId: recordingDetailsFetched.recordingId,
    });
    // Complete the capture session with the recording details by setting the status to 'RECORDING_AVAILABLE'
    const captureSessionDetailsUponCompletion = await this.createOrUpdateCaptureSessionApi.request(
      bookingId,
      'RECORDING_AVAILABLE',
      captureSessionDetails.captureSessionId,
    );

    // Set the recording details with the correct format to be used in test assertions
    const sessionDate = new Date(captureSessionDetailsUponCompletion.sessionDateTime);
    const recordingData: RecordingDetails = {
      recordingId: recordingDetailsFetched.recordingId,
      recordingDate: sessionDate.toLocaleDateString('en-GB'),
      recordingTime: sessionDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      recordingDuration: await this.formatDuration(recordingDetailsFetched.recordingDuration),
    };
    this.recordingData = recordingData;
    return recordingData;
  }

  /**
   * Creates a new case and schedules a booking for it.
   * @param numberOfDefendants - Number of defendants for the case.
   * @param numberOfWitnesses - Number of witnesses for the case.
   * @param scheduledFor - The date for which the recording is scheduled ('today' or 'tomorrow').
   */
  public async createNewCaseAndScheduleABooking(
    numberOfDefendants: number,
    numberOfWitnesses: number,
    scheduledFor: 'today' | 'tomorrow',
  ): Promise<BookingDetails> {
    const caseData = await this.createCase(numberOfDefendants, numberOfWitnesses);
    const bookingData = await this.createBookingForAnExistingCase(
      caseData.caseId,
      caseData.participants.witnesses[0],
      caseData.participants.defendants,
      scheduledFor,
    );
    return bookingData;
  }
  /**
   * Creates a new case, booking, and assigns a recording to the booking.
   * @param numberOfDefendants - Number of defendants for the case.
   * @param numberOfWitnesses - Number of witnesses for the case.
   * @param dateOfRecording - The date for which the recording is scheduled ('today' or 'tomorrow').
   */
  public async createANewCaseAndAssignRecording(
    numberOfDefendants: number,
    numberOfWitnesses: number,
    dateOfRecording: 'today' | 'tomorrow',
  ): Promise<RecordingDetails> {
    const caseData = await this.createCase(numberOfDefendants, numberOfWitnesses);
    const bookingData = await this.createBookingForAnExistingCase(
      caseData.caseId,
      caseData.participants.witnesses[0],
      caseData.participants.defendants,
      dateOfRecording,
    );
    const recordingData = await this.assignRecordingToAnExistingBooking(bookingData.bookingId);
    return recordingData;
  }

  /**
   * Formats the recording duration from ISO 8601 format to HH:MM:SS.
   * @param duration - The duration string in ISO 8601 format (e.g., "PT1H30M45S").
   * @returns A promise that resolves to the formatted duration string.
   */
  private async formatDuration(duration: string): Promise<string> {
    const hoursMatch = duration.match(/(\d+)H/);
    const minutesMatch = duration.match(/(\d+)M/);
    const secondsMatch = duration.match(/(\d+(\.\d+)?)S/);

    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
    const seconds = secondsMatch ? Math.floor(parseFloat(secondsMatch[1])) : 0;

    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }

  public async getRecordingDetailsByCaseReferenceApi(caseReference: string): Promise<APIResponse> {
    return this.getRecordingDetailsByCaseRefApi.request(caseReference);
  }

  /**
   * Polls the booking details API to verify that the recording for the given case reference
   * has been successfully processed. It checks the status of the capture session relating to the case,
   * and waits until the status becomes 'RECORDING_AVAILABLE'. If the status is 'FAILURE', or if no
   * status is found, it throws an error. The polling will timeout after 30 seconds if the expected
   * status is not reached.
   * @param caseReference - The reference of the case to check for recording processing status.
   */
  public async verifyRecordingHasBeenSuccessfullyProcessedForCase(caseReference: string) {
    await expect.poll(
      async () => {
        const response = await this.getBookingDetailsByCaseReferenceApi.request(caseReference);
        const responseBody = await response.json();

        const status = responseBody?._embedded?.bookingDTOList?.[0]?.capture_sessions?.[0]?.status;

        if (!status) {
          throw new Error(
            `No recording status found for case: ${caseReference} whilst trying to establish recording has been processed successfully.`,
          );
        } else if (status === 'FAILURE') {
          throw new Error(
            `Recording processing has failed for case: ${caseReference}, status of recording is: ${status}. Please check available logs for more details.`,
          );
        } else {
          return status;
        }
      },
      { timeout: 30_000, intervals: [2_000] },
    );
    const status = (await (await this.getBookingDetailsByCaseReferenceApi.request(caseReference)).json())?._embedded?.bookingDTOList?.[0]
      ?.capture_sessions?.[0]?.status;
    expect(status).toBe('RECORDING_AVAILABLE');
  }

  /**
   * Deletes a case by its case ID using the DeleteCaseApi.
   * @param caseId - The ID of the case to delete.
   */
  public async deleteCaseByCaseId(caseId: string): Promise<void> {
    await this.deleteCaseApi.request(caseId);
  }

  /**
   * Returns the most recently created case data.
   * Throws an error if no case data is available.
   * @returns The last created case summary.
   */
  public async getCaseData(): Promise<CreatedCaseSummary> {
    if (!this.caseData) {
      throw new Error('No case data available. Please create a case first.');
    }
    return this.caseData;
  }

  /**
   * Returns the most recently created booking data.
   * Throws an error if no booking data is available.
   * @returns The last created booking details.
   */
  public async getBookingData(): Promise<BookingDetails> {
    if (!this.bookingData) {
      throw new Error('No booking data available. Please create a booking first.');
    }
    return this.bookingData;
  }

  /**
   * Returns the most recently created recording data.
   * Throws an error if no recording data is available.
   * @returns The last created recording details.
   */
  public async getRecordingData(): Promise<RecordingDetails> {
    if (!this.recordingData) {
      throw new Error('No recording data available. Please create a recording first.');
    }
    return this.recordingData;
  }
}
