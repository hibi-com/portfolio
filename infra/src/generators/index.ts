import * as path from "node:path";
import { getAppsConfig } from "./appsConfig.js";
import { generateArchitectureDoc } from "./architectureDoc.js";
import { updateDeployScript } from "./packageScripts.js";
import { getProjectNameFromPulumi, getPulumiOutputs, getStackConfig } from "./stackConfig.js";
import { updateInfraArchitectureDoc } from "./updateArchitectureDoc.js";
import { generateWranglerToml, getCompatibilityDate } from "./wrangler.js";

function generateConfigs(): void {
    const domain = getStackConfig("domain");
    const compatibilityDate = getCompatibilityDate();
    const workspaceRoot = path.resolve(process.cwd(), "..");
    const pulumiOutputs = getPulumiOutputs();
    const appsConfig = getAppsConfig(domain);

    for (const app of appsConfig) {
        const appDir = path.join(workspaceRoot, "apps", app.name);
        const wranglerPath = path.join(appDir, "wrangler.toml");
        const packageJsonPath = path.join(appDir, "package.json");
        const projectName = getProjectNameFromPulumi(app.name, app.type, pulumiOutputs);

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

        updateDeployScript(packageJsonPath, app.type, projectName);
    }

    // Pulumi stack graph を生成（オプショナル）
    const graphOk = generateArchitectureDoc();
    if (!graphOk) {
        console.warn("[generate] Architecture doc (graph) generation failed. Wrangler configs were updated.");
    }

    // Mermaid 図を含む infra-architecture.md を自動更新
    const mermaidOk = updateInfraArchitectureDoc();
    if (!mermaidOk) {
        console.warn("[generate] Mermaid diagram update failed. Architecture doc was not updated.");
    }
}

generateConfigs();
