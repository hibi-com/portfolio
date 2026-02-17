import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL || "http://localhost:24000";

const storageType = process.env.STORAGE_TYPE || "local";
const reportOutputDir = process.env.REPORT_OUTPUT_DIR || "./public/reports/e2e/portal";

const reporters: ("list" | ["html" | "json", { outputFolder?: string; outputFile?: string }])[] =
    storageType === "local"
        ? [["html", { outputFolder: reportOutputDir }]]
        : [
              "list",
              ["html", { outputFolder: reportOutputDir }],
              ["json", { outputFile: `${reportOutputDir}/results.json` }],
          ];

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: reporters,
    use: {
        baseURL,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
        },
        {
            name: "mobile-chrome",
            use: { ...devices["Pixel 5"] },
        },
        {
            name: "mobile-safari",
            use: { ...devices["iPhone 12"] },
        },
    ],
});
