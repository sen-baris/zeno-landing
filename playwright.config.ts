import { defineConfig, devices } from '@playwright/test';

const playwrightPort = Number(process.env.E2E_PORT ?? 4321);
const playwrightBaseUrl = `http://127.0.0.1:${playwrightPort}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: playwrightBaseUrl,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: /visual\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: /visual\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: `ASTRO_DEV_BACKGROUND=0 NODE_ENV=development PUBLIC_LEAD_ADAPTER=gateway PUBLIC_LEAD_ENDPOINT=/api/leads astro dev --host 127.0.0.1 --port ${playwrightPort} --mode development --force`,
    url: playwrightBaseUrl,
    reuseExistingServer: !process.env.CI,
  },
});
