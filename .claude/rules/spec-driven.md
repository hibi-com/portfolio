---
files: ["**/*"]
---

# 仕様駆動開発ルール

## IMPORTANT: 最優先

- 実装を開始するとき → まず `docs/sequence/`, `docs/specs/` を確認
- 不明点があるとき → 推測せずユーザーに質問
- 破壊的変更をするとき → ユーザーの明示的な許可を得る

トリガー＆アクション・仕様書の作成手順はここに記載せず、以下のドキュメントとテンプレートを参照すること。

## 参照ドキュメント

- [開発ワークフロー](docs/development/workflow.md)（SDD + TDD の流れ）
- [ドキュメントマップ](docs/index.md)（仕様・設計の配置）
- [シーケンス図](docs/sequence/) / [API仕様](docs/specs/api/) / [DB仕様](docs/specs/db/) / [ユーザーストーリー](docs/user-stories/)

仕様書作成時は該当テンプレートを読み込むこと: `.claude/templates/sdd/sequence-diagram.md`, `api-spec.md`, `db-spec.md`, `user-story.md`。

## 禁止

- 仕様確認前の実装開始
- テストなしのコード実装
- 許可なしの破壊的変更
