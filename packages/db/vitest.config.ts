import { createVitestConfig } from "@portfolio/vitest-config";

export default createVitestConfig({
    test: {
        environment: "miniflare",
        environmentOptions: {
            bindings: {
                DB: {},
            },
        },
        coverage: {
            include: ["src/**/*.ts"],
            exclude: ["dist/**", "src/index.ts", "**/*.test.ts", "**/*.d.ts"],
        },
    },
});
