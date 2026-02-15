---
files: ["docs/sequence/**/*.md", "apps/api/src/interface/rest/**/*", "apps/api/src/application/usecases/**/*"]
---

# シーケンス図作成ルール

## トリガー

- 「シーケンス図を作成」「処理フローを可視化」「APIフローを文書化」
- 新しいAPIエンドポイントを実装した後
- 既存のAPIの処理フローを変更した後

## 基本原則

1. **コード絶対主義**: 実装コードを100%正確に反映する
2. **簡略化禁止**: 既存コードの省略・簡略化は絶対禁止
3. **捏造禁止**: 存在しないコードを追加しない
4. **明示的検証**: すべての矢印に対応するコードが存在することを確認

## 必須手順

### 1. テンプレート読み込み

```text
.claude/templates/sdd/sequence-diagram.md
```

### 2. 対象ファイルの読み込み

```bash
# 必ず以下のファイルを読み込む
apps/api/src/interface/rest/{domain}.ts      # Handler
apps/api/src/application/usecases/{domain}/   # UseCase
apps/api/src/infrastructure/repositories/     # Repository
packages/validation/src/{domain}.ts           # Validator
```

### 3. 出力先

```text
docs/sequence/api/{domain}/{operation}.md
```

## 用語規則

### 条件記述

| 使用する | 使用しない |
| -------- | ---------- |
| 〜の場合 | 〜のとき |
| 存在しない場合 | ない場合 |
| 〜が有効な場合 | 〜がtrueの場合 |

### 動詞

| 使用する | 説明 |
| -------- | ---- |
| 取得 | データを取得 |
| 格納 | 値を格納 |
| 追加 | 要素を追加 |
| 設定 | 値を設定 |
| 生成 | 新規に生成 |
| 作成 | リソースを作成 |

## Mermaid記法

### 矢印

| 矢印 | 用途 |
| ---- | ---- |
| `->` | 自己呼び出し |
| `->>` | リクエスト |
| `-->>` | レスポンス |

### 制御フロー

| 構文 | 用途 |
| ---- | ---- |
| `alt / else / end` | 条件分岐 |
| `opt / end` | 条件付き処理 |
| `loop / end` | 外部システム呼び出しのみ |
| `Note over` | 注釈 |

### エラーコード

```text
エラーコードはPF形式でバッククォートで囲み、括弧内に定数名を記載:
`PF200001` (VALIDATION_MISSING_FIELD)
```

## セルフレビューチェックリスト

- [ ] シーケンス図がコードと完全に一致
- [ ] すべてのエラーパスが網羅
- [ ] 用語規則に従っている
- [ ] Mermaid構文が正しい
- [ ] 実装参照が正確

## Medium Testとの対応

シーケンス図を作成したら、対応するMedium Testファイルを確認:

```text
apps/api/tests/medium/{domain}/{operation}.medium.test.ts
```

テストファイルには `@sequence` JSDocでシーケンス図へのリンクを記載:

```typescript
/**
 * @sequence docs/sequence/api/{domain}/{operation}.md
 */
```
