---
files: ["**/*"]
alwaysApply: true
---

# テンプレート使用ルール

## IMPORTANT: 作業開始前に該当するテンプレートを必ず読み込むこと

## テンプレート一覧

### SDD（仕様駆動開発）

| 作業 | テンプレート | 使用タイミング |
| ---- | ------------ | -------------- |
| シーケンス図作成 | `.claude/templates/sdd/sequence-diagram.md` | 新規API設計時 |
| API仕様書作成 | `.claude/templates/sdd/api-spec.md` | APIドキュメント作成時 |
| DB仕様書作成 | `.claude/templates/sdd/db-spec.md` | テーブル設計時 |
| ユーザーストーリー作成 | `.claude/templates/sdd/user-story.md` | 要件定義時 |

### TDD（テスト駆動開発）

| 作業 | テンプレート | 使用タイミング |
| ---- | ------------ | -------------- |
| ユニットテスト作成 | `.claude/templates/tdd/unit-test.md` | Small Test作成時 |
| 統合テスト作成 | `.claude/templates/tdd/integration-test.md` | Medium Test作成時 |
| E2Eテスト作成 | `.claude/templates/tdd/e2e-test.md` | Large Test作成時 |

### コードリーディング

| 作業 | テンプレート | 使用タイミング |
| ---- | ------------ | -------------- |
| アーキテクチャ分析 | `.claude/templates/code-reading/architecture-analysis.md` | プロジェクト構造把握時 |
| 依存関係分析 | `.claude/templates/code-reading/dependency-analysis.md` | モジュール分析時 |
| コード調査 | `.claude/templates/code-reading/code-investigation.md` | バグ調査・機能調査時 |

### ワークフロー

| 作業 | テンプレート | 使用タイミング |
| ---- | ------------ | -------------- |
| コードレビュー | `.claude/templates/workflow/code-review.md` | PR・コードレビュー時 |
| リファクタリング | `.claude/templates/workflow/refactoring.md` | コード改善時 |
| バグ修正 | `.claude/templates/workflow/bug-fix.md` | バグ修正時 |
| PR作成 | `.claude/templates/workflow/pr-creation.md` | PR作成時 |

## トリガー＆アクション

| トリガー | アクション |
| -------- | ---------- |
| 「シーケンス図を作成して」 | `.claude/templates/sdd/sequence-diagram.md` を読み込んでから作成 |
| 「API仕様を書いて」 | `.claude/templates/sdd/api-spec.md` を読み込んでから作成 |
| 「テストを書いて」（ユニット） | `.claude/templates/tdd/unit-test.md` を読み込んでから作成 |
| 「テストを書いて」（統合） | `.claude/templates/tdd/integration-test.md` を読み込んでから作成 |
| 「E2Eテストを書いて」 | `.claude/templates/tdd/e2e-test.md` を読み込んでから作成 |
| 「コードを調査して」 | `.claude/templates/code-reading/code-investigation.md` を読み込んでから実行 |
| 「レビューして」 | `.claude/templates/workflow/code-review.md` を読み込んでから実行 |
| 「リファクタリングして」 | `.claude/templates/workflow/refactoring.md` を読み込んでから実行 |
| 「バグを修正して」 | `.claude/templates/workflow/bug-fix.md` を読み込んでから実行 |
| 「PRを作成して」 | `.claude/templates/workflow/pr-creation.md` を読み込んでから実行 |

## テンプレート使用手順

1. **テンプレートを読み込む**: `Read`ツールで該当テンプレートを読み込む
2. **テンプレートに従う**: プレースホルダーを実際の値で置換
3. **チェックリスト確認**: テンプレート末尾のチェックリストを全て満たす
4. **出力フォーマット準拠**: テンプレートの出力フォーマットに従って報告

## テンプレートを使う理由

- **一貫性**: 誰が作業しても同じ形式のアウトプット
- **品質**: チェックリストで漏れを防止
- **効率**: 再利用可能なパターン
- **トレーサビリティ**: 仕様とテストの対応関係を維持
