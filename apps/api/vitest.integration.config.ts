/**
 * Integration Test専用Vitest設定
 *
 * シーケンス図に基づく統合テスト用の設定
 * テストDB接続を有効にし、外部サービスはモック化
 */

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
        exclude: ["**/node_modules/**", "**/dist/**"],
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
                    outputDir: "../wiki/reports/test",
                    projectName: "api-integration",
                    coverageDir: "../wiki/reports/test/api-integration",
                },
            ],
        ],
        coverage: {
            enabled: false,
        },
    },
});
