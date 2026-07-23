import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getReportMetadata } from "~/lib/reports/parser";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: `E2E Report: ${data?.report.project} - Test Portal` }];
};

export async function loader({ params }: LoaderFunctionArgs) {
    const { project, id } = params;
    if (!project || !id) {
        throw new Response("Not Found", { status: 404 });
    }

    const report = getReportMetadata(project, id, "e2e");
    const reportUrl = `/reports/e2e/${project}/${id}/index.html`;

    return json({ report, reportUrl });
}

export default function E2EReportDetail() {
    const { report, reportUrl } = useLoaderData<typeof loader>();

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ marginBottom: "1rem" }}>
                <Link to="/e2e" style={{ color: "#3b82f6", textDecoration: "none" }}>
                    ← Back to E2E Reports
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
                <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🎭 {report.project} - E2E Test Report</h1>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr",
                        gap: "0.5rem 1rem",
                        fontSize: "0.875rem",
                    }}
                >
                    <strong>Report ID:</strong>
                    <span>{report.timestamp.split("T")[0]}</span>
                    <strong>Branch:</strong>
                    <span>{report.branch}</span>
                    <strong>Commit:</strong>
                    <span style={{ fontFamily: "monospace" }}>{report.commitSha}</span>
                    {report.summary && "passed" in report.summary && (
                        <>
                            <strong>Tests:</strong>
                            <span>
                                ✅ {report.summary.passed} passed / ❌ {report.summary.failed} failed / ⏭️{" "}
                                {report.summary.skipped} skipped
                            </span>
                            <strong>Duration:</strong>
                            <span>{(report.summary.duration / 1000).toFixed(2)}s</span>
                        </>
                    )}
                </div>
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
                    title="E2E Test Report"
                />
            </div>
        </div>
    );
}
