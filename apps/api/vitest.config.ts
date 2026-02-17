import { resolve } from "node:path";
import { createVitestConfig } from "@portfolio/vitest-config";

export default createVitestConfig({
    root: __dirname,
    tsconfigPath: "./tsconfig.json",
    testDir: "./src",
    coverageDir: "../e2e/public/reports/coverage/api",
    projectName: "api",
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
            exclude: [
                "dist/**",
                "src/index.ts",
                "**/*.test.ts",
                "**/*.d.ts",
            ],
        },
    },
});
