import * as fs from "node:fs";
import * as path from "node:path";
import pc from "picocolors";
import type { Target, Task } from "../lib/config-loader";
import { formatMessage, loadConfig, resolvePath } from "../lib/config-loader";
import { countFiles, createFileLinks, createSkillLinks } from "../lib/file-links";

async function executeTask(task: Task, targetName: string, resolvedPaths: Record<string, string>): Promise<void> {
    switch (task.type) {
        case "symlink": {
            const targetPath = resolvePath(task.location || targetName, resolvedPaths);
            const linkPath = path.join(targetPath, task.name);

            if (fs.existsSync(linkPath)) {
                fs.unlinkSync(linkPath);
            }
            fs.symlinkSync(task.target, linkPath);
            break;
        }

        case "fileLinks": {
            const sourcePath = resolvePath(task.source!, resolvedPaths);
            const targetPath = resolvePath(task.target, resolvedPaths);
            await createFileLinks(sourcePath, targetPath, task.suffix || "");
            break;
        }

        case "skillLinks": {
            const sourcePath = resolvePath(task.source!, resolvedPaths);
            const targetPath = resolvePath(task.target, resolvedPaths);
            await createSkillLinks(sourcePath, targetPath);
            break;
        }
    }
}

function printTaskSummary(task: Task, resolvedPaths: Record<string, string>, summaryItemTemplate: string): void {
    if (task.type === "symlink") return;

    const targetPath = resolvePath(task.target, resolvedPaths);

    let pattern: string;
    if (task.type === "skillLinks") {
        pattern = "SKILL.md";
    } else if (task.suffix) {
        pattern = `*${task.suffix}.md`;
    } else {
        pattern = "*.md";
    }

    const count = countFiles(targetPath, pattern);
    console.log(formatMessage(summaryItemTemplate, { description: task.description, count }));
}

async function executeTarget(
    target: Target,
    resolvedPaths: Record<string, string>,
    messages: {
        targetStart: string;
        taskStart: string;
    },
): Promise<void> {
    console.log(pc.blue(formatMessage(messages.targetStart, { icon: target.icon, name: target.displayName })));

    for (const task of target.tasks) {
        console.log(formatMessage(messages.taskStart, { icon: task.icon, description: task.description }));
        await executeTask(task, target.name, resolvedPaths);
    }

    console.log("");
}

function printTargetSummary(
    target: Target,
    resolvedPaths: Record<string, string>,
    messages: {
        summaryTitle: string;
        summaryItem: string;
    },
): void {
    console.log(pc.green(formatMessage(messages.summaryTitle, { name: target.displayName })));

    for (const task of target.tasks) {
        printTaskSummary(task, resolvedPaths, messages.summaryItem);
    }

    console.log("");
}

export async function createAIFileLinks(): Promise<void> {
    const config = loadConfig();
    const { resolvedPaths, messages, targets } = config;

    console.log(pc.cyan(messages.start));
    console.log("");

    for (const target of targets) {
        await executeTarget(target, resolvedPaths, messages);
    }

    for (const target of targets) {
        printTargetSummary(target, resolvedPaths, messages);
    }

    console.log(pc.green(messages.complete));
}
