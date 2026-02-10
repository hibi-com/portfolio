import * as fs from "node:fs";

interface PackageJson {
    scripts?: Record<string, string>;
    [key: string]: unknown;
}

export function updateDeployScript(packageJsonPath: string, appType: "pages" | "worker", projectName: string): void {
    const content = fs.readFileSync(packageJsonPath, "utf-8");
    const pkg: PackageJson = JSON.parse(content);

    pkg.scripts ??= {};

    if (appType === "pages") {
        pkg.scripts.deploy = `env -- wrangler pages deploy --project-name ${projectName} --branch master`;
    } else {
        pkg.scripts.deploy = `env -- wrangler deploy --name ${projectName}`;
    }

    fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf-8");
}
