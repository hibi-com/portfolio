---
description: シーケンス図を作成または更新します。コードを読み込んで処理フローを可視化します。
argument-hint: "[domain/operation] 例: crm/customer-create"
allowed-tools: ["Read", "Write", "Glob", "Grep", "Bash", "Task"]
---

# Sequence Diagram Skill

## 概要

このスキルは、実装コードを分析してシーケンス図を作成します。

## 使用方法

```bash
/sequence-diagram crm/customer-create
/sequence-diagram post/posts-list
```

## 実行手順

1. **対象ファイルの特定**

   ```bash
   # APIハンドラを検索
   grep -r "{operation}" apps/api/src/interface/rest/

   # UseCaseを検索
   ls apps/api/src/application/usecases/{domain}/
   ```

2. **テンプレートの読み込み**

   ```text
   .claude/templates/sdd/sequence-diagram.md
   ```

3. **コードリーディング**

   - ハンドラの処理フローを追跡
   - UseCaseのビジネスロジックを理解
   - Repositoryのデータアクセスを確認
   - バリデーションルールを確認

4. **シーケンス図の作成**

   テンプレートに従って以下を記述:
   - 概要とエンドポイント情報
   - 対象ファイル一覧
   - Mermaidシーケンス図
   - リクエスト/レスポンス仕様
   - エラーコード一覧
   - 実装参照

5. **セルフレビュー**

   - コードと図の一致を確認
   - エラーパスの網羅を確認
   - 用語規則の遵守を確認

## 出力先

```text
docs/sequence/api/{domain}/{operation}.md
```

## 基本原則

1. **コード絶対主義**: 実装を100%正確に反映
2. **簡略化禁止**: 既存コードの省略は禁止
3. **捏造禁止**: 存在しないコードを追加しない
4. **明示的検証**: すべての矢印に対応コードが必要

## 出力フォーマット

```markdown
## シーケンス図作成完了

### 作成ファイル

- パス: `docs/sequence/api/{domain}/{operation}.md`
- 対応API: `{method} {path}`

### コードリーディング結果

| レイヤー | ファイル | 確認済み |
| -------- | -------- | -------- |
| Handler | {path} | ✅ |
| UseCase | {path} | ✅ |
| Repository | {path} | ✅ |

### セルフレビュー

- [x] コードと図が一致
- [x] エラーパス網羅
- [x] 用語規則遵守
```
