import * as fs from "node:fs";
import * as path from "node:path";
import { getAppsConfig } from "./appsConfig.js";
import { generateArchitectureDoc } from "./architectureDoc.js";
import { getProjectNameFromPulumi, getPulumiOutputs, getStackConfig } from "./stackConfig.js";
import { updateInfraArchitectureDoc } from "./updateArchitectureDoc.js";
import { generateWranglerToml, getCompatibilityDate } from "./wrangler.js";

function resolveInfraRoot(): string {
    const cwd = process.cwd();
    for (const dir of [cwd, path.join(cwd, "infra")]) {
        const envExample = path.join(dir, "env.example.yaml");
        if (fs.existsSync(envExample) && fs.statSync(envExample).isFile()) {
            return dir;
        }
    }
    return cwd;
}

function generateConfigs(): void {
    const INFRA_ROOT = resolveInfraRoot();
    process.env.INFRA_ROOT = INFRA_ROOT;
    const domain = getStackConfig("domain");
    const compatibilityDate = getCompatibilityDate();
    const workspaceRoot = path.resolve(process.cwd(), "..");
    const pulumiOutputs = getPulumiOutputs();
    const appsConfig = getAppsConfig(domain);

    for (const app of appsConfig) {
        let projectName: string;
        try {
            projectName = getProjectNameFromPulumi(app.name, app.type, pulumiOutputs);
        } catch {
            continue;
        }
        const appDir = path.join(workspaceRoot, "apps", app.name);
        const wranglerPath = path.join(appDir, "wrangler.toml");

        generateWranglerToml(
            {
                name: projectName,
                type: app.type,
                compatibilityDate,
                buildCommand: app.buildCommand,
                outputDir: app.outputDir,
                watchDirs: app.watchDirs,
                main: app.main,
                vars: app.vars,
            },
            wranglerPath,
        );
    }

    const graphOk = generateArchitectureDoc();
    if (!graphOk) {
        console.warn("[generate] Architecture doc (graph) generation failed. Wrangler configs were updated.");
    }

    const mermaidOk = updateInfraArchitectureDoc(INFRA_ROOT);
    if (!mermaidOk) {
        console.warn("[generate] Mermaid diagram update failed. Architecture doc was not updated.");
    }
}

generateConfigs();
