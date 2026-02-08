---
files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/tests/**/*", "**/e2e/**/*"]
---

# テストルール

## IMPORTANT: テストハニカム戦略

[Spotify Testing Honeycomb](https://engineering.atspotify.com/2018/01/testing-of-microservices) に基づく戦略：

```text
最も複雑なのはサービス内部ではなく、他とのインタラクション
→ Integration Tests（Medium）を中心に据える
```

### テスト優先順位

| 優先度 | テストタイプ | 説明 |
| ------ | ----------- | ---- |
| ⭐⭐⭐ | Medium Tests | サービス間インタラクションの検証（最重視） |
| ⭐ | Small Tests | 複雑なロジックに限定（限定的） |
| ⚠️ | Large Tests | クリティカルパスのみ（最小限） |

## TDDサイクル

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
| 新機能実装 | **まずMedium Test**を作成（シーケンス図と1:1対応） |
| Small Test作成 | 複雑なロジックのみ対象（単純なCRUD/委譲は不要） |
| Medium Test作成 | テンプレートに従い、`@sequence` JSDocで対応シーケンス図を記載 |
| Large Test作成 | クリティカルパスのみ、`@story` JSDocで対応ユーザーストーリーを記載 |
| テスト構造 | Given/When/Then形式で記述 |

## Small Test作成基準

### ✅ Small Testを書くべきケース

- 複雑なビジネスロジック（計算、変換、解析）
- 多くの分岐を持つ関数
- 自然に隔離されたユーティリティ関数
- エッジケースが多い処理

### ❌ Small Testを書かないケース

- 単純なCRUD操作（Medium Testで十分）
- 他への委譲だけの薄いラッパー
- フレームワークの機能を呼ぶだけのコード
- 実装の詳細に依存するテスト

## カバレッジ閾値（MC/DC準拠）

- Lines/Functions/Statements: 90%
- **Branches: 100%**

## 禁止

- テストなしでのコードマージ
- `test.skip` の放置
- モックの過剰使用
- Medium Testなしでの機能リリース
