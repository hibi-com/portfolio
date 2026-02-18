# TDDサイクルコマンド

テスト駆動開発（Red → Green → Refactor）サイクルを実行します。

## 使用方法

```text
/tdd [フェーズ] [対象]
```

### フェーズ

| フェーズ | 説明 |
| -------- | ---- |
| `red` | 失敗するテストを作成 |
| `green` | テストを通過する最小限の実装 |
| `refactor` | コード品質を改善 |
| `cycle` | 全サイクルを実行 |

## TDDサイクル

```text
┌─────────────────────────────────────────┐
│                                         │
│    ┌───────┐                           │
│    │  Red  │  ← テスト作成（失敗）      │
│    └───┬───┘                           │
│        │                               │
│        ▼                               │
│    ┌───────┐                           │
│    │ Green │  ← 最小限の実装（成功）    │
│    └───┬───┘                           │
│        │                               │
│        ▼                               │
│    ┌──────────┐                        │
│    │ Refactor │  ← 品質改善            │
│    └────┬─────┘                        │
│         │                              │
│         └──────────────────────────────┘
│
└─────────────────────────────────────────┘
```

## Red フェーズ

**使用エージェント**: `unit-test-agent`
**使用テンプレート**: `.claude/templates/tdd/unit-test.md`
**参照ルール**: `.claude/rules/testing.md`

### Red フェーズの手順

1. テンプレートを読み込む
2. 仕様に基づいてテストを作成
3. テストが失敗することを確認

テスト実行（失敗確認）: `bun run test -- {test-file}`。テンプレートは `.claude/templates/tdd/unit-test.md`。テストの書き方は `docs/testing/testing-guide.md` を参照すること。

## Green フェーズ

**参照ルール**: `.claude/rules/api.md`, `.claude/rules/web.md`, `.claude/rules/admin.md`

### Green フェーズの手順

1. テストを通過する最小限のコードを実装
2. 余計な機能は追加しない
3. テストが通過することを確認

```bash
# テスト実行（成功確認）
bun run test -- {test-file}
```

### 実装ガイドライン

- **最小限**: テストを通過するだけのコード
- **シンプル**: 複雑なロジックは避ける
- **仮実装OK**: リファクタリングで改善

## Refactor フェーズ

**使用テンプレート**: `.claude/templates/workflow/refactoring.md`
**使用スキル**: `/lint`, `/format`, `/typecheck`

### Refactor フェーズの手順

1. コードの品質を改善
2. 各変更後にテストを実行
3. テストが通過し続けることを確認

品質チェック: `bun run lint:fix`、`bun run fmt`、`bun run typecheck`、`bun run test -- {test-file}`。  
一括は `bun run check`（`docs/development/workflow.md` 参照）。

### リファクタリング対象

- 命名の改善
- 重複の除去
- 関数の分割
- 型の厳格化

## テストサイズ別テンプレート

| サイズ | テンプレート | 命名・配置 |
| ------ | ------------ | ---------- |
| Small | `.claude/templates/tdd/unit-test.md` | `*.test.ts`（テスト対象と同じディレクトリ） |
| Medium | `.claude/templates/tdd/integration-test.md` | `*.integration.test.ts`（`apps/api/integration/`, `apps/web/integration/`, `apps/admin/integration/`） |
| Large | `.claude/templates/tdd/e2e-test.md` | `*.spec.ts`（各アプリの e2e） |

実行: ユニット `bun run test`、統合 `bun run integration`、E2E `bun run e2e`。詳細は `docs/testing/testing-strategy.md` と `docs/testing/testing-guide.md` を参照。

## 関連リソース

| 種類 | リソース |
| ---- | -------- |
| ルール | `testing.md`, `api.md`, `web.md`, `admin.md` |
| テンプレート | `tdd/unit-test.md`, `tdd/integration-test.md`, `tdd/e2e-test.md`, `workflow/refactoring.md` |
| エージェント | `unit-test-agent`, `integration-test-agent`, `e2e-test-agent` |
| スキル | `/unit-test`, `/integration-test`, `/e2e-test`, `/lint`, `/format` |

## 出力フォーマット

```markdown
## TDDサイクル完了レポート

### 対象
- 機能: {feature}
- ファイル: {files}

### 実行結果

#### Red（テスト作成）
- テストファイル: {test-file}
- テストケース数: {count}
- 結果: ❌ FAIL（期待通り）

#### Green（実装）
- 実装ファイル: {impl-file}
- 結果: ✅ PASS

#### Refactor（改善）
- 改善内容: {improvements}
- 結果: ✅ PASS

### 確認事項
- [ ] テストが仕様を網羅
- [ ] 実装が最小限
- [ ] コード品質良好
```
