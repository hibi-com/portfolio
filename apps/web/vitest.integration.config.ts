import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        name: "integration",
        include: ["integration/**/*.integration.test.{ts,tsx}"],
        environment: "jsdom",
        globals: true,
        testTimeout: 30000,
        setupFiles: ["./testing/vitest/setup.ts"],
        coverage: {
            exclude: [
                "node_modules/**",
                "integration/**",
                "e2e/**",
                "**/*.config.{ts,js}",
            ],
            reporter: ["lcov", "json-summary"],
            reportsDirectory: "./coverage/integration",
        },
    },
});
