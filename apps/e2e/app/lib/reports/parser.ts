import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { ProjectReport, ReportMetadata } from "./types";

const REPORTS_DIR = join(process.cwd(), "public", "reports");

export function getAllProjects(reportType: "e2e" | "coverage"): string[] {
    const typeDir = join(REPORTS_DIR, reportType);
    if (!existsSync(typeDir)) {
        return [];
    }

    return readdirSync(typeDir).filter((item) => {
        const itemPath = join(typeDir, item);
        return statSync(itemPath).isDirectory();
    });
}

export function getProjectReports(projectName: string, reportType: "e2e" | "coverage"): ProjectReport[] {
    const projectDir = join(REPORTS_DIR, reportType, projectName);
    if (!existsSync(projectDir)) {
        return [];
    }

    const reportDirs = readdirSync(projectDir)
        .filter((item) => {
            const itemPath = join(projectDir, item);
            return statSync(itemPath).isDirectory();
        })
        .sort()
        .reverse();

    return reportDirs.map((reportId) => {
        const reportPath = join(projectDir, reportId);
        const metadata = getReportMetadata(projectName, reportId, reportType);

        return {
            id: reportId,
            metadata,
            path: `/reports/${reportType}/${projectName}/${reportId}`,
        };
    });
}

export function getReportMetadata(
    projectName: string,
    reportId: string,
    reportType: "e2e" | "coverage",
): ReportMetadata {
    const metadataPath = join(REPORTS_DIR, reportType, projectName, reportId, "metadata.json");

    if (existsSync(metadataPath)) {
        const content = readFileSync(metadataPath, "utf-8");
        return JSON.parse(content) as ReportMetadata;
    }

    const [timestamp, commitSha] = reportId.split("-");
    return {
        project: projectName,
        timestamp: timestamp || new Date().toISOString(),
        commitSha: commitSha || "unknown",
        branch: "master",
        reportType,
    };
}
