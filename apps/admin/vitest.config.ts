import { resolve } from "node:path";
import { createVitestConfig } from "@portfolio/vitest-config";

export default createVitestConfig({
    root: __dirname,
    tsconfigPath: "./tsconfig.json",
    testDir: "./app",
    coverageDir: "../e2e/public/reports/coverage/admin",
    projectName: "admin",
    setupFiles: [resolve(__dirname, "../../tooling/vitest-config/src/setup.ts")],
    additionalAliases: {
        "~": resolve(__dirname, "./app"),
    },
    test: {
        coverage: {
            include: ["app/**/*.ts", "app/**/*.tsx"],
            exclude: ["dist/**", "build/**", "app/routeTree.gen.ts", "**/*.test.ts", "**/*.test.tsx", "**/*.d.ts"],
        },
    },
});
