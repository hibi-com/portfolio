/**
 * Medium Test専用Vitest設定
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
            root: resolve(__dirname, ".."),
            projects: ["../tsconfig.json"],
        }) as any,
    ],
    resolve: {
        alias: {
            "~": resolve(__dirname, "../src"),
        },
    },
    test: {
        name: "medium",
        root: resolve(__dirname, ".."),
        include: ["tests/medium/**/*.medium.test.ts"],
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
                    outputDir: "../../apps/wiki/reports/test",
                    projectName: "api-medium",
                    coverageDir: "../../apps/wiki/reports/test/api-medium",
                },
            ],
        ],
        coverage: {
            enabled: false,
        },
    },
});
