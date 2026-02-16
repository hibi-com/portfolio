import * as path from "node:path";
import config from "../config/config.json";

export interface PathConfig {
    projectRoot: string;
    claude: string;
    github: string;
    codex: string;
}

export interface Task {
    type: "symlink" | "fileLinks" | "skillLinks";
    name: string;
    description: string;
    icon: string;
    source?: string;
    target: string;
    location?: string;
    suffix?: string;
    filename?: string;
}

export interface Target {
    name: string;
    displayName: string;
    icon: string;
    tasks: Task[];
}

export interface Messages {
    start: string;
    targetStart: string;
    taskStart: string;
    summaryTitle: string;
    summaryItem: string;
    complete: string;
}

export interface Config {
    paths: PathConfig;
    targets: Target[];
}

function getMessages(): Messages {
    return {
        start: "🔗 AI設定シンボリックリンクの統一構築を開始...",
        targetStart: "{icon} [{name}] 設定を構築中...",
        taskStart: "  {icon} {description}を構築中...",
        summaryTitle: "📊 [{name}] 作成されたリンク：",
        summaryItem: "   {description} ({count}ファイル)",
        complete: "✅ 完了！",
    };
}

export function loadConfig(): {
    paths: PathConfig;
    targets: Target[];
    resolvedPaths: Record<string, string>;
    messages: Messages;
} {
    const projectRoot = path.resolve(__dirname, config.paths.projectRoot);

    const resolvedPaths: Record<string, string> = {
        projectRoot,
        claude: path.join(projectRoot, config.paths.claude),
        github: path.join(projectRoot, config.paths.github),
        codex: path.join(projectRoot, config.paths.codex),
    };

    const messages = getMessages();

    return {
        paths: config.paths,
        targets: config.targets as Target[],
        resolvedPaths,
        messages,
    };
}

export function resolvePath(pathTemplate: string, resolvedPaths: Record<string, string>): string {
    const parts = pathTemplate.split("/");
    const prefix = parts[0];

    if (!prefix) {
        throw new Error("Empty path template");
    }

    const basePath = resolvedPaths[prefix];

    if (!basePath) {
        throw new Error(`Unknown path prefix: ${prefix}`);
    }

    return path.join(basePath, ...parts.slice(1));
}

export function formatMessage(template: string, values: Record<string, string | number>): string {
    return template.replaceAll(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}
