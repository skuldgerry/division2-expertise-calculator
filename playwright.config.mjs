import { defineConfig, devices } from "@playwright/test";

const origin = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173";

export default defineConfig({
  testDir: "./tests/browser",
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: `${origin}/division2-expertise-calculator/`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: "python3 -m http.server 4173 --bind 127.0.0.1 --directory dist",
    url: `${origin}/division2-expertise-calculator/`,
    reuseExistingServer: false,
  },
});
