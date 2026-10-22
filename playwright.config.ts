import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

// Corre contra el build de producción: `npm run build` antes de `npm test`.
export default defineConfig({
  testDir: "tests",
  outputDir: "test-results",
  reporter: "list",
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    { name: "375", use: { ...devices["iPhone 13"], viewport: { width: 375, height: 667 }, browserName: "chromium" } },
    { name: "1440", use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
});
