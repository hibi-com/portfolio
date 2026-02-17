import os from "node:os";
import type { UserConfig } from "vite";
import type { InlineConfig } from "vitest/node";

const cpuCount = os.cpus().length;
const totalMemGB = os.totalmem() / 1024 ** 3;
const isCI = !!process.env.CI;

function calculateConcurrency(totalMem: number, cpus: number, ci: boolean): number {
    if (ci || totalMem <= 8) return 2;
    return Math.max(1, Math.floor(cpus / 2));
}

const safeConcurrency = calculateConcurrency(totalMemGB, cpuCount, isCI);

type VitestEnvironment = "node" | "jsdom" | "happy-dom" | "edge-runtime" | "miniflare" | string;

export interface VitestConfigOptions {
    root?: string;
    tsconfigPath?: string;
    setupFiles?: string[];
    testDir?: string;
    coverageDir?: string;
    additionalAliases?: Record<string, string>;
    projectName?: string;
    test?: Partial<InlineConfig>;
    includeReact?: boolean;
}

type VitestConfig = UserConfig & { test: InlineConfig };

export function createVitestConfig(options: VitestConfigOptions = {}): VitestConfig {
    const {
        root = process.cwd(),
        tsconfigPath,
        setupFiles = [],
        testDir = "./**",
        coverageDir = "./coverage",
        additionalAliases = {},
        test: testOverrides = {},
        includeReact: explicitIncludeReact,
    } = options;

    const environment: VitestEnvironment = (testOverrides?.environment as VitestEnvironment) ?? "jsdom";
    const isNonBrowserEnv = environment === "node" || environment === "miniflare";
    const shouldIncludeReact = explicitIncludeReact ?? !isNonBrowserEnv;

    const plugins: UserConfig["plugins"] = [];

    if (shouldIncludeReact) {
        const react = require("@vitejs/plugin-react").default;
        plugins.push(react());
    }

    const tsconfigPaths = require("vite-tsconfig-paths").default;
    plugins.push(
        tsconfigPaths({
            root,
            projects: tsconfigPath ? [tsconfigPath] : undefined,
        }),
    );

    const reporters: InlineConfig["reporters"] = options.projectName
        ? [
              "default",
              [
                  "@portfolio/vitest-reporter",
                  {
                      outputDir: "../e2e/public/reports/test",
                      projectName: options.projectName,
                      coverageDir,
                  },
              ],
          ]
        : ["default"];

    return {
        plugins,
        resolve: {
            alias: additionalAliases,
        },
        optimizeDeps: {
            disabled: true,
        },
        test: {
            globals: true,
            environment,
            include: [`${testDir}/**/*.test.{ts,tsx}`],
            setupFiles,
            testTimeout: 10000,
            passWithNoTests: true,
            fileParallelism: true,
            isolate: totalMemGB > 16,
            pool: "threads",
            poolOptions: {
                threads: {
                    singleThread: false,
                    maxThreads: safeConcurrency,
                    minThreads: 1,
                },
            },
            reporters,
            coverage: {
                exclude: [
                    ".cache/**",
                    "node_modules/**",
                    "public/**",
                    "docs/**",
                    "**/*.test.{ts,tsx}",
                    "**/*.spec.{ts,tsx}",
                    "**/*.config.{ts,js}",
                ],
                reporter: ["lcov", "json-summary"],
                reportsDirectory: coverageDir,
                thresholds: {
                    lines: 90,
                    functions: 90,
                    branches: 100,
                    statements: 90,
                },
            },
            deps: {
                inline: ["@portfolio/**"],
                optimizer: {
                    web: { enabled: false },
                    ssr: { enabled: false },
                },
            },
            server: {
                deps: {
                    inline: ["@portfolio/**"],
                },
            },
            ...testOverrides,
        },
    };
}
