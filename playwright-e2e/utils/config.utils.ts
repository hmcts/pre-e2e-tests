import path from 'path';
import fs from 'fs';

export interface UserCredentials {
  username: string;
  password: string;
}

interface cvpUserCredentials extends UserCredentials {
  serviceId: string;
  locationCode: string;
  cvpConferenceUser: string;
}

interface powerAppUserData {
  sessionFile: string;
  cookieName?: string;
  userId: string;
  x_userId: string;
  defaultCourtId: string;
  userDataFile: string;
}

interface portalUserData {
  sessionFile: string;
  cookieName?: string;
}

interface Urls {
  prePowerAppUrl: string;
  prePowerAppApiUrl: string;
  cvpSettingsUrl: string;
  cvpConferenceUrl: string;
  prePortalUrl: string;
}

export interface Config {
  powerAppUsers: {
    preLevel1User: UserCredentials & powerAppUserData;
  };
  portalUsers: {
    preLevel3User: UserCredentials & portalUserData;
    preSuperUser: UserCredentials & portalUserData;
  };
  cvpUser: cvpUserCredentials;
  urls: Urls;
}

export const config: Config = {
  powerAppUsers: {
    preLevel1User: {
      username: getEnvVar('PRE_LEVEL_1_USER_EMAIL'),
      password: getEnvVar('PRE_LEVEL_1_USER_PASSWORD'),
      sessionFile: pathToFile('.sessions/powerApp/', `${getEnvVar('PRE_LEVEL_1_USER_EMAIL')}.json`),
      userDataFile: pathToFile('.dynamic/powerApp/', `${getEnvVar('PRE_LEVEL_1_USER_EMAIL')}.json`),
      userId: getDynamicUserData(pathToFile('.dynamic/powerApp/', `${getEnvVar('PRE_LEVEL_1_USER_EMAIL')}.json`)).userId,
      x_userId: getDynamicUserData(pathToFile('.dynamic/powerApp/', `${getEnvVar('PRE_LEVEL_1_USER_EMAIL')}.json`)).x_userId,
      defaultCourtId: getDynamicUserData(pathToFile('.dynamic/powerApp/', `${getEnvVar('PRE_LEVEL_1_USER_EMAIL')}.json`)).defaultCourtId,
    },
  },
  portalUsers: {
    preLevel3User: {
      username: getEnvVar('PRE_LEVEL_3_USER_EMAIL'),
      password: getEnvVar('PRE_LEVEL_3_USER_PASSWORD'),
      sessionFile: pathToFile('.sessions/portal/', `${getEnvVar('PRE_LEVEL_3_USER_EMAIL')}.json`),
    },
    preSuperUser: {
      username: getEnvVar('PRE_SUPER_USER_EMAIL'),
      password: getEnvVar('PRE_SUPER_USER_PASSWORD'),
      sessionFile: pathToFile('.sessions/portal/', `${getEnvVar('PRE_SUPER_USER_EMAIL')}.json`),
    },
  },

  cvpUser: {
    username: getEnvVar('CVP_USER_EMAIL'),
    password: getEnvVar('CVP_USER_PASSWORD'),
    cvpConferenceUser: getEnvVar('CVP_CONFERENCE_USER_EMAIL'),
    serviceId: getEnvVar('CVP_SERVICE_ID'),
    locationCode: getEnvVar('CVP_LOCATION_CODE'),
  },
  urls: {
    prePowerAppUrl: getEnvVar('PRE_POWER_APP_URL'),
    prePowerAppApiUrl: getEnvVar('PRE_POWER_APP_API_URL'),
    cvpSettingsUrl: getEnvVar('CVP_SETTINGS_BASE_URL'),
    cvpConferenceUrl: getEnvVar('CVP_CONFERENCE_BASE_URL'),
    prePortalUrl: getEnvVar('PRE_PORTAL_URL'),
  },
};

/**
 * Retrieves an environment variable by name.
 * @param name - The name of the environment variable to retrieve.
 * @returns The value of the environment variable.
 * @throws Will throw an error if the environment variable is not set.
 */
export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (process.env.CI === 'true' && !value) {
    return ''; // Not all env variables required for certian CI jobs for example portal specific variables not required for power app tests
  } else if (!value) {
    throw new Error(`Error: ${name} environment variable is not set`);
  }
  return value;
}

/**
 * Reads the user ID and court ID from a JSON file.
 * If the file does not exist, it returns empty strings for both IDs.
 * @param pathToConfig - The path to the configuration file.
 * @returns An object containing userId and courtId.
 */
function getDynamicUserData(pathToConfig: string): { userId: string; x_userId: string; defaultCourtId: string } {
  const dynamicDataPath = pathToConfig;
  if (!fs.existsSync(dynamicDataPath)) {
    // File does not exist yet (e.g., first run before setup)
    return { userId: '', x_userId: '', defaultCourtId: '' };
  }
  const dynamicDataRaw = fs.readFileSync(dynamicDataPath, 'utf-8');
  const parsed = JSON.parse(dynamicDataRaw);
  return {
    userId: parsed.userId,
    x_userId: parsed.x_userId,
    defaultCourtId: parsed.defaultCourtId,
  };
}

/**
 * Constructs a path to a configuration file based on the expected path and the name of the file.
 * @param expectedPath - The relative path within the playwright-e2e folder.
 * @param nameOfFile - The name of the configuration file.
 * @returns The full path to the configuration file.
 * @throws Will throw an error if either expectedPath or nameOfFile is not provided.
 */
function pathToFile(expectedPath: string, nameOfFile: string): string {
  if (!expectedPath || !nameOfFile) {
    throw new Error('Folder path or name of file is not set');
  }

  const projectRoot = process.cwd();
  return path.join(projectRoot, './playwright-e2e/', expectedPath, nameOfFile);
}
