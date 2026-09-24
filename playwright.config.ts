import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  // Exercise the production server so mounted-filesystem dev compilation cannot
  // race route assertions or abort in-flight navigations.
  expect: { timeout: 15_000 },
  use: { baseURL: "http://127.0.0.1:3000", trace: "on-first-retry" },
  webServer: { command: "AUTH_MODE=mock npm run build && AUTH_MODE=mock node_modules/.bin/next start", url: "http://127.0.0.1:3000", reuseExistingServer: !process.env.CI, timeout: 180_000 },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }, { name: "mobile", use: { ...devices["Pixel 7"] } }],
});
