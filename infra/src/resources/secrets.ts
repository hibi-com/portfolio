import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as pulumi from "@pulumi/pulumi";
import * as doppler from "@pulumiverse/doppler";
import { getProjectName } from "../config.js";

export interface DopplerConfig {
    project: string;
    config: string;
}

export interface SecretKeys {
    DATABASE_URL: string;
    REDIS_URL?: string;
    CLOUDFLARE_API_TOKEN: string;
    CLOUDFLARE_ACCOUNT_ID: string;
    CLOUDFLARE_ZONE_ID: string;
    GRAFANA_API_KEY: string;
    GRAFANA_ORG_SLUG: string;
    SENTRY_AUTH_TOKEN: string;
    SENTRY_ORG: string;
    SENTRY_DSN?: string;
    REDISCLOUD_ACCESS_KEY: string;
    REDISCLOUD_SECRET_KEY: string;
    REDISCLOUD_SUBSCRIPTION_ID?: string;
    REDISCLOUD_DATABASE_ID?: string;
    BETTER_AUTH_SECRET?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    TIDBCLOUD_PUBLIC_KEY?: string;
    TIDBCLOUD_PRIVATE_KEY?: string;
}

export interface SecretsOutputs {
    secrets: Record<keyof SecretKeys, pulumi.Output<string>>;
    syncedSecrets: Record<string, doppler.Secret>;
}

export function getDopplerSecrets(dopplerConfig: DopplerConfig): SecretsOutputs {
    const secretKeys: (keyof SecretKeys)[] = [
        "DATABASE_URL",
        "REDIS_URL",
        "CLOUDFLARE_API_TOKEN",
        "CLOUDFLARE_ACCOUNT_ID",
        "CLOUDFLARE_ZONE_ID",
        "GRAFANA_API_KEY",
        "GRAFANA_ORG_SLUG",
        "SENTRY_AUTH_TOKEN",
        "SENTRY_ORG",
        "SENTRY_DSN",
        "REDISCLOUD_ACCESS_KEY",
        "REDISCLOUD_SECRET_KEY",
        "REDISCLOUD_SUBSCRIPTION_ID",
        "REDISCLOUD_DATABASE_ID",
        "BETTER_AUTH_SECRET",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "TIDBCLOUD_PUBLIC_KEY",
        "TIDBCLOUD_PRIVATE_KEY",
    ];

    const secrets: Record<string, pulumi.Output<string>> = {};
    const syncedSecrets: Record<string, doppler.Secret> = {};

    const dopplerSecrets = doppler.getSecretsOutput({
        project: dopplerConfig.project,
        config: dopplerConfig.config,
    });

    for (const key of secretKeys) {
        secrets[key] = dopplerSecrets.apply((s) => s.map[key] || "");
    }

    return {
        secrets: secrets as Record<keyof SecretKeys, pulumi.Output<string>>,
        syncedSecrets,
    };
}

export function getDopplerSecret(project: string, config: string, secretName: string): pulumi.Output<string> {
    const secrets = doppler.getSecretsOutput({
        project,
        config,
    });

    return secrets.apply((s) => s.map[secretName] || "");
}

export function getCloudflareEnvVars(secrets: SecretsOutputs["secrets"]): Record<string, pulumi.Output<string>> {
    return {
        DATABASE_URL: secrets.DATABASE_URL,
        REDIS_URL: secrets.REDIS_URL,
        NODE_ENV: pulumi.output("production"),
        SENTRY_DSN: secrets.SENTRY_DSN,
        BETTER_AUTH_SECRET: secrets.BETTER_AUTH_SECRET,
        GOOGLE_CLIENT_ID: secrets.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: secrets.GOOGLE_CLIENT_SECRET,
    };
}

export const DOPPLER_CLI_COMMANDS = {
    downloadEnv: "doppler secrets download --no-file --format env > .env",
    runDev: "doppler run -- bun run dev",
    runWithConfig: (project: string, config: string, command: string) =>
        `doppler run --project ${project} --config ${config} -- ${command}`,
};

export function createPortfolioDopplerConfig(environment: "rc" | "stg" | "prd"): DopplerConfig {
    const projectName = getProjectName();
    return {
        project: projectName,
        config: environment,
    };
}

