---
title: "テスト戦略"
description: Google Test Sizes・ドキュメント対応・カバレッジ目標
---

## Google Test Sizes

| サイズ | 説明 | 実行時間 | 命名規則 |
| ------ | ---- | -------- | -------- |
| **Small** | ユニットテスト（モック使用） | < 100ms | `*.test.ts` |
| **Medium** | 統合テスト（DB使用） | < 1s | `*.integration.test.ts` |
| **Large** | E2Eテスト（ブラウザ使用） | < 10s | `*.spec.ts` |

## テストとドキュメントの対応

| テストタイプ | 対応ドキュメント |
| ------------ | ---------------- |
| Small Tests | コード内JSDoc |
| Medium Tests | `docs/sequence/` シーケンス図 |
| Large Tests | `docs/user-stories/` ユーザーストーリー |

## カバレッジ目標

| メトリクス | 目標 |
| ---------- | ---- |
| Lines | 90% |
| Functions | 90% |
| Statements | 90% |
| Branches | 100% |
