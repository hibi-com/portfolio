#!/usr/bin/env bun

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findProjectRoot(): string {
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

    return path.resolve(__dirname, "../../..");
}

function parseEnvFile(envFilePath: string): Record<string, string> {
    if (!fs.existsSync(envFilePath)) {
        return {};
    }

    const envContent = fs.readFileSync(envFilePath, "utf-8");
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

async function verifyCloudflareToken(apiToken: string, accountId: string, zoneId: string): Promise<void> {
    console.log("\n🔍 Cloudflare APIトークンの確認中...\n");

    try {
        const userResponse = await fetch("https://api.cloudflare.com/client/v4/user", {
            headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!userResponse.ok) {
            const errorData = await userResponse.json();
            console.error("❌ Cloudflare APIトークンが無効です");
            console.error(`   エラー: ${JSON.stringify(errorData, null, 2)}`);
            return;
        }

        const userData = await userResponse.json();
        console.log("✅ Cloudflare APIトークンは有効です");
        console.log(`   ユーザー: ${userData.result?.email || "不明"}`);

        const accountResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}`, {
            headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!accountResponse.ok) {
            const errorData = await accountResponse.json();
            console.error(`❌ アカウント ${accountId} へのアクセス権限がありません`);
            console.error(`   エラー: ${JSON.stringify(errorData, null, 2)}`);
            return;
        }

        const accountData = await accountResponse.json();
        console.log(`✅ アカウント ${accountId} へのアクセス権限があります`);
        console.log(`   アカウント名: ${accountData.result?.name || "不明"}`);

        const zoneResponse = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}`, {
            headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!zoneResponse.ok) {
            const errorData = await zoneResponse.json();
            console.error(`❌ ゾーン ${zoneId} へのアクセス権限がありません`);
            console.error(`   エラー: ${JSON.stringify(errorData, null, 2)}`);
            return;
        }

        const zoneData = await zoneResponse.json();
        console.log(`✅ ゾーン ${zoneId} へのアクセス権限があります`);
        console.log(`   ゾーン名: ${zoneData.result?.name || "不明"}`);

        const dnsResponse = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?per_page=1`, {
            headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!dnsResponse.ok) {
            const errorData = await dnsResponse.json();
            console.error("❌ DNSレコードの読み取り権限がありません");
            console.error(`   エラー: ${JSON.stringify(errorData, null, 2)}`);
            return;
        }

        console.log("✅ DNSレコードの読み取り権限があります");

        const pagesResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects?per_page=1`,
            {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    "Content-Type": "application/json",
                },
            },
        );

        if (!pagesResponse.ok) {
            const errorData = await pagesResponse.json();
            console.error("❌ Pagesプロジェクトへのアクセス権限がありません");
            console.error(`   エラー: ${JSON.stringify(errorData, null, 2)}`);
            console.log("\n💡 必要な権限:");
            console.log("   - Zone: DNS:Edit");
            console.log("   - Zone: Zone:Read");
            console.log("   - Account: Cloudflare Pages:Edit");
            return;
        }

        console.log("✅ Pagesプロジェクトへのアクセス権限があります");

        const workersResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts`,
            {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    "Content-Type": "application/json",
                },
            },
        );

        if (!workersResponse.ok) {
            const errorData = await workersResponse.json();
            console.error("❌ Workersへのアクセス権限がありません");
            console.error(`   エラー: ${JSON.stringify(errorData, null, 2)}`);
            console.log("\n💡 必要な権限:");
            console.log("   - Account: Workers Scripts:Edit");
            return;
        }

        console.log("✅ Workersへのアクセス権限があります");

        console.log("\n✅ すべてのCloudflare権限が正常です！");
    } catch (error) {
        console.error("❌ Cloudflare APIトークンの確認中にエラーが発生しました");
        console.error(`   エラー: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function verifySentryToken(authToken: string, org: string): Promise<void> {
    console.log("\n🔍 Sentry認証トークンの確認中...\n");

    try {
        const authResponse = await fetch("https://sentry.io/api/0/", {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!authResponse.ok) {
            const errorText = await authResponse.text();
            console.error("❌ Sentry認証トークンが無効です");
            console.error(`   ステータス: ${authResponse.status}`);
            console.error(`   エラー: ${errorText}`);
            console.log("\n💡 トークンの作成方法:");
            console.log("   1. https://sentry.io/settings/account/api/auth-tokens/ にアクセス");
            console.log("   2. 「Create New Token」をクリック");
            console.log("   3. 必要なスコープを選択:");
            console.log("      - org:read (組織の読み取り)");
            console.log("      - org:write (組織の書き込み)");
            console.log("      - project:read (プロジェクトの読み取り)");
            console.log("      - project:write (プロジェクトの書き込み)");
            console.log("      - team:read (チームの読み取り)");
            console.log("      - team:write (チームの書き込み)");
            return;
        }

        console.log("✅ Sentry認証トークンは有効です");

        const orgResponse = await fetch(`https://sentry.io/api/0/organizations/${org}/`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!orgResponse.ok) {
            const errorText = await orgResponse.text();
            console.error(`❌ 組織 "${org}" へのアクセス権限がありません`);
            console.error(`   ステータス: ${orgResponse.status}`);
            console.error(`   エラー: ${errorText}`);
            return;
        }

        const orgData = await orgResponse.json();
        console.log(`✅ 組織 "${org}" へのアクセス権限があります`);
        console.log(`   組織名: ${orgData.name || "不明"}`);

        const teamsResponse = await fetch(`https://sentry.io/api/0/organizations/${org}/teams/`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!teamsResponse.ok) {
            const errorText = await teamsResponse.text();
            console.error("❌ チームへのアクセス権限がありません");
            console.error(`   ステータス: ${teamsResponse.status}`);
            console.error(`   エラー: ${errorText}`);
            console.log("\n💡 必要な権限:");
            console.log("   - team:read (チームの読み取り)");
            console.log("   - team:write (チームの書き込み)");
            return;
        }

        const teamsData = await teamsResponse.json();
        console.log("✅ チームへのアクセス権限があります");
        console.log(`   チーム数: ${teamsData.length || 0}`);

        const projectsResponse = await fetch(`https://sentry.io/api/0/organizations/${org}/projects/`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!projectsResponse.ok) {
            const errorText = await projectsResponse.text();
            console.error("❌ プロジェクトへのアクセス権限がありません");
            console.error(`   ステータス: ${projectsResponse.status}`);
            console.error(`   エラー: ${errorText}`);
            console.log("\n💡 必要な権限:");
            console.log("   - project:read (プロジェクトの読み取り)");
            console.log("   - project:write (プロジェクトの書き込み)");
            return;
        }

        const projectsData = await projectsResponse.json();
        console.log("✅ プロジェクトへのアクセス権限があります");
        console.log(`   プロジェクト数: ${projectsData.length || 0}`);

        console.log("\n✅ すべてのSentry権限が正常です！");
    } catch (error) {
        console.error("❌ Sentry認証トークンの確認中にエラーが発生しました");
        console.error(`   エラー: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function verifyGrafanaApiKey(apiKey: string, orgSlug: string): Promise<void> {
    console.log("\n🔍 Grafana APIキーの確認中...\n");

    try {
        const grafanaUrl = `https://${orgSlug}.grafana.net`;

        const userResponse = await fetch(`${grafanaUrl}/api/user`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });

        if (!userResponse.ok) {
            const selfHostedResponse = await fetch(`${orgSlug}/api/user`, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            });

            if (!selfHostedResponse.ok) {
                const errorText = await userResponse.text();
                console.error("❌ Grafana APIキーが無効です");
                console.error(`   ステータス: ${userResponse.status}`);
                console.error(`   エラー: ${errorText}`);
                console.log("\n💡 APIキーの作成方法:");
                console.log("   Grafana Cloud: https://grafana.com/orgs/{org-slug}/api-keys");
                console.log("   セルフホスト: Configuration → API Keys");
                return;
            }

            const userData = await selfHostedResponse.json();
            console.log("✅ Grafana APIキーは有効です（セルフホスト）");
            console.log(`   ユーザー: ${userData.login || userData.name || "不明"}`);
            return;
        }

        const userData = await userResponse.json();
        console.log("✅ Grafana APIキーは有効です（Grafana Cloud）");
        console.log(`   ユーザー: ${userData.login || userData.name || "不明"}`);

        const foldersResponse = await fetch(`${grafanaUrl}/api/folders?limit=1`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });

        if (!foldersResponse.ok) {
            const errorText = await foldersResponse.text();
            console.error("❌ フォルダへのアクセス権限がありません");
            console.error(`   ステータス: ${foldersResponse.status}`);
            console.error(`   エラー: ${errorText}`);
            console.log("\n💡 必要な権限:");
            console.log("   - folders:read (フォルダの読み取り)");
            console.log("   - folders:create (フォルダの作成)");
            return;
        }

        console.log("✅ フォルダへのアクセス権限があります");

        const dashboardsResponse = await fetch(`${grafanaUrl}/api/search?type=dash-db&limit=1`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });

        if (!dashboardsResponse.ok) {
            const errorText = await dashboardsResponse.text();
            console.error("❌ ダッシュボードへのアクセス権限がありません");
            console.error(`   ステータス: ${dashboardsResponse.status}`);
            console.error(`   エラー: ${errorText}`);
            console.log("\n💡 必要な権限:");
            console.log("   - dashboards:read (ダッシュボードの読み取り)");
            console.log("   - dashboards:write (ダッシュボードの書き込み)");
            return;
        }

        console.log("✅ ダッシュボードへのアクセス権限があります");

        console.log("\n✅ すべてのGrafana権限が正常です！");
    } catch (error) {
        console.error("❌ Grafana APIキーの確認中にエラーが発生しました");
        console.error(`   エラー: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function verifyRedisCloudKeys(accessKey: string, secretKey: string): Promise<void> {
    console.log("\n🔍 Redis Cloud APIキーの確認中...\n");

    try {
        const authString = Buffer.from(`${accessKey}:${secretKey}`).toString("base64");

        const subscriptionsResponse = await fetch("https://api.redislabs.com/v1/subscriptions", {
            headers: {
                Authorization: `Basic ${authString}`,
                "Content-Type": "application/json",
            },
        });

        if (!subscriptionsResponse.ok) {
            const errorText = await subscriptionsResponse.text();
            console.error("❌ Redis Cloud APIキーが無効です");
            console.error(`   ステータス: ${subscriptionsResponse.status}`);
            console.error(`   エラー: ${errorText}`);
            console.log("\n💡 APIキーの作成方法:");
            console.log("   1. https://app.redislabs.com/ にログイン");
            console.log("   2. Account Settings → Access Keys & Security");
            console.log("   3. Generate New Access Key");
            return;
        }

        const subscriptionsData = await subscriptionsResponse.json();
        console.log("✅ Redis Cloud APIキーは有効です");
        console.log(`   サブスクリプション数: ${subscriptionsData.subscriptions?.length || 0}`);

        if (subscriptionsData.subscriptions && subscriptionsData.subscriptions.length > 0) {
            const subscriptionId = subscriptionsData.subscriptions[0].id;
            const databasesResponse = await fetch(
                `https://api.redislabs.com/v1/subscriptions/${subscriptionId}/databases`,
                {
                    headers: {
                        Authorization: `Basic ${authString}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            if (databasesResponse.ok) {
                const databasesData = await databasesResponse.json();
                console.log("✅ データベースへのアクセス権限があります");
                console.log(`   データベース数: ${databasesData.databases?.length || 0}`);
            }
        }

        console.log("\n✅ すべてのRedis Cloud権限が正常です！");
    } catch (error) {
        console.error("❌ Redis Cloud APIキーの確認中にエラーが発生しました");
        console.error(`   エラー: ${error instanceof Error ? error.message : String(error)}`);
    }
}


function verifyGoogleOAuth(clientId: string, clientSecret: string): void {
    console.log("\n🔍 Google OAuth認証情報の確認中...\n");

    try {
        if (!clientId || clientId.trim() === "") {
            console.error("❌ GOOGLE_CLIENT_IDが設定されていません");
            return;
        }

        if (clientId.includes(".apps.googleusercontent.com")) {
            console.log("✅ GOOGLE_CLIENT_IDの形式は正しいです");
            console.log(`   Client ID: ${clientId.substring(0, 20)}...`);
        } else {
            console.warn("⚠️  GOOGLE_CLIENT_IDの形式が正しくない可能性があります");
            console.warn("   通常は 'xxx.apps.googleusercontent.com' の形式です");
        }

        if (!clientSecret || clientSecret.trim() === "") {
            console.error("❌ GOOGLE_CLIENT_SECRETが設定されていません");
            return;
        }

        if (clientSecret.length < 20) {
            console.warn("⚠️  GOOGLE_CLIENT_SECRETの長さが短すぎる可能性があります");
        } else {
            console.log("✅ GOOGLE_CLIENT_SECRETの形式は正しいです");
            console.log(`   Secret: ${clientSecret.substring(0, 10)}...`);
        }

        console.log("\n💡 実際の動作確認:");
        console.log("   Google OAuth認証情報は実際の認証フローで確認する必要があります");
        console.log("   発行手順: https://console.cloud.google.com/apis/credentials");

        console.log("\n✅ Google OAuth認証情報の形式チェック完了");
    } catch (error) {
        console.error("❌ Google OAuth認証情報の確認中にエラーが発生しました");
        console.error(`   エラー: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function verifyBetterAuthSecret(secret: string): void {
    console.log("\n🔍 Better Auth Secretの確認中...\n");

    try {
        if (!secret || secret.trim() === "") {
            console.error("❌ BETTER_AUTH_SECRETが設定されていません");
            console.log("\n💡 生成方法:");
            console.log("   openssl rand -base64 32");
            console.log("   または");
            console.log("   node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\"");
            return;
        }

        const base64Regex = /^[A-Za-z0-9+/=]+$/;
        if (!base64Regex.test(secret)) {
            console.warn("⚠️  BETTER_AUTH_SECRETがBase64形式ではない可能性があります");
        }

        if (secret.length < 32) {
            console.warn("⚠️  BETTER_AUTH_SECRETの長さが短すぎる可能性があります");
            console.warn("   推奨: 32バイト以上（Base64で44文字以上）");
        } else {
            console.log("✅ BETTER_AUTH_SECRETの形式は正しいです");
            console.log(`   長さ: ${secret.length}文字`);
        }

        console.log("\n✅ Better Auth Secretの形式チェック完了");
    } catch (error) {
        console.error("❌ Better Auth Secretの確認中にエラーが発生しました");
        console.error(`   エラー: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function verifyDatabaseUrl(databaseUrl: string): void {
    if (!databaseUrl || databaseUrl.trim() === "") {
        console.warn("⚠️  DATABASE_URLが設定されていません");
        console.log("   （TiDBクラスター作成後に自動設定されます）");
        return;
    }

    if (!databaseUrl.startsWith("mysql://")) {
        console.warn("⚠️  DATABASE_URLの形式が正しくない可能性があります");
        console.warn("   通常は 'mysql://user:password@host:port/database?sslaccept=strict' の形式です");
        return;
    }

    console.log("✅ DATABASE_URLの形式は正しいです（MySQL形式）");
    if (databaseUrl.includes("localhost")) {
        console.warn("⚠️  DATABASE_URLにlocalhostが含まれています");
        console.warn("   本番環境では使用できません");
    }
}

function verifyTiDBHost(tidbHost: string): void {
    if (!tidbHost || tidbHost.trim() === "") {
        console.warn("⚠️  TIDB_HOSTが設定されていません");
        console.log("   （TiDBクラスター作成後に設定されます）");
        return;
    }

    console.log("✅ TIDB_HOSTが設定されています");
    console.log(`   Host: ${tidbHost}`);

    if (tidbHost.includes(".tidbcloud.com") || tidbHost.includes(".aws.tidbcloud.com")) {
        console.log("✅ TiDB Cloudのホスト名形式です");
    } else {
        console.warn("⚠️  ホスト名がTiDB Cloudの形式ではない可能性があります");
    }
}

function verifyTiDBConnection(databaseUrl: string, tidbHost: string): void {
    console.log("\n🔍 TiDB Cloud接続情報の確認中...\n");

    try {
        verifyDatabaseUrl(databaseUrl);
        verifyTiDBHost(tidbHost);

        console.log("\n💡 実際の接続確認:");
        console.log("   データベース接続は実際の接続テストで確認する必要があります");
        console.log("   発行手順: https://tidbcloud.com/ → クラスター → Connect");

        console.log("\n✅ TiDB Cloud接続情報の形式チェック完了");
    } catch (error) {
        console.error("❌ TiDB Cloud接続情報の確認中にエラーが発生しました");
        console.error(`   エラー: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function getEnvVar(key: string, envVars: Record<string, string>): string {
    return process.env[key] || envVars[key] || "";
}

function loadEnvironmentVariables(): Record<string, string> {
    const projectRoot = findProjectRoot();
    const envFilePath = path.join(projectRoot, ".env");
    const envVars = parseEnvFile(envFilePath);

    return {
        cloudflareApiToken: getEnvVar("CLOUDFLARE_API_TOKEN", envVars),
        cloudflareAccountId: getEnvVar("CLOUDFLARE_ACCOUNT_ID", envVars),
        cloudflareZoneId: getEnvVar("CLOUDFLARE_ZONE_ID", envVars),
        sentryAuthToken: getEnvVar("SENTRY_AUTH_TOKEN", envVars),
        sentryOrg: getEnvVar("SENTRY_ORG", envVars),
        grafanaApiKey: getEnvVar("GRAFANA_API_KEY", envVars),
        grafanaOrgSlug: getEnvVar("GRAFANA_ORG_SLUG", envVars),
        redisCloudAccessKey: getEnvVar("REDISCLOUD_ACCESS_KEY", envVars),
        redisCloudSecretKey: getEnvVar("REDISCLOUD_SECRET_KEY", envVars),
        googleClientId: getEnvVar("GOOGLE_CLIENT_ID", envVars),
        googleClientSecret: getEnvVar("GOOGLE_CLIENT_SECRET", envVars),
        betterAuthSecret: getEnvVar("BETTER_AUTH_SECRET", envVars),
        databaseUrl: getEnvVar("DATABASE_URL", envVars),
        tidbHost: getEnvVar("TIDB_HOST", envVars),
    };
}

async function verifyCloudflareCredentials(env: Record<string, string>): Promise<void> {
    if (env.cloudflareApiToken && env.cloudflareAccountId && env.cloudflareZoneId) {
        await verifyCloudflareToken(env.cloudflareApiToken, env.cloudflareAccountId, env.cloudflareZoneId);
    } else {
        console.log("\n⚠️  Cloudflare APIトークンが見つかりません");
        console.log("   .envファイルに以下を設定してください:");
        console.log("   - CLOUDFLARE_API_TOKEN");
        console.log("   - CLOUDFLARE_ACCOUNT_ID");
        console.log("   - CLOUDFLARE_ZONE_ID");
    }
}

async function verifySentryCredentials(env: Record<string, string>): Promise<void> {
    if (env.sentryAuthToken && env.sentryOrg) {
        await verifySentryToken(env.sentryAuthToken, env.sentryOrg);
    } else {
        console.log("\n⚠️  Sentry認証トークンが見つかりません");
        console.log("   .envファイルに以下を設定してください:");
        console.log("   - SENTRY_AUTH_TOKEN");
        console.log("   - SENTRY_ORG");
    }
}

async function verifyGrafanaCredentials(env: Record<string, string>): Promise<void> {
    if (env.grafanaApiKey && env.grafanaOrgSlug) {
        await verifyGrafanaApiKey(env.grafanaApiKey, env.grafanaOrgSlug);
    } else {
        console.log("\n⚠️  Grafana APIキーが見つかりません");
        console.log("   .envファイルに以下を設定してください:");
        console.log("   - GRAFANA_API_KEY");
        console.log("   - GRAFANA_ORG_SLUG");
    }
}

async function verifyRedisCloudCredentials(env: Record<string, string>): Promise<void> {
    if (env.redisCloudAccessKey && env.redisCloudSecretKey) {
        await verifyRedisCloudKeys(env.redisCloudAccessKey, env.redisCloudSecretKey);
    } else {
        console.log("\n⚠️  Redis Cloud APIキーが見つかりません");
        console.log("   .envファイルに以下を設定してください:");
        console.log("   - REDISCLOUD_ACCESS_KEY");
        console.log("   - REDISCLOUD_SECRET_KEY");
    }
}


function verifyGoogleOAuthCredentials(env: Record<string, string>): void {
    if (env.googleClientId || env.googleClientSecret) {
        verifyGoogleOAuth(env.googleClientId, env.googleClientSecret);
    } else {
        console.log("\n⚠️  Google OAuth認証情報が見つかりません");
        console.log("   .envファイルに以下を設定してください（オプション）:");
        console.log("   - GOOGLE_CLIENT_ID");
        console.log("   - GOOGLE_CLIENT_SECRET");
    }
}

async function verifyAllCredentials(env: Record<string, string>): Promise<void> {
    await verifyCloudflareCredentials(env);
    await verifySentryCredentials(env);
    await verifyGrafanaCredentials(env);
    await verifyRedisCloudCredentials(env);
    verifyGoogleOAuthCredentials(env);
    verifyBetterAuthSecret(env.betterAuthSecret);
    verifyTiDBConnection(env.databaseUrl, env.tidbHost);
}

async function main() {
    console.log("=".repeat(60));
    console.log("🔐 APIトークン・キー確認スクリプト");
    console.log("=".repeat(60));

    const env = loadEnvironmentVariables();
    await verifyAllCredentials(env);

    console.log(`\n${"=".repeat(60)}`);
    console.log("✅ すべての確認が完了しました");
    console.log("=".repeat(60));
}

try {
    await main();
} catch (error) {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
}
