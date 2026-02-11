import { TrackingGTMIFrame } from "./TrackingGTMIFrame";
import { TrackingGTMScript } from "./TrackingGTMScript";
import "~/tailwind.css";

export default {
    title: "features/tracking/TrackingGTM",
};

export const GTMScriptInfo = () => (
    <div className="p-4">
        <h2 className="mb-4 font-bold text-xl">TrackingGTMScript</h2>
        <p className="mb-4 text-color-copy-light">
            Google Tag Managerのスクリプトを出力するコンポーネントです。 &lt;head&gt;タグ内に配置します。
        </p>
        <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <h3 className="mb-2 font-bold text-sm">使用例:</h3>
            <pre className="overflow-x-auto text-xs">{`<TrackingGTMScript id="GTM-XXXXXXX" />`}</pre>
        </div>
        <div className="mt-4 rounded-lg bg-yellow-100 p-4 dark:bg-yellow-900">
            <p className="text-sm">
                ⚠️ このコンポーネントは&lt;script&gt;タグを出力するため、 Ladle上での視覚的な表示はありません。
            </p>
        </div>
    </div>
);

export const GTMIFrameInfo = () => (
    <div className="p-4">
        <h2 className="mb-4 font-bold text-xl">TrackingGTMIFrame</h2>
        <p className="mb-4 text-color-copy-light">
            Google Tag Managerのnoscript用iframeを出力するコンポーネントです。 &lt;body&gt;タグ直後に配置します。
        </p>
        <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <h3 className="mb-2 font-bold text-sm">使用例:</h3>
            <pre className="overflow-x-auto text-xs">{`<TrackingGTMIFrame id="GTM-XXXXXXX" />`}</pre>
        </div>
        <div className="mt-4 rounded-lg bg-yellow-100 p-4 dark:bg-yellow-900">
            <p className="text-sm">
                ⚠️ このコンポーネントは&lt;noscript&gt;タグ内にiframeを出力するため、
                Ladle上での視覚的な表示はありません。
            </p>
        </div>
    </div>
);

export const GTMImplementation = () => (
    <div className="p-4">
        <h2 className="mb-4 font-bold text-xl">GTM実装ガイド</h2>
        <div className="space-y-4">
            <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <h3 className="mb-2 font-bold text-sm">1. root.tsxでの使用:</h3>
                <pre className="overflow-x-auto whitespace-pre-wrap text-xs">
                    <code>
                        &lt;TrackingGTMScript id="GTM-XXXXXXX" /&gt; &lt;TrackingGTMIFrame id="GTM-XXXXXXX" /&gt;
                    </code>
                </pre>
            </div>
            <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <h3 className="mb-2 font-bold text-sm">2. 環境変数:</h3>
                <pre className="overflow-x-auto text-xs">{"GOOGLE_TAG_MANAGER=GTM-XXXXXXX"}</pre>
            </div>
        </div>
    </div>
);

export const ActualComponents = () => (
    <div className="p-4">
        <h2 className="mb-4 font-bold text-xl">実際のコンポーネント出力</h2>
        <p className="mb-4 text-color-copy-light text-sm">
            以下にコンポーネントがレンダリングされていますが、視覚的には表示されません。
            ブラウザの開発者ツールでHTMLを確認してください。
        </p>
        <div className="rounded-lg border border-gray-400 border-dashed p-4">
            <TrackingGTMScript id="GTM-EXAMPLE" />
            <TrackingGTMIFrame id="GTM-EXAMPLE" />
            <p className="text-gray-500 text-xs">（script と noscript タグがここに出力されています）</p>
        </div>
    </div>
);
