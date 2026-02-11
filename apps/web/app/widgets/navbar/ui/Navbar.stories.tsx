import "~/tailwind.css";

export default {
    title: "widgets/navbar/Navbar",
};

export const Info = () => (
    <div className="p-4">
        <h2 className="mb-4 font-bold text-xl">Navbar</h2>
        <p className="mb-4 text-color-copy-light">
            NavbarコンポーネントはRemixのuseLoaderData、useFetcher、useLocationを使用しています。
            実際の使用時はRemixのコンテキスト内で動作します。
        </p>
        <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <h3 className="mb-2 font-bold text-sm">使用例:</h3>
            <pre className="overflow-x-auto whitespace-pre-wrap text-xs">
                <code>&lt;Navbar /&gt;</code>
            </pre>
        </div>
        <div className="mt-4 rounded-lg bg-yellow-100 p-4 dark:bg-yellow-900">
            <p className="text-sm">
                ⚠️ このコンポーネントはRemixのhooksに依存しているため、
                Storybook上での完全な動作確認にはRemixのコンテキストが必要です。
            </p>
        </div>
    </div>
);
