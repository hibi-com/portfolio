import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
    return [{ title: "Test Portal - Dashboard" }, { name: "description", content: "Test reports dashboard" }];
};

export default function Index() {
    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8", padding: "2rem" }}>
            <h1>🧪 Test Portal - Dashboard</h1>
            <p>テストレポートポータルサイト（認証機能は次のタスクで実装）</p>
            <ul>
                <li>
                    <strong>E2E Test Reports</strong> - Playwright実行結果
                </li>
                <li>
                    <strong>Coverage Reports</strong> - Vitestカバレッジ
                </li>
            </ul>
        </div>
    );
}
