import Enquirer from "enquirer";
import type { ChangeCategory, VersionType } from "./types.js";

type EnquirerWithPrompts = typeof Enquirer & {
    Select: new (options: object) => { run(): Promise<unknown> };
    MultiSelect: new (options: object) => { run(): Promise<unknown> };
    Input: new (options: object) => { run(): Promise<unknown> };
};

const { Select, MultiSelect, Input } = Enquirer as EnquirerWithPrompts;

export async function promptPackages(availablePackages: string[], affectedPackages: string[]): Promise<string[]> {
    if (affectedPackages.length === 0) {
        console.log("\n変更されたファイルが検出されませんでした。");
        console.log("すべてのパッケージから選択してください。\n");
    } else {
        console.log("\n以下のパッケージに変更が検出されました:");
        for (const pkg of affectedPackages) {
            console.log(`  - ${pkg}`);
        }
        console.log("");
    }

    const prompt = new MultiSelect({
        name: "packages",
        message: "changesetに含めるパッケージを選択してください（スペースで選択、Enterで確定）",
        choices: availablePackages,
        initial: affectedPackages,
    });

    return (await prompt.run()) as string[];
}

export async function promptVersionType(): Promise<VersionType> {
    const prompt = new Select({
        name: "versionType",
        message: "バージョンアップの種類を選択してください",
        choices: [
            { name: "patch", message: "patch - バグ修正、ドキュメント更新" },
            { name: "minor", message: "minor - 新機能追加（後方互換性あり）" },
            { name: "major", message: "major - 破壊的変更" },
        ],
    });

    return (await prompt.run()) as VersionType;
}

export async function promptCategory(): Promise<ChangeCategory> {
    const prompt = new Select({
        name: "category",
        message: "変更のカテゴリを選択してください",
        choices: [
            { name: "feat", message: "feat - 新機能の追加" },
            { name: "fix", message: "fix - バグの修正" },
            { name: "docs", message: "docs - ドキュメントのみの変更" },
            { name: "style", message: "style - コードの動作に影響しない変更" },
            { name: "refactor", message: "refactor - コードのリファクタリング" },
            { name: "perf", message: "perf - パフォーマンス改善" },
            { name: "test", message: "test - テストの追加や修正" },
            { name: "build", message: "build - ビルドシステムの変更" },
            { name: "ci", message: "ci - CI設定の変更" },
            { name: "chore", message: "chore - その他の変更" },
            { name: "revert", message: "revert - 以前のコミットの取り消し" },
            { name: "improvement", message: "improvement - 既存機能の改善" },
            { name: "security", message: "security - セキュリティ関連の修正" },
        ],
    });

    return (await prompt.run()) as ChangeCategory;
}

export async function promptSummary(): Promise<string> {
    const templates = [
        "新機能を追加",
        "バグを修正",
        "ドキュメントを更新",
        "パフォーマンスを改善",
        "依存関係を更新",
        "リファクタリングを実施",
        "セキュリティを強化",
        "テストを追加",
        "ビルド設定を変更",
        "CI設定を更新",
        "カスタム入力...",
    ];

    const templatePrompt = new Select({
        name: "template",
        message: "変更内容のサマリーを選択してください",
        choices: templates,
    });

    const selected = (await templatePrompt.run()) as string;

    if (selected === "カスタム入力...") {
        const inputPrompt = new Input({
            name: "summary",
            message: "変更内容のサマリーを入力してください",
        });

        return (await inputPrompt.run()) as string;
    }

    return selected;
}

export async function confirmChangeset(
    packages: string[],
    versionType: VersionType,
    category: ChangeCategory,
    summary: string,
): Promise<boolean> {
    console.log("\n=== Changeset 確認 ===");
    console.log(`パッケージ: ${packages.join(", ")}`);
    console.log(`バージョン: ${versionType}`);
    console.log(`カテゴリ: ${category}`);
    console.log(`サマリー: ${summary}`);
    console.log("==================\n");

    const prompt = new Select({
        name: "confirm",
        message: "この内容でchangesetを作成しますか？",
        choices: ["はい", "いいえ"],
    });

    const answer = (await prompt.run()) as string;
    return answer === "はい";
}
