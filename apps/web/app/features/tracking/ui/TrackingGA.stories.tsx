import { TrackingGA } from "./TrackingGA";
import "~/tailwind.css";

export default {
    title: "features/tracking/TrackingGA",
};

export const GAInfo = () => (
    <div className="p-4">
        <h2 className="mb-4 font-bold text-xl">TrackingGA</h2>
        <p className="mb-4 text-color-copy-light">
            Google Analyticsのスクリプトを出力するコンポーネントです。 &lt;head&gt;タグ内に配置します。
        </p>
        <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <h3 className="mb-2 font-bold text-sm">使用例:</h3>
            <pre className="overflow-x-auto text-xs">{`<TrackingGA id="G-XXXXXXXXXX" />`}</pre>
        </div>
        <div className="mt-4 rounded-lg bg-yellow-100 p-4 dark:bg-yellow-900">
            <p className="text-sm">
                ⚠️ このコンポーネントは&lt;script&gt;タグを出力するため、 Ladle上での視覚的な表示はありません。
            </p>
        </div>
    </div>
);

export const GAImplementation = () => (
    <div className="p-4">
        <h2 className="mb-4 font-bold text-xl">GA実装ガイド</h2>
        <div className="space-y-4">
            <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <h3 className="mb-2 font-bold text-sm">1. root.tsxでの使用:</h3>
                <pre className="overflow-x-auto whitespace-pre-wrap text-xs">
                    <code>&lt;TrackingGA id="G-XXXXXXXXXX" /&gt;</code>
                </pre>
            </div>
            <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <h3 className="mb-2 font-bold text-sm">2. 環境変数:</h3>
                <pre className="overflow-x-auto text-xs">{"GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX"}</pre>
            </div>
        </div>
    </div>
);

export const ActualComponent = () => (
    <div className="p-4">
        <h2 className="mb-4 font-bold text-xl">実際のコンポーネント出力</h2>
        <p className="mb-4 text-color-copy-light text-sm">
            以下にコンポーネントがレンダリングされていますが、視覚的には表示されません。
            ブラウザの開発者ツールでHTMLを確認してください。
        </p>
        <div className="rounded-lg border border-gray-400 border-dashed p-4">
            <TrackingGA id="G-EXAMPLE" />
            <p className="text-gray-500 text-xs">（script タグがここに出力されています）</p>
        </div>
    </div>
);
