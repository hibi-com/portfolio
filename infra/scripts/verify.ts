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
        googleClientId: getEnvVar("GOOGLE_CLIENT_ID", envVars),
        googleClientSecret: getEnvVar("GOOGLE_CLIENT_SECRET", envVars),
        betterAuthSecret: getEnvVar("BETTER_AUTH_SECRET", envVars),
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
    verifyGoogleOAuthCredentials(env);
    verifyBetterAuthSecret(env.betterAuthSecret);
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
