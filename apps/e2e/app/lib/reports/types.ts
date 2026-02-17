export interface ReportMetadata {
    project: string;
    timestamp: string;
    commitSha: string;
    branch: string;
    reportType: "e2e" | "coverage";
    summary?: E2ESummary | CoverageSummary;
}

export interface E2ESummary {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
}

export interface CoverageSummary {
    lines: CoverageMetric;
    statements: CoverageMetric;
    functions: CoverageMetric;
    branches: CoverageMetric;
}

export interface CoverageMetric {
    total: number;
    covered: number;
    pct: number;
}

export interface ProjectReport {
    id: string;
    metadata: ReportMetadata;
    path: string;
}
