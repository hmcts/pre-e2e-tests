import { CommonConfig, ProjectsConfig } from '@hmcts/playwright-common';
import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...CommonConfig.recommended,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  timeout: 120_000,
    expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
  },
  use: { 
    ...CommonConfig.recommended.use,
    actionTimeout: 10_000 
  },
  projects: [
    {
      name: 'pre-power-app-setup',
      testMatch: 'global-pre-power-app-setup.ts',
    },
    {
      name: 'pre-power-app-teardown',
      testMatch: 'global-pre-power-app-teardown.ts',
    },
        {
      name: 'pre-portal-setup',
      testMatch: 'global-pre-portal-setup.ts',
    },
    {
      name: 'pre-portal-teardown',
      testMatch: 'global-pre-portal-teardown.ts',
    },
    {
      ...ProjectsConfig.chromium,
      name: 'Pre-Power-App-Chromium', // Chromium project for visual tests only for power app
      dependencies: ['pre-power-app-setup'],
      teardown: 'pre-power-app-teardown',
      testDir: 'playwright-e2e/tests/pre-power-app',
      snapshotDir: './playwright-e2e/snapshots/pre-power-app',
      testMatch: ['**/*visual*.spec.ts'],
      use: {
        ...ProjectsConfig.chromium.use,
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
      },
    },
    {
      ...ProjectsConfig.edge,
      name: 'Pre-Power-App-Edge', // Edge project for all tests besides visual tests for power app
      dependencies: ['pre-power-app-setup'],
      teardown: 'pre-power-app-teardown',
      testDir: 'playwright-e2e/tests/pre-power-app',
      testIgnore: ['**/*visual*.spec.ts'],
      use: {
        ...ProjectsConfig.edge.use,
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
        launchOptions: {
          args: [
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
          ],
        },         
      },
    },  
    {
      ...ProjectsConfig.edge,
      name: 'Pre-Portal-Edge', // Edge project for all tests besides visual tests for portal
      dependencies: ['pre-portal-setup'],
      teardown: 'pre-portal-teardown',
      testDir: 'playwright-e2e/tests/pre-portal',
      testIgnore: ['**/*visual*.spec.ts'],
      use: {
        ...ProjectsConfig.edge.use,        
      },
    },  
    {
      ...ProjectsConfig.chromium,
      name: 'Pre-Portal-Chromium', // Chromium project for visual tests only for portal
      dependencies: ['pre-portal-setup'],
      teardown: 'pre-portal-teardown',
      testDir: 'playwright-e2e/tests/pre-portal',
      snapshotDir: './playwright-e2e/snapshots/pre-portal',
      testMatch: ['**/*visual*.spec.ts'],
      use: {
        ...ProjectsConfig.chromium.use,
      },
    },         
  ],
});
