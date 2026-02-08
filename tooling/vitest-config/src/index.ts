import os from "node:os";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

const cpuCount = os.cpus().length;
const totalMem = os.totalmem() / 1024 ** 3;

const isCI = !!process.env.CI;
const safeConcurrency = isCI || totalMem <= 8 ? 2 : Math.max(1, Math.floor(cpuCount / 2));

export interface VitestConfigOptions {
    root?: string;
    tsconfigPath?: string;
    setupFiles?: string[];
    testDir?: string;
    coverageDir?: string;
    additionalAliases?: Record<string, string>;
    projectName?: string;
    test?: Record<string, any>;
    includeReact?: boolean;
}

export function createVitestConfig(options: VitestConfigOptions = {}) {
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

    const environment = testOverrides.environment ?? "jsdom";
    const shouldIncludeReact = explicitIncludeReact ?? (environment !== "node" && environment !== "miniflare");

    const plugins = [];
    if (shouldIncludeReact) {
        plugins.push(react() as any);
    }
    plugins.push(
        tsconfigPaths({
            root,
            projects: tsconfigPath ? [tsconfigPath] : undefined,
        }) as any,
    );

    return {
        plugins,
        resolve: {
            alias: {
                ...additionalAliases,
            },
        },
        optimizeDeps: {
            disabled: true,
        },
        test: {
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
                    branches: 100, // MC/DC準拠: すべての条件分岐を網羅
                    statements: 90,
                },
                poolOptions: {
                    threads: {
                        maxThreads: safeConcurrency,
                        minThreads: 1,
                    },
                },
                isolate: totalMem > 16,
            },
            reporters: options.projectName
                ? [
                      "default",
                      [
                          "@portfolio/vitest-reporter",
                          { outputDir: "../apps/wiki/reports/test", projectName: options.projectName, coverageDir },
                      ],
                  ]
                : ["default"],
            globals: true,
            environment: "jsdom",
            include: [`${testDir}/**/*.test.{ts,tsx}`],
            setupFiles,
            testTimeout: 10000,
            passWithNoTests: true,
            fileParallelism: true,
            isolate: true,
            pool: "threads",
            poolOptions: {
                threads: {
                    singleThread: false,
                },
            },
            deps: {
                inline: ["@portfolio/**"],
                optimizer: {
                    web: {
                        enabled: false,
                    },
                    ssr: {
                        enabled: false,
                    },
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
