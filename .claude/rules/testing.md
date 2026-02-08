---
files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/tests/**/*", "**/e2e/**/*"]
---

# テストルール

## IMPORTANT: TDDサイクル

新機能実装時は必ず:

```text
Red（テスト作成・失敗確認） → Green（最小限の実装） → Refactor（品質改善）
```

## テンプレート参照

テストを作成するときは、必ず該当テンプレートを読み込んでから作成：

| テストサイズ | テンプレート |
| ------------ | ------------ |
| Small（ユニット） | `.claude/templates/tdd/unit-test.md` |
| Medium（統合） | `.claude/templates/tdd/integration-test.md` |
| Large（E2E） | `.claude/templates/tdd/e2e-test.md` |

## テストサイズと命名

| サイズ | 命名 | 特徴 | 実行時間 |
| ------ | ---- | ---- | -------- |
| Small | `*.test.ts` | 単一プロセス、完全モック | < 100ms |
| Medium | `*.medium.test.ts` | DB接続可、シーケンス図対応 | < 1秒 |
| Large | `*.large.spec.ts` | E2E、ユーザーストーリー対応 | < 10秒 |

## トリガー＆アクション

| トリガー | アクション |
| -------- | ---------- |
| Small Test作成 | テンプレートに従い、正常系・境界値・異常系を網羅 |
| Medium Test作成 | テンプレートに従い、`@sequence` JSDocで対応シーケンス図を記載 |
| Large Test作成 | テンプレートに従い、`@story` JSDocで対応ユーザーストーリーを記載 |
| テスト構造 | Given/When/Then形式で記述 |

## カバレッジ閾値（MC/DC準拠）

- Lines/Functions/Statements: 90%
- **Branches: 100%**

## 禁止

- テストなしでのコードマージ
- `test.skip` の放置
- モックの過剰使用
