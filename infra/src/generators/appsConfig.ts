export interface AppConfig {
    name: string;
    type: "pages" | "worker";
    buildCommand?: string;
    outputDir?: string;
    watchDirs?: string[];
    main?: string;
    vars?: Record<string, string | boolean | number>;
}

export function getAppsConfig(domain: string): AppConfig[] {
    return [
        {
            name: "web",
            type: "pages",
            buildCommand: "bun run build:remix",
            outputDir: "build/client",
            watchDirs: ["app", "public", "functions"],
            vars: {
                NODE_ENV: "production",
                VITE_BASE_URL: `https://${domain}`,
                VITE_GOOGLE_ANALYTICS_ENABLED: true,
                VITE_GOOGLE_TAG_MANAGER_ENABLED: true,
                VITE_XSTATE_INSPECTOR_ENABLED: false,
                VITE_SENTRY_ENVIRONMENT: "production",
                VITE_SENTRY_TRACES_SAMPLE_RATE: "1",
                VITE_SENTRY_REPLAY_SAMPLE_RATE: "0",
                VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE: "0",
            },
        },
        {
            name: "api",
            type: "worker",
            main: "src/index.ts",
            vars: {
                NODE_ENV: "development",
            },
        },
        {
            name: "admin",
            type: "pages",
            outputDir: "./dist",
            vars: {
                NODE_ENV: "development",
            },
        },
        {
            name: "wiki",
            type: "pages",
            outputDir: "./dist",
            vars: {
                NODE_ENV: "development",
            },
        },
    ];
}
