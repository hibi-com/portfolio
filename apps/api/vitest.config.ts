import { resolve } from "node:path";
import { createVitestConfig } from "@portfolio/vitest-config";

export default createVitestConfig({
    root: __dirname,
    tsconfigPath: "./tsconfig.json",
    testDir: "./app",
    coverageDir: "../e2e/public/reports/coverage/api",
    projectName: "api",
    setupFiles: [resolve(__dirname, "../../tooling/vitest-config/src/setup.ts")],
    additionalAliases: {
        "~": resolve(__dirname, "./src"),
    },
    test: {
        environment: "miniflare",
        environmentOptions: {
            bindings: {
                DB: {},
            },
        },
        coverage: {
            include: ["src/**/*.ts"],
            exclude: ["dist/**", "build/**", "**/*.test.ts", "**/*.d.ts"],
        },
    },
});
