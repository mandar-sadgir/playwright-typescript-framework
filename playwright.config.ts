import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config();
const baseURL = process.env.BASE_URL;
if (!baseURL) {
  throw new Error('BASE_URL environment variable is not defined.');
}
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });
const headless = process.env.HEADLESS === 'true';
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  outputDir: 'test-results',
  /* Global setup generates the auth token */
  // globalSetup: './global-setup.ts',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : 1,
  timeout: 120_000,            // remote browsers are slower
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['allure-playwright'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: baseURL,
    browserName: 'chromium',							//Browser engine (chromium, firefox, webkit)
    channel: 'chrome',									  //Uses a specific installed browser (for example, Chrome or Edge)
    headless,
    viewport: headless ? { width: 1280, height: 720 }: null,  //Browser window size
    acceptDownloads: true,								//Enables file downloads
    actionTimeout: 30_000,                //Timeout for actions like click() and fill(). remote latency is higher
    navigationTimeout: 60_000,            //Timeout for page navigation
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    launchOptions: {									    //Additional browser launch settings
      args: [
        // '--start-maximized',
        '--window-size=1280,720',
        '--disable-extensions'
      ],
      slowMo: 0,
    },
  },

  expect: {
    timeout: 15_000,
  },
  
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /.*auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
       },
      dependencies: ['setup'],
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
