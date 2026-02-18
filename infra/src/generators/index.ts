import * as path from "node:path";
import { getAppsConfig } from "./appsConfig.js";
import { generateArchitectureDoc } from "./architectureDoc.js";
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
    }

    const graphOk = generateArchitectureDoc();
    if (!graphOk) {
        console.warn("[generate] Architecture doc (graph) generation failed. Wrangler configs were updated.");
    }

    const mermaidOk = updateInfraArchitectureDoc();
    if (!mermaidOk) {
        console.warn("[generate] Mermaid diagram update failed. Architecture doc was not updated.");
    }
}

generateConfigs();
