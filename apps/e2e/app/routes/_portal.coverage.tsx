import type { MetaFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getAllProjects, getProjectReports } from "~/lib/reports/parser";

export const meta: MetaFunction = () => {
    return [{ title: "Coverage Reports - Test Portal" }];
};

export async function loader() {
    const projects = getAllProjects("coverage");
    const reports = projects.map((project) => ({
        project,
        reports: getProjectReports(project, "coverage"),
    }));

    return { reports };
}

export default function CoverageReports() {
    const { reports } = useLoaderData<typeof loader>();

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>📈 Coverage Reports</h1>

            {reports.length === 0 ? (
                <div
                    style={{
                        backgroundColor: "white",
                        padding: "2rem",
                        borderRadius: "8px",
                        textAlign: "center",
                        color: "#6b7280",
                    }}
                >
                    <p>カバレッジレポートがまだありません。</p>
                    <p>テストを実行してレポートを生成してください。</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {reports.map(({ project, reports: projectReports }) => (
                        <div
                            key={project}
                            style={{
                                backgroundColor: "white",
                                padding: "1.5rem",
                                borderRadius: "8px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                        >
                            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1f2937" }}>📦 {project}</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                {projectReports.map((report) => (
                                    <Link
                                        key={report.id}
                                        to={`/coverage/${project}/${report.id}`}
                                        style={{
                                            padding: "1rem",
                                            backgroundColor: "#f9fafb",
                                            borderRadius: "4px",
                                            textDecoration: "none",
                                            color: "#1f2937",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 500 }}>{report.id}</div>
                                            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                                                {new Date(report.metadata.timestamp).toLocaleString("ja-JP")}
                                            </div>
                                        </div>
                                        {report.metadata.summary && "lines" in report.metadata.summary && (
                                            <div style={{ fontSize: "0.875rem", display: "flex", gap: "1rem" }}>
                                                <span>Lines: {report.metadata.summary.lines.pct.toFixed(1)}%</span>
                                                <span>
                                                    Branches: {report.metadata.summary.branches.pct.toFixed(1)}%
                                                </span>
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
