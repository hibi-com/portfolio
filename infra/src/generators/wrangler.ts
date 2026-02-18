import * as fs from "node:fs";
import * as path from "node:path";

interface WranglerConfig {
    name: string;
    type: "pages" | "worker";
    compatibilityDate: string;
    buildCommand?: string;
    outputDir?: string;
    watchDirs?: string[];
    main?: string;
    vars?: Record<string, string | boolean | number>;
}

function generatePagesWrangler(config: WranglerConfig): string {
    const lines: string[] = [
        `name = "${config.name}"`,
        `compatibility_date = "${config.compatibilityDate}"`,
        'compatibility_flags = ["nodejs_compat"]',
    ];

    if (config.outputDir) {
        lines.push(`pages_build_output_dir = "${config.outputDir}"`);
    }

    if (config.vars && Object.keys(config.vars).length > 0) {
        lines.push("", "[vars]");
        for (const [key, value] of Object.entries(config.vars)) {
            if (typeof value === "string") {
                lines.push(`${key} = "${value}"`);
            } else {
                lines.push(`${key} = ${value}`);
            }
        }
    }

    lines.push("");
    return lines.join("\n");
}

function generateWorkerWrangler(config: WranglerConfig): string {
    const lines: string[] = [
        `name = "${config.name}"`,
        `compatibility_date = "${config.compatibilityDate}"`,
        'compatibility_flags = ["nodejs_compat"]',
    ];

    if (config.main) {
        lines.push(`main = "${config.main}"`);
    }

    if (config.vars && Object.keys(config.vars).length > 0) {
        lines.push("", "[vars]");
        for (const [key, value] of Object.entries(config.vars)) {
            if (typeof value === "string") {
                lines.push(`${key} = "${value}"`);
            } else {
                lines.push(`${key} = ${value}`);
            }
        }
    }

    lines.push("");
    return lines.join("\n");
}

export function generateWranglerToml(config: WranglerConfig, outputPath: string): void {
    const content = config.type === "pages" ? generatePagesWrangler(config) : generateWorkerWrangler(config);

    fs.writeFileSync(outputPath, content, "utf-8");
}

export function getCompatibilityDate(): string {
    return "2025-11-17";
}
