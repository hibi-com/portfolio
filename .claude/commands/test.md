
# テスト実行コマンド

テストを作成・実行するワークフローを提供します。

## 使用方法

```text
/test [サイズ] [対象]
```

### サイズ

| サイズ | 説明 | 命名 | スキル |
| ------ | ---- | ---- | ------ |
| `small` | ユニットテスト | `*.test.ts` | `/unit-test` |
| `medium` | 統合テスト | `*.medium.test.ts` | `/integration-test` |
| `large` | E2Eテスト | `*.large.spec.ts` | `/e2e-test` |

## Small Tests（ユニットテスト）

**使用エージェント**: `unit-test-agent`, `unit-test-runner`
**使用テンプレート**: `.claude/templates/tdd/unit-test.md`
**使用スキル**: `/unit-test`
**参照ルール**: `.claude/rules/testing.md`

### Small の作成

```bash
# テンプレート読み込み
cat .claude/templates/tdd/unit-test.md
```

### Small の実行

```bash
bun run test

# 特定パッケージ
bun run test --filter={package}
```

### Small の配置

```text
# ソースファイルと同階層
app/shared/lib/formatDate.ts
app/shared/lib/formatDate.test.ts
```

## Medium Tests（統合テスト）

**使用エージェント**: `integration-test-agent`, `integration-test-runner`
**使用テンプレート**: `.claude/templates/tdd/integration-test.md`
**使用スキル**: `/integration-test`

### Medium の作成

```bash
# テンプレート読み込み
cat .claude/templates/tdd/integration-test.md
```

### Medium の実行

```bash
bun run integration

# 特定ドメイン
bun run integration --filter={domain}
```

### Medium の配置

```text
apps/api/tests/medium/{domain}/{operation}.medium.test.ts
```

### シーケンス図との対応

```typescript
/**
 * @sequence docs/sequence/api/{domain}/{operation}.md
 */
```

## Large Tests（E2Eテスト）

**使用エージェント**: `e2e-test-agent`, `e2e-test-runner`
**使用テンプレート**: `.claude/templates/tdd/e2e-test.md`
**使用スキル**: `/e2e-test`

### Large の作成

```bash
# テンプレート読み込み
cat .claude/templates/tdd/e2e-test.md
```

### Large の実行

```bash
# 全E2Eテスト
bun run e2e

# 特定アプリ
bun --cwd apps/web playwright test
bun --cwd apps/admin playwright test

# UIモード
bun --cwd apps/web playwright test --ui

# ヘッドフルモード
bun --cwd apps/web playwright test --headed
```

### Large の配置

```text
apps/web/e2e/large/{persona}/{story-name}.large.spec.ts
```

### ユーザーストーリーとの対応

```typescript
/**
 * @story docs/user-stories/{persona}/{story-name}.md
 */
```

## テストハニカム戦略

**参照**: `docs/development/testing.md`

```text
        ┌───────────┐
        │  Large    │  ← 最小限
        │ (E2E)     │
        ├───────────┤
    ┌───┴───────────┴───┐
    │     Medium        │  ← 最重視 ⭐⭐⭐
    │  (Integration)    │
    ├───────────────────┤
        │   Small   │  ← 限定的
        │  (Unit)   │
        └───────────┘
```

## カバレッジ目標

| メトリクス | 閾値 |
| ---------- | ---- |
| Lines | 90% |
| Functions | 90% |
| **Branches** | **100%** |
| Statements | 90% |

## 関連リソース

| 種類 | リソース |
| ---- | -------- |
| ルール | `testing.md` |
| テンプレート | `tdd/unit-test.md`, `tdd/integration-test.md`, `tdd/e2e-test.md` |
| エージェント | `unit-test-agent`, `integration-test-agent`, `e2e-test-agent`, `*-runner` |
| スキル | `/unit-test`, `/integration-test`, `/e2e-test` |
| ドキュメント | `docs/development/testing.md` |

## 出力フォーマット

```markdown
## テスト実行結果

### サマリー
- サイズ: {size}
- 対象: {target}

### 結果
- 合計: {total}
- 成功: {passed}
- 失敗: {failed}
- スキップ: {skipped}

### カバレッジ
- Lines: {lines}%
- Functions: {functions}%
- Branches: {branches}%

### 失敗テスト（ある場合）
1. {test-name}: {error}
```
