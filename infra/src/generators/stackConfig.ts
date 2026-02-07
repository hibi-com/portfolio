import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

const PULUMI_PROJECT_NAME = "portfolio-infra";

export interface PulumiProjectNames {
    pagesProjectNames: Record<string, string>;
    workerScriptNames: Record<string, string>;
}

export function getStackConfig(configKey: string): string {
    const stackYamlPath = path.join(process.cwd(), "Pulumi.rc.yaml");

    if (!fs.existsSync(stackYamlPath)) {
        throw new Error(`Pulumi stack config not found at ${stackYamlPath}`);
    }

    const content = fs.readFileSync(stackYamlPath, "utf-8");
    const fullConfigKey = `${PULUMI_PROJECT_NAME}:${configKey}`;
    const regex = new RegExp(String.raw`^\s*${fullConfigKey}:\s*(.+)$`, "m");
    const configMatch = regex.exec(content);

    if (!configMatch?.[1]) {
        throw new Error(
            `Configuration '${fullConfigKey}' not found in ${stackYamlPath}.\n` +
                `Please set it using: pulumi config set ${PULUMI_PROJECT_NAME}:${configKey} <value>`,
        );
    }

    return configMatch[1].trim();
}

export function getPulumiOutputs(): PulumiProjectNames {
    const pagesOutput = execSync("pulumi stack output pagesProjectNames --json", {
        encoding: "utf-8",
        cwd: process.cwd(),
    });
    const workerOutput = execSync("pulumi stack output workerScriptNames --json", {
        encoding: "utf-8",
        cwd: process.cwd(),
    });

    return {
        pagesProjectNames: JSON.parse(pagesOutput),
        workerScriptNames: JSON.parse(workerOutput),
    };
}

export function getProjectNameFromPulumi(
    appName: string,
    appType: "pages" | "worker",
    pulumiOutputs: PulumiProjectNames,
): string {
    if (appType === "worker") {
        const workerKey = Object.keys(pulumiOutputs.workerScriptNames).find((key) => key.includes(appName));
        if (workerKey) {
            const workerName = pulumiOutputs.workerScriptNames[workerKey];
            if (workerName) {
                return workerName;
            }
        }
    } else {
        const appIndexMap: Record<string, string> = {
            web: "pages-project-0",
            admin: "pages-project-1",
            wiki: "pages-project-2",
        };
        const pagesKey = appIndexMap[appName];
        if (pagesKey) {
            const pagesName = pulumiOutputs.pagesProjectNames[pagesKey];
            if (pagesName) {
                return pagesName;
            }
        }
    }

    throw new Error(`Project name not found in Pulumi outputs for app: ${appName}`);
}