export function getDopplerProjectStructure() {
    const projectName = getProjectName();
    return {
        project: projectName,
        configs: {
            rc: "開発環境",
            stg: "検証環境",
            prd: "本番環境",
        },
        secrets: [
            { name: "DATABASE_URL", description: "TiDB Cloud接続文字列" },
            { name: "TIDBCLOUD_PUBLIC_KEY", description: "TiDB Cloud APIパブリックキー" },
            { name: "TIDBCLOUD_PRIVATE_KEY", description: "TiDB Cloud APIプライベートキー" },
            { name: "REDIS_URL", description: "Redis Cloud接続文字列" },
            { name: "CLOUDFLARE_API_TOKEN", description: "Cloudflare APIトークン" },
            { name: "CLOUDFLARE_ACCOUNT_ID", description: "CloudflareアカウントID" },
            { name: "CLOUDFLARE_ZONE_ID", description: "CloudflareゾーンID" },
            { name: "REDISCLOUD_SUBSCRIPTION_ID", description: "Redis CloudサブスクリプションID（.envで管理）" },
            { name: "REDISCLOUD_DATABASE_ID", description: "Redis CloudデータベースID（.envで管理）" },
            { name: "GRAFANA_API_KEY", description: "Grafana Cloud APIキー" },
            { name: "GRAFANA_ORG_SLUG", description: "Grafana Cloud組織スラッグ" },
            { name: "SENTRY_AUTH_TOKEN", description: "Sentry認証トークン" },
            { name: "SENTRY_ORG", description: "Sentry組織スラッグ" },
            { name: "SENTRY_DSN", description: "Sentry DSN" },
            { name: "REDISCLOUD_ACCESS_KEY", description: "Redis Cloud Access Key" },
            { name: "REDISCLOUD_SECRET_KEY", description: "Redis Cloud Secret Key" },
            { name: "BETTER_AUTH_SECRET", description: "Better Auth シークレット" },
            { name: "GOOGLE_CLIENT_ID", description: "Google OAuth クライアントID" },
            { name: "GOOGLE_CLIENT_SECRET", description: "Google OAuth クライアントシークレット" },
            { name: "API_BASE_URL", description: "APIベースURL（DNS登録後に自動設定）" },
            { name: "APP_VERSION", description: "アプリケーションのバージョン" },
            { name: "BETTER_AUTH_URL", description: "Better Auth URL（DNS登録後に自動設定）" },
            { name: "VITE_BASE_URL", description: "ViteベースURL（DNS登録後に自動設定）" },
            { name: "VITE_GOOGLE_ANALYTICS_ENABLED", description: "Google Analytics有効化フラグ" },
            { name: "VITE_GOOGLE_TAG_MANAGER_ENABLED", description: "Google Tag Manager有効化フラグ" },
            { name: "VITE_SENTRY_ENVIRONMENT", description: "Vite用Sentry環境" },
            {
                name: "VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE",
                description: "Vite用Sentry Replay On Errorサンプルレート",
            },
            { name: "VITE_SENTRY_REPLAY_SAMPLE_RATE", description: "Vite用Sentry Replayサンプルレート" },
            { name: "VITE_SENTRY_TRACES_SAMPLE_RATE", description: "Vite用Sentry Tracesサンプルレート" },
            { name: "VITE_XSTATE_INSPECTOR_ENABLED", description: "XState Inspector有効化フラグ" },
        ],
    };
}

export const DOPPLER_PROJECT_STRUCTURE = getDopplerProjectStructure();

/** infra 専用の環境変数キー（environment.yaml で管理、.docker/secrets には載せない） */
export const INFRA_ONLY_ENV_KEYS = [
    "CLOUDFLARE_ACCOUNT_ID",
    "CLOUDFLARE_API_TOKEN",
    "CLOUDFLARE_ZONE_ID",
    "GRAFANA_API_KEY",
    "GRAFANA_ORG_SLUG",
    "REDISCLOUD_ACCESS_KEY",
    "REDISCLOUD_DATABASE_ID",
    "REDISCLOUD_SECRET_KEY",
    "REDISCLOUD_SUBSCRIPTION_ID",
    "SENTRY_AUTH_TOKEN",
    "TIDBCLOUD_PRIVATE_KEY",
    "TIDBCLOUD_PUBLIC_KEY",
] as const;

/** compose の secret ファイル名 → Doppler/環境変数キー（.docker/secrets のファイルのみ Doppler 同期対象。infra 専用は environment.yaml） */
export const COMPOSE_SECRET_KEY_MAP: Record<string, string> = {
    database_url: "DATABASE_URL",
    redis_url: "REDIS_URL",
    node_env: "NODE_ENV",
    api_base_url: "API_BASE_URL",
    better_auth_secret: "BETTER_AUTH_SECRET",
    better_auth_url: "BETTER_AUTH_URL",
    google_client_id: "GOOGLE_CLIENT_ID",
    google_client_secret: "GOOGLE_CLIENT_SECRET",
    vite_base_url: "VITE_BASE_URL",
    sentry_dsn: "SENTRY_DSN",
    sentry_org: "SENTRY_ORG",
    sentry_project: "SENTRY_PROJECT",
    app_version: "APP_VERSION",
};

/**
 * compose の secrets ディレクトリ（.docker/secrets）から KEY=value のレコードを構築する。
 * Doppler 同期のソースとして利用する。
 */
