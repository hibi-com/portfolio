---
name: sync-knowledge
description: プロジェクトで得た学びをプロジェクトナレッジ（.claude/rules/、docs/development/）に反映する。技術的知見やトラブルシューティング情報を蓄積
---

# ナレッジ同期

現在のプロジェクトで得た学びを適切な場所に蓄積します。

## ナレッジの保存先

このプロジェクトでは以下の2箇所にナレッジを蓄積します：

| 保存先 | 用途 | 形式 |
| ------ | ---- | ---- |
| `.claude/rules/` | Claude Codeが自動参照するルール | Markdown（トリガー＆アクション形式） |
| `docs/development/` | 開発者向けガイドライン | Markdown |

## .claude/rules/ の構成

```text
.claude/rules/
├── admin.md        # 管理画面（TanStack Router + FSD）固有ルール
├── api.md          # API（Hono + DDD）固有ルール
├── debugging.md    # デバッグ・可観測性ルール
├── spec-driven.md  # 仕様駆動開発ルール
├── testing.md      # テストルール（TDD、Googleテストサイズ）
└── web.md          # Web（Remix + FSD）固有ルール
```

## docs/development/ の構成

```text
docs/development/
├── testing.md           # テスト戦略詳細
├── ci-cd.md             # CI/CDパイプライン
├── coding-standards.md  # コーディング規約
├── git-workflow.md      # Gitワークフロー
└── troubleshooting.md   # トラブルシューティング集
```

## ナレッジの分類基準

### .claude/rules/ に追記する場合

- Claude Codeに自動適用させたいルール
- 特定のファイルパターン（`files:`フィルター）に紐づくルール
- トリガー＆アクション形式で表現できる内容

```markdown
---
files: ["apps/api/**/*"]
---

# API ルール

## トリガー＆アクション

| トリガー | アクション |
| -------- | ---------- |
| 新しいエンドポイント追加 | シーケンス図を先に作成 |
```

### docs/development/ に追記する場合

- 詳細な説明が必要なガイドライン
- チュートリアル形式のドキュメント
- トラブルシューティング事例

## 実行手順

1. **セッションの学びを整理**

   今回のセッションで得た知見をリストアップ：
   - 解決した問題とその原因
   - 発見したベストプラクティス
   - 今後避けるべきアンチパターン

2. **保存先を判断**

   | 学びの種類 | 保存先 | ファイル |
   | ---------- | ------ | -------- |
   | Claude Codeへの指示 | `.claude/rules/` | 該当ドメインの `.md` |
   | 詳細なガイド | `docs/development/` | 該当カテゴリの `.md` |
   | トラブルシュート | `docs/development/troubleshooting.md` | - |

3. **既存内容との重複確認**

   ```bash
   grep -r "検索キーワード" .claude/rules/ docs/development/
   ```

4. **追記実行**

   - 既存のセクション構造を維持
   - 日付やコンテキストを記載
   - コード例を含める

5. **更新内容を報告**

## 追記フォーマット

### .claude/rules/ への追記例

```markdown
## トリガー＆アクション

| トリガー | アクション |
| -------- | ---------- |
| 【新規】○○するとき | △△を実行 |
```

### docs/development/troubleshooting.md への追記例

```markdown
## ○○エラーが発生する

### 症状

エラーメッセージの内容

### 原因

根本原因の説明

### 解決策

```bash
# 解決コマンド
```

### 参考

- 関連Issue: #123
- 発生日: 2025-02-09

## 注意事項

- **プロジェクト固有情報の除外**: APIキー、固有のリソース名は含めない
- **重複回避**: 既存内容と重複しないよう確認
- **構造維持**: 既存のセクション構造を壊さない
- **検証可能性**: 可能な限り再現手順やコマンドを含める
