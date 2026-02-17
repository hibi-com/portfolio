import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        name: "integration",
        include: ["integration/**/*.integration.test.{ts,tsx}"],
        environment: "jsdom",
        globals: true,
        testTimeout: 30000,
        setupFiles: [resolve(__dirname, "../../tooling/vitest-config/src/setup.ts")],
        coverage: {
            exclude: ["node_modules/**", "integration/**", "e2e/**", "**/*.config.{ts,js}"],
            reporter: ["lcov", "json-summary"],
            reportsDirectory: "./coverage/integration",
        },
    },
});
