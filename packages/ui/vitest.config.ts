import { resolve } from "node:path";
import { createVitestConfig } from "@portfolio/vitest-config";
import { defineConfig, mergeConfig } from "vitest/config";

export default defineConfig(
    mergeConfig(
        createVitestConfig({
            setupFiles: [resolve(__dirname, "../../tooling/vitest-config/src/setup-no-msw.ts")],
            test: {
                coverage: {
                    include: ["src/**/*.ts", "src/**/*.tsx"],
                    exclude: [
                        "dist/**",
                        "src/index.ts",
                        "**/*.test.ts",
                        "**/*.test.tsx",
                        "**/*.d.ts",
                        "**/*.stories.tsx",
                    ],
                },
            },
        }),
        {
            resolve: {
                alias: {
                    "@portfolio/ui": resolve(__dirname, "src"),
                },
            },
        },
    ),
);
