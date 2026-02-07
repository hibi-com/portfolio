import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import pc from "picocolors";
import { logStep } from "./utils";

const SECRET_FILE_PATTERNS = [
    /^infra\/Pulumi\..*\.yaml$/,
    /\.env$/,
    /\.env\.local$/,
    /\.env\..*$/,
    /^\.git\/config$/,
    /^\.git\/credentials$/,
];

const SECRET_KEY_PATTERNS = [
    /secure:/i,
    /api[_-]?key/i,
    /apikey/i,
    /password/i,
    /passwd/i,
    /pwd/i,
    /token/i,
    /access[_-]?token/i,
    /refresh[_-]?token/i,
    /secret/i,
    /secret[_-]?key/i,
    /credential/i,
    /credentials/i,
    /auth/i,
    /aws[_-]?access[_-]?key/i,
    /aws[_-]?secret[_-]?key/i,
    /private[_-]?key/i,
    /public[_-]?key/i,
    /bearer[_-]?token/i,
    /session[_-]?id/i,
    /session[_-]?secret/i,
];

const SECRET_VALUE_PATTERNS = [
    /^[A-Za-z0-9+/]{32,}={0,2}$/,
    /^[A-Za-z0-9_-]{20,}$/,
    /^sk-[A-Za-z0-9_-]+$/,
    /^pk_[A-Za-z0-9_-]+$/,
    /^ghp_[A-Za-z0-9_-]+$/,
    /^gho_[A-Za-z0-9_-]+$/,
    /^ghu_[A-Za-z0-9_-]+$/,
    /^ghs_[A-Za-z0-9_-]+$/,
    /^ghr_[A-Za-z0-9_-]+$/,
    /^AKIA[0-9A-Z]{16}$/,
    /^AIza[0-9A-Za-z_-]{35}$/,
    /^ya29\.[0-9A-Za-z_-]+$/,
    /^xox[baprs]-[0-9a-zA-Z-]{10,48}$/,
];

const EXCLUDE_PATTERNS = [
    /\.example$/,
    /\.sample$/,
    /\.template$/,
    /\.dist$/,
    /node_modules/,
    /\.git/,
    /dist/,
    /build/,
    /coverage/,
    /\.turbo/,
];

function getStagedFiles(): string[] {
    try {
        const output = execSync("git diff --cached --name-only --diff-filter=ACM", { encoding: "utf-8" });
        return output
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
    } catch (error) {
        console.error("Error getting staged files:", error);
        return [];
    }
}

function shouldCheckFile(filePath: string): boolean {
    if (EXCLUDE_PATTERNS.some((pattern) => pattern.test(filePath))) {
        return false;
    }

    return SECRET_FILE_PATTERNS.some((pattern) => pattern.test(filePath));
}

function checkPulumiFile(content: string): string[] {
    const issues: string[] = [];
    if (/^\s*secure:/m.test(content)) {
        issues.push("contains encrypted secrets (secure:) - use environment variables instead");
    }
    return issues;
}

function isEmptyOrPlaceholder(value: string): boolean {
    return value.length === 0 || value === "null" || value === "undefined" || value === "''" || value === '""';
}

