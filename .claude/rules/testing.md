---
files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/tests/**/*", "**/e2e/**/*"]
---

# テストルール

テスト戦略・サイズ別命名・配置・TDD サイクル・カバレッジ・作成基準はここに記載せず、以下のドキュメントとテンプレートを参照すること。

## 参照ドキュメント

- [テスト戦略](docs/testing/testing-strategy.md)（Google Test Sizes・カバレッジ目標）
- [テストガイド](docs/testing/testing-guide.md)（書き方・配置・実行）
- [開発ワークフロー](docs/development/workflow.md)（TDD サイクル）

テスト作成時は該当テンプレートを読み込むこと: `.claude/templates/tdd/unit-test.md`（Small）、`.claude/templates/tdd/integration-test.md`（Medium）、`.claude/templates/tdd/e2e-test.md`（Large）。

## 禁止（要約）

- テストなしでのコードマージ
- `test.skip` の放置
- Medium Test なしでの機能リリース

詳細な禁止事項は [テストガイド](docs/testing/testing-guide.md) を参照すること。