export function parseComposeSecretsDir(composeSecretsDir: string): Record<string, string> {
    const result: Record<string, string> = {};
    if (!fs.existsSync(composeSecretsDir) || !fs.statSync(composeSecretsDir).isDirectory()) {
        return result;
    }
    for (const [fileName, envKey] of Object.entries(COMPOSE_SECRET_KEY_MAP)) {
        const filePath = path.join(composeSecretsDir, fileName);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const value = fs.readFileSync(filePath, "utf-8").trim();
            if (value) result[envKey] = value;
        }
    }
    return result;
}

/** モノレポルート基準の compose secrets ディレクトリパス（.docker/secrets） */
export function getComposeSecretsDir(): string {
    return path.join(findProjectRoot(), ".docker", "secrets");
}

/** infra パッケージ内の environment.yaml のパス（infra 専用キーを管理） */
export function getEnvironmentYamlPath(): string {
    return path.join(findProjectRoot(), "infra", "environment.yaml");
}

/**
 * environment.yaml から KEY: value を読み取り、INFRA_ONLY_ENV_KEYS に含まれるキーのみ返す。
 * 簡易パース: 1 行 1 キー、KEY: value または KEY: "value" 形式。
 */
export function parseEnvironmentYaml(environmentYamlPath?: string): Record<string, string> {
    const filePath = environmentYamlPath ?? getEnvironmentYamlPath();
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        return {};
    }
    const content = fs.readFileSync(filePath, "utf-8");
    const result: Record<string, string> = {};
    const keySet = new Set<string>(INFRA_ONLY_ENV_KEYS);
    for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const match = trimmed.match(/^([A-Z][A-Z0-9_]*):\s*(.*)$/);
        const key = match?.[1];
        if (!key || !keySet.has(key)) continue;
        let value = (match[2] ?? "").trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        result[key] = value;
    }
    return result;
}

export interface DopplerProjectOutputs {
    project: doppler.Project;
    environments: Record<string, doppler.Environment>;
    secrets?: Record<string, doppler.Secret>;
}

export function getSecretsFromCreatedResources(
    dopplerProjectResources: DopplerProjectOutputs | { secrets?: Record<string, doppler.Secret> },
    configName: string,
): Record<string, pulumi.Output<string>> {
    if (!dopplerProjectResources.secrets) {
        return {};
    }

    const secrets: Record<string, pulumi.Output<string>> = {};

    for (const [key, secret] of Object.entries(dopplerProjectResources.secrets)) {
        if (key.startsWith(`${configName}-`)) {
            const secretName = key.replace(`${configName}-`, "");
            secrets[secretName] = secret.value;
        }
    }

    return secrets;
}

function findProjectRoot(): string {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    let currentDir = path.resolve(__dirname);
    const root = path.resolve("/");

    while (currentDir !== root) {
        const packageJsonPath = path.join(currentDir, "package.json");
        const turboJsonPath = path.join(currentDir, "turbo.json");

        if (fs.existsSync(packageJsonPath) && fs.existsSync(turboJsonPath)) {
            return currentDir;
        }

        currentDir = path.resolve(currentDir, "..");
    }

    const fallbackRoot = path.resolve(__dirname, "../../../..");
    return fallbackRoot;
}

export function parseEnvFile(envFilePath?: string): Record<string, string> {
    const projectRoot = findProjectRoot();
    const defaultEnvPath = path.join(projectRoot, ".env");
    const filePath = envFilePath ?? defaultEnvPath;

    if (!fs.existsSync(filePath)) {
        return {};
    }

    const envContent = fs.readFileSync(filePath, "utf-8");

    const envVars: Record<string, string> = {};
    const lines = envContent.split("\n");

    for (const line of lines) {
        const trimmedLine = line.trim();

        if (!trimmedLine || trimmedLine.startsWith("#")) {
            continue;
        }

        const equalIndex = trimmedLine.indexOf("=");
        if (equalIndex === -1) {
            continue;
        }

        const key = trimmedLine.slice(0, equalIndex).trim();
        let value = trimmedLine.slice(equalIndex + 1).trim();

        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        envVars[key] = value;
    }

    return envVars;
}

export function extractSecretsFromEnv(envVars: Record<string, string>, requiredKeys: string[]): Record<string, string> {
    const secrets: Record<string, string> = {};
    const urlVariableKeys = new Set(["API_BASE_URL", "BETTER_AUTH_URL", "VITE_BASE_URL"]);

    for (const key of requiredKeys) {
        if (envVars[key] !== undefined && envVars[key] !== "") {
            const value = envVars[key];
            if (urlVariableKeys.has(key) && value.toLowerCase().includes("localhost")) {
                continue;
            }
            secrets[key] = value;
        }
    }

    return secrets;
}

