---
name: review
description: コードレビューを実行します。
argument-hint: "[file-path|pr-number]"
allowed-tools: Bash, Read, Glob, Grep, Write
---

# Code Review Skill

コードレビューを実行し、結果を`logs/review/`に保存します。

## 使用方法

```text
/review                    # 現在の変更をレビュー
/review src/api/posts.ts   # 特定ファイルをレビュー
/review 123                # PR番号を指定してレビュー
```

## レビュープロセス

1. **対象ファイルの確認**: `git diff`または指定ファイルを読み込み
2. **自動チェック実行**: `bun run lint`, `bun run typecheck`, `bun run test`, `bun run coverage`
3. **チェックリスト確認**: `docs/development/code-review-checklist.md` に基づいてレビュー
4. **結果記録**: `logs/review/YYYY-MM-DD-{description}.md` に保存

## レビュー観点

**IMPORTANT**: レビュー実行時は以下のドキュメントを参照してください。

- **[コードレビューチェックリスト](../../templates/workflow/code-review.md)** - レビュー実行時の具体的なチェック項目（Single Source of Truth）
- **[コードレビューガイド](docs/development/code-review.md)** - レビュー基準、良い例・悪い例、詳細説明

### チェック対象（概要）

1. **品質レビュー**: 可読性、保守性、テスタビリティ
2. **セキュリティレビュー**: OWASP Top 10対応
3. **パフォーマンスレビュー**: DB、フロントエンド、API
4. **アーキテクチャレビュー**: DDD（API）、FSD（Frontend）、SOLID原則
5. **テストレビュー**: テストハニカム戦略、MC/DC カバレッジ
6. **ドキュメントレビュー**: シーケンス図、API仕様書

詳細な項目は `docs/development/code-review-checklist.md` を参照。

## 自動チェック

レビュー実行前に以下のコマンドを自動実行:

```bash
# コード品質チェック
bun run lint
bun run typecheck

# テスト実行
bun run test

# カバレッジ確認
bun run coverage
```

## レビュー結果の記録

### ファイル名

```text
logs/review/YYYY-MM-DD-{description}.md
```

例:

- `logs/review/2026-02-19-api-posts-endpoint.md`
- `logs/review/2026-02-19-pr-123.md`

### テンプレート

出力フォーマットは以下を参照:

- **[コードレビューログテンプレート](../../templates/workflow/code-review-log.md)**

### 総合評価

| 評価 | 基準 |
| ---- | ---- |
| ✅ 承認 | クリティカルなし、重要な問題なし |
| ⚠️ 要修正 | 重要な問題あり（修正後の再レビュー推奨） |
| ❌ 却下 | クリティカルな問題あり（即修正必須） |

## 参考ドキュメント

| ドキュメント | 説明 |
| ------------ | ---- |
| [コードレビューチェックリスト](../../templates/workflow/code-review.md) | **レビュー実行時の具体的なチェック項目（必読）** |
| [コードレビューガイド](docs/development/code-review.md) | レビュー基準、良い例・悪い例、詳細説明 |
| [コーディング規約](docs/development/coding-standards.md) | フォーマット、命名規則 |
| [セキュリティガイドライン](docs/security/guidelines.md) | OWASP対応詳細 |
| [テスト戦略](docs/testing/testing-strategy.md) | テストハニカム、カバレッジ基準 |

## 注意事項

- **Single Source of Truth原則に従う**: チェックリストの詳細は `docs/development/code-review-checklist.md` を参照
- **スキルファイルには詳細を記載しない**: 修正のヌケモレを防ぐため、詳細はdocsに集約
- レビュー観点の詳細・良い例・悪い例は `docs/development/code-review.md` を参照
- テンプレートの詳細は `.claude/templates/workflow/code-review-log.md` を参照
