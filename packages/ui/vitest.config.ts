import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createVitestConfig } from "@portfolio/vitest-config";
import { defineConfig, mergeConfig } from "vitest/config";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(
    mergeConfig(
        createVitestConfig({
            setupFiles: [resolve(__dirname, "../../tooling/vitest-config/src/setup.ts")],
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
                    "@portfolio/ui": `${__dirname}src`,
                },
            },
        },
    ),
);
