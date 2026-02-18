import * as fs from "node:fs";
import * as path from "node:path";
import YAML from "yaml";

export interface AppConfig {
    name: string;
    type: "pages" | "worker";
    buildCommand?: string;
    outputDir?: string;
    watchDirs?: string[];
    main?: string;
    vars?: Record<string, string | boolean | number>;
}

interface EnvAppsSection {
    [appName: string]: {
        type?: "pages" | "worker";
        buildCommand?: string;
        outputDir?: string;
        watchDirs?: string[];
        main?: string;
        baseUrl?: string;
        betterAuthUrl?: string;
        vite?: {
            baseUrl?: string;
            sentry?: {
                environment?: string;
                tracesSampleRate?: string;
                replaySampleRate?: string;
                replayOnErrorSampleRate?: string;
            };
            analytics?: {
                googleAnalyticsEnabled?: string;
                googleTagManagerEnabled?: string;
            };
            debug?: {
                xstateInspectorEnabled?: string;
            };
        };
    };
}

interface EnvYamlForApps {
    general?: { nodeEnv?: string };
    apps?: EnvAppsSection;
}

function getEnvYamlPath(): string {
    const cwd = process.cwd();
    const tryPaths = [path.join(cwd, "env.yaml"), path.join(cwd, "..", "infra", "env.yaml")];
    for (const p of tryPaths) {
        if (fs.existsSync(p) && fs.statSync(p).isFile()) {
            return p;
        }
    }
    throw new Error(
        `env.yaml or env.example.yaml not found. Tried: ${tryPaths.join(", ")}. Run from infra directory or repo root.`,
    );
}

function parseEnvYaml(): EnvYamlForApps {
    const filePath = getEnvYamlPath();
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = YAML.parse(content) as EnvYamlForApps;
    return parsed ?? {};
}

function toBool(v: string | undefined): boolean {
    if (v === undefined) return false;
    return v === "true" || v === "1";
}

function buildVarsForApp(
    appName: string,
    app: EnvAppsSection[string],
    generalNodeEnv: string | undefined,
    domain: string,
): Record<string, string | boolean | number> {
    const nodeEnv = generalNodeEnv ?? "production";
    const baseUrl = app.baseUrl ?? `https://${domain}`;

    if (appName === "web") {
        const vite = app.vite;
        const sentry = vite?.sentry;
        const analytics = vite?.analytics;
        const debug = vite?.debug;
        return {
            NODE_ENV: nodeEnv,
            VITE_BASE_URL: vite?.baseUrl ?? baseUrl,
            VITE_GOOGLE_ANALYTICS_ENABLED: toBool(analytics?.googleAnalyticsEnabled),
            VITE_GOOGLE_TAG_MANAGER_ENABLED: toBool(analytics?.googleTagManagerEnabled),
            VITE_XSTATE_INSPECTOR_ENABLED: toBool(debug?.xstateInspectorEnabled),
            VITE_SENTRY_ENVIRONMENT: sentry?.environment ?? "production",
            VITE_SENTRY_TRACES_SAMPLE_RATE: sentry?.tracesSampleRate ?? "1",
            VITE_SENTRY_REPLAY_SAMPLE_RATE: sentry?.replaySampleRate ?? "0",
            VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE: sentry?.replayOnErrorSampleRate ?? "0",
        };
    }

    return { NODE_ENV: nodeEnv };
}

export function getAppsConfig(domain: string): AppConfig[] {
    const env = parseEnvYaml();
    const apps = env.apps ?? {};
    const generalNodeEnv = env.general?.nodeEnv;

    const result: AppConfig[] = [];
    const appNames = Object.keys(apps).filter((name) => apps[name]?.type);

    for (const name of appNames) {
        const app = apps[name];
        if (!app?.type) continue;

        const type = app.type === "worker" ? "worker" : "pages";
        result.push({
            name,
            type,
            buildCommand: app.buildCommand,
            outputDir: app.outputDir,
            watchDirs: app.watchDirs,
            main: app.main,
            vars: buildVarsForApp(name, app, generalNodeEnv, domain),
        });
    }

    return result;
}
