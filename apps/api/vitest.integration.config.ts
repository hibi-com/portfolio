import { resolve } from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [
        tsconfigPaths({
            root: resolve(__dirname),
            projects: ["./tsconfig.json"],
        }) as any,
    ],
    resolve: {
        alias: {
            "~": resolve(__dirname, "./src"),
        },
    },
    test: {
        name: "integration",
        root: resolve(__dirname),
        include: ["integration/**/*.integration.test.ts"],
        exclude: ["**/node_modules/**", "**/dist/**", "**/build/**"],
        globals: true,
        environment: "node",
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
                    projectName: "api",
                    coverageDir: "../e2e/public/reports/coverage/api-integration",
                },
            ],
        ],
        setupFiles: [resolve(__dirname, "../../tooling/vitest-config/src/setup.ts")],
        coverage: {
            enabled: false,
        },
    },
});