function parseEnvLine(line: string): { key: string; value: string } | null {
    const parts = line.split("=");
    if (parts.length < 2) return null;
    const key = parts[0]?.trim();
    if (!key) return null;
    const value = parts
        .slice(1)
        .join("=")
        .trim()
        .replaceAll(/(?:^["'])|(?:["']$)/g, "");
    return { key, value };
}

function detectSecretIssue(key: string, value: string, lineNumber: number): string | null {
    if (SECRET_VALUE_PATTERNS.some((pattern) => pattern.test(value))) {
        return `line ${lineNumber}: potential secret in '${key}'`;
    }
    if (value.length > 10) {
        return `line ${lineNumber}: potential secret in '${key}' (long value detected)`;
    }
    return null;
}

function checkEnvFile(content: string): string[] {
    const issues: string[] = [];
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]?.trim();
        if (!line || line.startsWith("#")) continue;

        const parsed = parseEnvLine(line);
        if (!parsed) continue;

        const { key, value } = parsed;
        if (!SECRET_KEY_PATTERNS.some((pattern) => pattern.test(key))) continue;
        if (isEmptyOrPlaceholder(value)) continue;

        const issue = detectSecretIssue(key, value, i + 1);
        if (issue) issues.push(issue);
    }
    return issues;
}

function checkOtherFiles(content: string): string[] {
    const issues: string[] = [];
    for (const pattern of SECRET_KEY_PATTERNS) {
        const regex = new RegExp(`(${pattern.source})\\s*[:=]\\s*["']?([^"'\n]{10,})["']?`, "gi");
        const matches = content.matchAll(regex);
        for (const match of matches) {
            const value = match[2];
            if (value && SECRET_VALUE_PATTERNS.some((p) => p.test(value))) {
                issues.push(`potential hardcoded secret detected: '${match[1]}'`);
            }
        }
    }
    return issues;
}

function checkFileForSecrets(filePath: string): { found: boolean; issues: string[] } {
    if (!existsSync(filePath)) {
        return { found: false, issues: [] };
    }

    const content = readFileSync(filePath, "utf-8");
    const issues: string[] = [];

    if (/^infra\/Pulumi\..*\.yaml$/.test(filePath)) {
        issues.push(...checkPulumiFile(content));
    } else if (/\.env/.test(filePath)) {
        issues.push(...checkEnvFile(content));
    } else {
        issues.push(...checkOtherFiles(content));
    }

    return { found: issues.length > 0, issues };
}

function displayFileIssues(allIssues: Array<{ file: string; issues: string[] }>): void {
    for (const { file, issues } of allIssues) {
        logStep("❌", file, "error");
        for (const issue of issues) {
            console.error(pc.red(`   ${issue}`));
        }
        console.error();
    }
}

function displayBestPractices(): void {
    console.error();
    logStep("💡", "Security best practices:", "info");
    console.error(pc.dim("   • Use environment variables instead of hardcoding secrets"));
    console.error(pc.dim("   • Never commit .env files with actual secrets"));
    console.error(pc.dim("   • Use .env.example files for documentation"));
    console.error(pc.dim("   • Use secret management (e.g., Cloudflare env, AWS Secrets Manager)"));
    console.error();
}

function displayPulumiAdvice(): void {
    console.error(pc.yellow("   For Pulumi config files:"));
    console.error(pc.dim("   • Do not commit secure: values; use environment variables"));
    console.error(pc.dim("   • See infra/README.md for details"));
    console.error();
}

function displayEnvAdvice(): void {
    console.error(pc.yellow("   For .env files:"));
    console.error(pc.dim("   • Add .env files to .gitignore"));
    console.error(pc.dim("   • Use .env.example for documentation"));
    console.error(pc.dim("   • Never commit actual secrets"));
    console.error();
}

function displaySecurityIssues(allIssues: Array<{ file: string; issues: string[] }>): void {
    console.error();
    logStep("❌", "Security issues detected:", "error");
    console.error();

    displayFileIssues(allIssues);
    displayBestPractices();

    const pulumiFiles = allIssues.filter(({ file }) => /^infra\/Pulumi\..*\.yaml$/.test(file));
    if (pulumiFiles.length > 0) {
        displayPulumiAdvice();
    }

    const envFiles = allIssues.filter(({ file }) => /\.env/.test(file));
    if (envFiles.length > 0) {
        displayEnvAdvice();
    }
}

export async function checkSecrets(files?: string[]): Promise<boolean> {
    const filesToCheck = files && files.length > 0 ? files : getStagedFiles();

    if (filesToCheck.length === 0) {
        logStep("ℹ️", "No files to check", "info");
        return true;
    }

    const filesToProcess = filesToCheck.filter(shouldCheckFile);

    if (filesToProcess.length === 0) {
        logStep("ℹ️", "No security-sensitive files to check", "info");
        return true;
    }

    const allIssues: Array<{ file: string; issues: string[] }> = [];

    for (const file of filesToProcess) {
        const { found, issues } = checkFileForSecrets(file);
        if (found) {
            allIssues.push({ file, issues });
        }
    }

    if (allIssues.length > 0) {
        displaySecurityIssues(allIssues);
        return false;
    }

    logStep("✓", "No security issues detected", "success");
    return true;
}
