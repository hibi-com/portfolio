import { resolve } from "node:path";
import { createVitestConfig } from "@portfolio/vitest-config";

export default createVitestConfig({
    root: __dirname,
    tsconfigPath: "./tsconfig.json",
    testDir: "./src",
    coverageDir: "../scenario/public/reports/coverage/api",
    projectName: "api",
    setupFiles: [resolve(__dirname, "../../tooling/vitest-config/src/setup-api.ts")],
    additionalAliases: {
        "~": resolve(__dirname, "./src"),
    },
    test: {
        environment: "node",
        coverage: {
            include: ["src/**/*.ts"],
            exclude: ["dist/**", "build/**", "**/*.test.ts", "**/*.d.ts"],
        },
    },
});
