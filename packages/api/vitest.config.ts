import { createVitestConfig } from "@portfolio/vitest-config";

export default createVitestConfig({
    test: {
        environment: "node",
        coverage: {
            include: ["src/**/*.ts"],
            exclude: ["dist/**", "generated/**", "src/index.ts", "**/*.test.ts", "**/*.d.ts"],
        },
    },
});
