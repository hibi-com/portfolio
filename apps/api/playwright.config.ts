import { createPlaywrightConfig } from "@portfolio/playwright-config";
import "dotenv/config";

function getPortFromBaseUrl(baseUrl: string): string {
    try {
        const url = new URL(baseUrl);
        return url.port || "8787";
    } catch {
        return "8787";
    }
}

const isRemoteEnv = !!process.env.BASE_URL;
const baseUrl = process.env.BASE_URL ?? process.env.VITE_API_URL ?? "http://localhost:8787";
const PORT = getPortFromBaseUrl(baseUrl);

export default createPlaywrightConfig({
    testDir: "./e2e",
    outputDir: "./.results/playwright",
    baseURL: isRemoteEnv ? baseUrl : `http://localhost:${PORT}`,
    port: PORT,
    webServerCommand: isRemoteEnv ? undefined : process.env.CI ? "bun run start" : "bun run dev",
    reportOutputDir: "../e2e/public/reports/e2e/api",
    projectName: "api",
    projects: [
        {
            name: "chromium",
            use: {},
        },
    ],
});
