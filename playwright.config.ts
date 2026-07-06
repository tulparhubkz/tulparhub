import { defineConfig, devices } from '@playwright/test'

// Read-only smoke of the money path at phone width (the team's 375px rule).
// Needs DATABASE_URL (the catalog is DB-backed) — locally that's .env, in CI
// the e2e workflow provides it from secrets and skips when absent.
export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: { ...devices['iPhone 12'], defaultBrowserType: 'chromium' },
    },
  ],
  webServer: {
    command: 'yarn start',
    url: 'http://localhost:3000/api/health',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
})
