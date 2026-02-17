import { resolve } from "node:path";
import { createVitestConfig } from "@portfolio/vitest-config";

export default createVitestConfig({
    root: __dirname,
    tsconfigPath: "./tsconfig.json",
    testDir: "./app",
    coverageDir: "../e2e/public/reports/coverage/web",
    projectName: "web",
    additionalAliases: {
        "~": resolve(__dirname, "./app"),
    },
    test: {
        coverage: {
            include: ["app/**/*.ts", "app/**/*.tsx"],
            exclude: [
                "dist/**",
                "**/*.test.ts",
                "**/*.test.tsx",
                "**/*.d.ts",
                "**/*.stories.tsx",
            ],
        },
    },
});
