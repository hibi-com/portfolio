import { defineConfig, devices } from "@playwright/test";
import type { ReporterDescription } from "playwright/types/test";

const storybookURL = process.env.STORYBOOK_URL || "http://localhost:16011";

const storageType = process.env.STORAGE_TYPE || "local";
const reportOutputDir = process.env.STORYBOOK_REPORT_OUTPUT_DIR || "./public/reports/e2e/storybook";

const reporters: ReporterDescription[] =
    storageType === "local"
        ? [["html", { outputFolder: reportOutputDir }]]
        : [
              ["list"],
              ["html", { outputFolder: reportOutputDir }],
              ["json", { outputFile: `${reportOutputDir}/results.json` }],
          ];

export default defineConfig({
    testDir: "./e2e/storybook",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: reporters,
    use: {
        baseURL: storybookURL,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
