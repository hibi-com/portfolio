import { defineConfig, devices } from "@playwright/test";

const storybookURL = process.env.STORYBOOK_URL || "http://localhost:16011";

export default defineConfig({
    testDir: "./e2e/storybook",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [["html", { outputFolder: "../../docs/storybook/report" }]],
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
