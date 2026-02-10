# バグ修正コマンド

バグを調査し、テスト駆動で修正するワークフローを実行します。

## 使用方法

```text
/fix-bug [バグの説明]
```

## ワークフロー

```text
1. 調査 → 2. 再現テスト作成 → 3. 修正 → 4. 確認 → 5. レビュー
```

## 実行手順

### Step 1: バグの調査

**使用テンプレート**: `.claude/templates/code-reading/code-investigation.md`

1. エラーメッセージの確認
2. 関連コードの特定
3. 根本原因の分析

```bash
# ログの確認
grep -r "error" apps/api/logs/

# 関連コードの検索
grep -r "{error-keyword}" apps/
```

### Step 2: 再現テストの作成

**参照ルール**: `.claude/rules/testing.md`

1. バグを再現するテストを作成
2. テストが失敗することを確認（バグの証明）

**使用エージェント**: `unit-test-agent`
**使用テンプレート**: `.claude/templates/tdd/unit-test.md`

```typescript
// バグ再現テストの例
test("バグ: {description}", () => {
    // Given: バグが発生する条件
    const input = /* バグを引き起こす入力 */;

    // When: 操作
    const result = /* バグが発生する操作 */;

    // Then: 期待される正しい動作（現在は失敗する）
    expect(result).toBe(/* 期待値 */);
});
```

### Step 3: 修正実装

**参照ルール**: `.claude/rules/debugging.md`

1. デバッグログを埋め込み（`[DEBUG_TRACE]`）
2. 原因を特定
3. 最小限の修正を実装
4. デバッグログを削除

```typescript
// デバッグログ例
console.log(`[DEBUG_TRACE] >>> ENTRY: functionName(arg=${arg})`);
console.log(`[DEBUG_TRACE] >>> STATE: status=${status}`);
```

### Step 4: 修正確認

**使用スキル**: `/unit-test`

1. 再現テストが通過することを確認
2. 他のテストが壊れていないことを確認

```bash
# テスト実行
bun vitest run {test-file}
bun run test
```

### Step 5: レビュー

**使用エージェント**: `review-agent`
**使用スキル**: `/review`, `/lint`

1. 修正内容のセルフレビュー
2. リント・フォーマットチェック

```bash
bun run lint
bun run fmt
```

## 関連リソース

| 種類 | リソース |
| ---- | -------- |
| ルール | `debugging.md`, `testing.md` |
| テンプレート | `code-reading/code-investigation.md`, `tdd/unit-test.md`, `workflow/bug-fix.md` |
| エージェント | `unit-test-agent`, `review-agent` |
| スキル | `/unit-test`, `/lint`, `/review` |

## 出力フォーマット

```markdown
## バグ修正完了レポート

### バグ概要
- 症状: {symptoms}
- 根本原因: {root-cause}

### 修正内容
- ファイル: {modified-files}
- 変更概要: {changes}

### テスト
- 再現テスト: {test-file}
- 全テスト結果: ✅ PASS

### 確認事項
- [ ] 再現テスト追加
- [ ] 修正実装
- [ ] 全テスト通過
- [ ] レビュー完了
- [ ] デバッグログ削除
```
