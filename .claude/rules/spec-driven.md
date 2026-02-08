---
files: ["**/*"]
---

# 仕様駆動開発ルール

## IMPORTANT: 最優先

- 実装を開始するとき → まず `docs/sequence/`, `docs/specs/` を確認
- 不明点があるとき → 推測せずユーザーに質問
- 破壊的変更をするとき → ユーザーの明示的な許可を得る

## テンプレート参照

仕様書を作成するときは、必ず該当テンプレートを読み込んでから作成：

| 仕様書 | テンプレート |
| ------ | ------------ |
| シーケンス図 | `.claude/templates/sdd/sequence-diagram.md` |
| API仕様書 | `.claude/templates/sdd/api-spec.md` |
| DB仕様書 | `.claude/templates/sdd/db-spec.md` |
| ユーザーストーリー | `.claude/templates/sdd/user-story.md` |

## トリガー＆アクション

| トリガー | アクション |
| -------- | ---------- |
| 新機能を実装するとき | `docs/sequence/` のシーケンス図を確認 or テンプレートに従って作成 |
| APIを変更するとき | `docs/specs/api/` の仕様を確認 or テンプレートに従って更新 |
| DBスキーマを変更するとき | `docs/specs/db/` を確認、`packages/db/prisma/schema/` を編集 |
| テストを書くとき | TDD（Red → Green → Refactor）に従う |
| 実装計画を立てたとき | ユーザーに提示して許可を得る |

## 禁止

- 仕様確認前の実装開始
- テストなしのコード実装
- 許可なしの破壊的変更
