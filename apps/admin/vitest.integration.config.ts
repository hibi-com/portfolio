import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths({
            root: resolve(__dirname),
            projects: ["./tsconfig.json"],
        }) as any,
    ],
    resolve: {
        alias: {
            "~": resolve(__dirname, "./app"),
        },
    },
    test: {
        name: "integration",
        root: resolve(__dirname),
        include: ["integration/**/*.integration.test.{ts,tsx}"],
        exclude: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/functions/**", "**/public/**"],
        globals: true,
        environment: "jsdom",
        testTimeout: 30000,
        hookTimeout: 30000,
        teardownTimeout: 10000,
        pool: "forks",
        poolOptions: {
            forks: {
                singleFork: true,
            },
        },
        sequence: {
            shuffle: false,
        },
        reporters: [
            "default",
            [
                "@portfolio/vitest-reporter",
                {
                    outputDir: "../e2e/public/reports/integration",
                    projectName: "admin",
                    coverageDir: "../e2e/public/reports/coverage/admin-integration",
                },
            ],
        ],
        setupFiles: [resolve(__dirname, "../../tooling/vitest-config/src/setup-no-msw.ts")],
        coverage: {
            enabled: false,
        },
    },
});
