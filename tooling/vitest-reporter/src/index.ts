import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

export interface MonorepoVitestReporterOptions {
    outputDir?: string;
    projectName?: string;
    coverageDir?: string;
}

interface CoverageSummary {
    lines: {
        total: number;
        covered: number;
        skipped: number;
        pct: number;
    };
    statements: {
        total: number;
        covered: number;
        skipped: number;
        pct: number;
    };
    functions: {
        total: number;
        covered: number;
        skipped: number;
        pct: number;
    };
    branches: {
        total: number;
        covered: number;
        skipped: number;
        pct: number;
    };
}

interface CoverageMetadata {
    project: string;
    timestamp: string;
    commitSha: string;
    branch: string;
    runId?: string;
    runNumber?: string;
    workflow?: string;
    event?: string;
    reportType: "coverage";
    summary: CoverageSummary;
}

interface VitestReporterLike {
    onFinished?(): void | Promise<void>;
}

class MonorepoVitestReporter implements VitestReporterLike {
    private readonly options: MonorepoVitestReporterOptions;

    constructor(options: MonorepoVitestReporterOptions = {}) {
        this.options = options;
    }

    async onFinished() {
        const projectName = this.options.projectName || this.getProjectName();
        const baseOutputDir = this.options.outputDir || "../wiki/reports/test";
        const coverageDir = this.options.coverageDir || "./coverage";

        const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
        const commitSha = this.getCommitSha().substring(0, 8);
        const runDir = join(baseOutputDir, projectName, `${timestamp}-${commitSha}`);

        const targetReportDir = resolve(runDir);

        if (!existsSync(targetReportDir)) {
            mkdirSync(targetReportDir, { recursive: true });
        }

        const coverageSummaryPath = resolve(coverageDir, "coverage-summary.json");

        if (!existsSync(coverageSummaryPath)) {
            console.warn(`Coverage summary not found at ${coverageSummaryPath}`);
            return;
        }

        const coverageSummaryContent = readFileSync(coverageSummaryPath, "utf-8");
        const coverageSummary = JSON.parse(coverageSummaryContent);
        const totalCoverage = coverageSummary.total;

        const summary: CoverageSummary = {
            lines: totalCoverage.lines,
            statements: totalCoverage.statements,
            functions: totalCoverage.functions,
            branches: totalCoverage.branches,
        };

        const resolvedCoverageDir = resolve(coverageDir);
        if (existsSync(resolvedCoverageDir)) {
            cpSync(resolvedCoverageDir, targetReportDir, { recursive: true });
        }

        const metadata: CoverageMetadata = {
            project: projectName,
            timestamp: new Date().toISOString(),
            commitSha: this.getCommitSha(),
            branch: this.getBranch(),
            runId: process.env.GITHUB_RUN_ID,
            runNumber: process.env.GITHUB_RUN_NUMBER,
            workflow: process.env.GITHUB_WORKFLOW,
            event: process.env.GITHUB_EVENT_NAME,
            reportType: "coverage",
            summary,
        };

        const metadataPath = join(targetReportDir, "metadata.json");
        writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), "utf-8");
    }

    private getProjectName(): string {
        const cwd = process.cwd();
        if (cwd.includes("/apps/api")) {
            return "api";
        }
        if (cwd.includes("/apps/web")) {
            return "web";
        }
        if (cwd.includes("/apps/admin")) {
            return "admin";
        }
        return "unknown";
    }

    private getCommitSha(): string {
        try {
            return execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();
        } catch {
            return "unknown";
        }
    }

    private getBranch(): string {
        try {
            return execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim();
        } catch {
            return "unknown";
        }
    }
}

export default MonorepoVitestReporter;
