---
files: ["**/*.ts", "**/*.tsx"]
---

# デバッグルール

## トリガー＆アクション

| トリガー | アクション |
| -------- | ---------- |
| 動作検証が必要なとき | `[DEBUG_TRACE]` プレフィックスでログを埋め込む |
| 検証完了後 | `[DEBUG_TRACE]` ログをすべて削除 |
| コミット前 | デバッグログが残っていないことを確認 |

## デバッグログ形式

```typescript
// Entry: 関数の開始直後
console.log(`[DEBUG_TRACE] >>> ENTRY: functionName(arg=${arg})`);

// Branch: 分岐に入った直後
console.log(`[DEBUG_TRACE] >>> BRANCH: condition was true`);

// State: 重要な変数の更新後
console.log(`[DEBUG_TRACE] >>> STATE: status=${status}`);

// Exit: return直前
console.log(`[DEBUG_TRACE] >>> EXIT: functionName returned ${result}`);
```

## 埋め込みポイント

1. **Entry**: 関数の開始直後（引数をログ）
2. **Exit**: return直前（戻り値をログ）
3. **Branch**: `if`, `switch`, `catch` ブロックに入った直後
4. **State**: 重要な変数の値が更新された直後

## IMPORTANT

- デバッグログは**検証後に必ず削除**
- 本番コードに `[DEBUG_TRACE]` を残さない
- 本番用ログは `logger` インスタンスを使用
