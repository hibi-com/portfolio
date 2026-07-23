import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
    return [{ title: "Dashboard - Test Portal" }];
};

export default function Dashboard() {
    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>📊 Dashboard</h1>

            <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}
            >
                <div
                    style={{
                        backgroundColor: "white",
                        padding: "1.5rem",
                        borderRadius: "8px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#1f2937" }}>
                        🎭 E2E Test Reports
                    </h2>
                    <p style={{ color: "#6b7280", marginBottom: "1rem" }}>Playwright実行結果の確認</p>
                    <a
                        href="/e2e"
                        style={{
                            display: "inline-block",
                            padding: "0.5rem 1rem",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            textDecoration: "none",
                            borderRadius: "4px",
                        }}
                    >
                        View Reports
                    </a>
                </div>

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "1.5rem",
                        borderRadius: "8px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#1f2937" }}>
                        📈 Coverage Reports
                    </h2>
                    <p style={{ color: "#6b7280", marginBottom: "1rem" }}>Vitestカバレッジレポート</p>
                    <a
                        href="/coverage"
                        style={{
                            display: "inline-block",
                            padding: "0.5rem 1rem",
                            backgroundColor: "#10b981",
                            color: "white",
                            textDecoration: "none",
                            borderRadius: "4px",
                        }}
                    >
                        View Reports
                    </a>
                </div>

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "1.5rem",
                        borderRadius: "8px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#1f2937" }}>📦 Projects</h2>
                    <p style={{ color: "#6b7280", marginBottom: "1rem" }}>全プロジェクト一覧</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        <li style={{ padding: "0.25rem 0" }}>• API</li>
                        <li style={{ padding: "0.25rem 0" }}>• Web</li>
                        <li style={{ padding: "0.25rem 0" }}>• Admin</li>
                    </ul>
                </div>
            </div>

            <div
                style={{
                    marginTop: "2rem",
                    backgroundColor: "white",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
            >
                <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "#1f2937" }}>🚀 最新のテスト実行</h2>
                <p style={{ color: "#6b7280" }}>テストレポートはまだありません。テストを実行してください。</p>
            </div>
        </div>
    );
}
