import { createVitestConfig } from "@portfolio/vitest-config";

export default createVitestConfig({
    test: {
        environment: "node",
        pool: "forks",
        coverage: {
            exclude: [
                ".cache/**",
                "node_modules/**",
                "public/**",
                "docs/**",
                "generated/**",
                "**/*.test.{ts,tsx}",
                "**/*.spec.{ts,tsx}",
                "**/*.config.{ts,js}",
            ],
        },
    },
});