export function createDopplerSecrets(
    projectName: pulumi.Input<string>,
    configName: string,
    secrets: Record<string, string>,
): Record<string, doppler.Secret> {
    const dopplerSecrets: Record<string, doppler.Secret> = {};

    for (const [key, value] of Object.entries(secrets)) {
        if (!value || value.trim() === "") {
            continue;
        }

        dopplerSecrets[key] = new doppler.Secret(`doppler-secret-${configName}-${key.toLowerCase()}`, {
            project: projectName,
            config: configName,
            name: key,
            value: value,
        });
    }

    return dopplerSecrets;
}

export interface DopplerSyncSource {
    envFilePath?: string;
    composeSecretsDir?: string;
    /** infra 専用キーを読む environment.yaml のパス（composeSecretsDir 指定時はマージされる） */
    environmentYamlPath?: string;
}

/**
 * Doppler に同期するシークレットを Pulumi リソースとして作成する。
 * - composeSecretsDir 指定時: .docker/secrets から読み、environmentYamlPath があれば infra 専用キーをマージして同期
 * - envFilePath 指定時: 従来どおり .env から読み、DOPPLER_PROJECT_STRUCTURE の全キーを対象に同期
 */
export function createDopplerSecretsOnly(
    projectName?: string,
    source?: DopplerSyncSource,
): Record<string, doppler.Secret> {
    const actualProjectName = projectName || getProjectName();

    let secretsMap: Record<string, string>;
    if (source?.composeSecretsDir) {
        secretsMap = {
            ...parseComposeSecretsDir(source.composeSecretsDir),
            ...parseEnvironmentYaml(source.environmentYamlPath),
        };
    } else {
        const envVars = parseEnvFile(source?.envFilePath);
        const requiredKeys = DOPPLER_PROJECT_STRUCTURE.secrets.map((s) => s.name);
        secretsMap = extractSecretsFromEnv(envVars, requiredKeys);
    }

    validateNoLocalhost(secretsMap);

    const allSecrets: Record<string, doppler.Secret> = {};
    const environments = ["rc", "stg", "prd"];

    if (Object.keys(secretsMap).length > 0) {
        for (const envKey of environments) {
            const envSecrets = createDopplerSecrets(actualProjectName, envKey, secretsMap);

            for (const [secretKey, secret] of Object.entries(envSecrets)) {
                const uniqueKey = `${envKey}-${secretKey}`;
                allSecrets[uniqueKey] = secret;
            }
        }
    }

    return allSecrets;
}

function validateNoLocalhost(secrets: Record<string, string>): void {
    const localhostKeys: string[] = [];
    for (const [key, value] of Object.entries(secrets)) {
        if (value?.toLowerCase().includes("localhost")) {
            localhostKeys.push(key);
        }
    }
    if (localhostKeys.length > 0) {
        throw new Error(
            `以下のシークレットにlocalhostが含まれています。本番環境では使用できません: ${localhostKeys.join(", ")}`,
        );
    }
}

export function createDopplerProject(
    projectName?: string,
    description?: string,
    envFilePath?: string,
): DopplerProjectOutputs {
    const actualProjectName = projectName || getProjectName();
    const actualDescription = description || `${actualProjectName} infrastructure project`;

    const project = new doppler.Project(`${actualProjectName}-doppler-project`, {
        name: actualProjectName,
        description: actualDescription,
    });

    const environments: Record<string, doppler.Environment> = {
        rc: new doppler.Environment(`${actualProjectName}-doppler-env-rc`, {
            project: project.name,
            slug: "rc",
            name: "開発環境",
        }),
        stg: new doppler.Environment(`${actualProjectName}-doppler-env-stg`, {
            project: project.name,
            slug: "stg",
            name: "検証環境",
        }),
        prd: new doppler.Environment(`${actualProjectName}-doppler-env-prd`, {
            project: project.name,
            slug: "prd",
            name: "本番環境",
        }),
    };

    const envVars = parseEnvFile(envFilePath);
    const requiredKeys = DOPPLER_PROJECT_STRUCTURE.secrets.map((s) => s.name);
    const secretsMap = extractSecretsFromEnv(envVars, requiredKeys);

    validateNoLocalhost(secretsMap);

    const allSecrets: Record<string, doppler.Secret> = {};

    if (Object.keys(secretsMap).length > 0) {
        for (const envKey of Object.keys(environments)) {
            const envSecrets = createDopplerSecrets(actualProjectName, envKey, secretsMap);

            for (const [secretKey, secret] of Object.entries(envSecrets)) {
                const uniqueKey = `${envKey}-${secretKey}`;
                allSecrets[uniqueKey] = secret;
            }
        }
    }

    return {
        project,
        environments,
        secrets: allSecrets,
    };
}
