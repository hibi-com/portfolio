# 新機能実装コマンド

新機能を仕様駆動で実装するワークフローを実行します。

## 使用方法

```text
/implement [機能名] [説明]
```

## ワークフロー

```text
1. 仕様確認/作成 → 2. テスト作成(Red) → 3. 実装(Green) → 4. リファクタリング → 5. レビュー
```

## 実行手順

### Step 1: 仕様の確認または作成

**参照ルール**: `.claude/rules/spec-driven.md`

1. `docs/sequence/`, `docs/specs/` を確認
2. 既存仕様がない場合は `spec-writer-agent` で作成

**使用エージェント**: `spec-writer-agent`
**使用テンプレート**: `.claude/templates/sdd/sequence-diagram.md`

既存仕様は `docs/sequence/`、`docs/specs/api/` を確認する。  
ワークフロー全体は `docs/development/workflow.md` を参照。

### Step 2: テスト作成（TDD Red）

**参照ルール**: `.claude/rules/testing.md`

1. テンプレートを読み込む
2. 失敗するテストを作成
3. テストが失敗することを確認

**使用エージェント**: `unit-test-agent`
**使用テンプレート**: `.claude/templates/tdd/unit-test.md`
**使用スキル**: `/unit-test`

```bash
# テスト実行（失敗確認。ファイルは -- で渡す）
bun run test -- {test-file}
```

### Step 3: 実装（TDD Green）

**参照ルール**: 対象レイヤーに応じたルール

- API: `.claude/rules/api.md`
- Web: `.claude/rules/web.md`
- Admin: `.claude/rules/admin.md`

1. テストを通過する最小限の実装
2. 仕様に従った実装

```bash
# テスト実行（成功確認）
bun run test -- {test-file}
```

### Step 4: リファクタリング

**使用テンプレート**: `.claude/templates/workflow/refactoring.md`

1. コード品質の改善
2. テストが引き続き通過することを確認

品質チェック: `bun run lint:fix`、`bun run fmt`、必要に応じて `bun run check`（`docs/development/workflow.md` 参照）。

### Step 5: レビュー

**使用エージェント**: `review-agent`
**使用テンプレート**: `.claude/templates/workflow/code-review.md`
**使用スキル**: `/review`

1. セルフレビュー実行
2. 指摘事項の修正

## 関連リソース

| 種類 | リソース |
| ---- | -------- |
| ルール | `spec-driven.md`, `testing.md`, `api.md`, `web.md`, `admin.md` |
| テンプレート | `sdd/sequence-diagram.md`, `tdd/unit-test.md`, `workflow/code-review.md` |
| エージェント | `spec-writer-agent`, `unit-test-agent`, `review-agent` |
| スキル | `/unit-test`, `/lint`, `/format`, `/review` |

## 出力フォーマット

```markdown
## 実装完了レポート

### 機能
- 名前: {feature-name}
- 説明: {description}

### 作成ファイル
- 仕様: {spec-files}
- テスト: {test-files}
- 実装: {impl-files}

### 実行結果
- [ ] 仕様作成/確認
- [ ] テスト作成（Red）
- [ ] 実装（Green）
- [ ] リファクタリング
- [ ] レビュー

### 次のアクション
- [ ] PRの作成 → `/pr`
```
