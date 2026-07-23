import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getReportMetadata } from "~/lib/reports/parser";
import type { CoverageSummary } from "~/lib/reports/types";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: `Coverage Report: ${data?.report.project} - Test Portal` }];
};

export async function loader({ params }: LoaderFunctionArgs) {
    const { project, id } = params;
    if (!project || !id) {
        throw new Response("Not Found", { status: 404 });
    }

    const report = getReportMetadata(project, id, "coverage");
    const reportUrl = `/reports/coverage/${project}/${id}/index.html`;

    return json({ report, reportUrl });
}

function CoverageBar({ label, metric }: { label: string; metric: { pct: number; covered: number; total: number } }) {
    const getColor = (pct: number) => {
        if (pct >= 90) return "#10b981";
        if (pct >= 75) return "#f59e0b";
        return "#ef4444";
    };

    return (
        <div style={{ marginBottom: "1rem" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.25rem",
                    fontSize: "0.875rem",
                }}
            >
                <strong>{label}</strong>
                <span>
                    {metric.pct.toFixed(1)}% ({metric.covered}/{metric.total})
                </span>
            </div>
            <div style={{ backgroundColor: "#e5e7eb", borderRadius: "4px", height: "8px", overflow: "hidden" }}>
                <div
                    style={{
                        width: `${metric.pct}%`,
                        height: "100%",
                        backgroundColor: getColor(metric.pct),
                        transition: "width 0.3s",
                    }}
                />
            </div>
        </div>
    );
}

export default function CoverageReportDetail() {
    const { report, reportUrl } = useLoaderData<typeof loader>();
    const summary = report.summary as CoverageSummary | undefined;

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ marginBottom: "1rem" }}>
                <Link to="/coverage" style={{ color: "#3b82f6", textDecoration: "none" }}>
                    ← Back to Coverage Reports
                </Link>
            </div>

            <div
                style={{
                    backgroundColor: "white",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    marginBottom: "1.5rem",
                }}
            >
                <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>📈 {report.project} - Coverage Report</h1>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr",
                        gap: "0.5rem 1rem",
                        fontSize: "0.875rem",
                        marginBottom: "1.5rem",
                    }}
                >
                    <strong>Report ID:</strong>
                    <span>{report.timestamp.split("T")[0]}</span>
                    <strong>Branch:</strong>
                    <span>{report.branch}</span>
                    <strong>Commit:</strong>
                    <span style={{ fontFamily: "monospace" }}>{report.commitSha}</span>
                </div>

                {summary && (
                    <div>
                        <h2 style={{ fontSize: "1.125rem", marginBottom: "1rem" }}>Coverage Metrics</h2>
                        <CoverageBar label="Lines" metric={summary.lines} />
                        <CoverageBar label="Statements" metric={summary.statements} />
                        <CoverageBar label="Functions" metric={summary.functions} />
                        <CoverageBar label="Branches" metric={summary.branches} />
                    </div>
                )}
            </div>

            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                }}
            >
                <iframe
                    src={reportUrl}
                    style={{
                        width: "100%",
                        height: "800px",
                        border: "none",
                    }}
                    title="Coverage Report"
                />
            </div>
        </div>
    );
}
