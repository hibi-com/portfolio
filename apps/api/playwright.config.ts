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

const reportOutputDir = process.env.REPORT_OUTPUT_DIR || "../scenario/public/reports/e2e/api";

let webServerCommand: string | undefined;
if (isRemoteEnv) {
    webServerCommand = undefined;
} else {
    // cms は Pages の start ではなく wrangler dev で待ち受ける
    webServerCommand = "bun run dev";
}
export default createPlaywrightConfig({
    testDir: "./e2e",
    outputDir: "./.results/playwright",
    baseURL: isRemoteEnv ? baseUrl : `http://localhost:${PORT}`,
    port: PORT,
    webServerCommand,
    reportOutputDir,
    projectName: "api",
    projects: [
        {
            name: "chromium",
            use: {},
        },
    ],
});
