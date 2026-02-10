# コードベース分析コマンド

プロジェクト構造やコードを分析するワークフローを実行します。

## 使用方法

```text
/analyze [分析タイプ] [対象]
```

### 分析タイプ

| タイプ | 説明 |
| ------ | ---- |
| `architecture` | アーキテクチャ全体を分析 |
| `dependency` | 依存関係を分析 |
| `code` | 特定コードを調査 |
| `security` | セキュリティを分析 |

## アーキテクチャ分析

**使用テンプレート**: `.claude/templates/code-reading/architecture-analysis.md`

プロジェクト全体のアーキテクチャを分析します。

### アーキテクチャ分析の実行手順

1. ディレクトリ構造の把握
2. レイヤー間依存関係の確認
3. パッケージ構成の分析

```bash
# ディレクトリ構造
tree -L 3 apps/ packages/

# パッケージ依存関係
cat package.json
cat apps/*/package.json
```

### 参照ドキュメント

- `docs/architecture/` - 既存アーキテクチャドキュメント
- `.claude/rules/api.md` - API（Hono + DDD）ルール
- `.claude/rules/web.md` - Web（Remix + FSD）ルール
- `.claude/rules/admin.md` - Admin（TanStack Router + FSD）ルール

## 依存関係分析

**使用テンプレート**: `.claude/templates/code-reading/dependency-analysis.md`

モジュール間の依存関係を分析します。

### 依存関係分析の実行手順

1. インポート関係の可視化
2. 循環依存の検出
3. 依存方向の確認

```bash
# 依存関係チェック
bun run lint  # Sherif による依存関係チェック

# 特定モジュールの依存を確認
grep -r "from.*{module}" apps/
```

## コード調査

**使用テンプレート**: `.claude/templates/code-reading/code-investigation.md`

特定のコードや機能を調査します。

### コード調査の実行手順

1. エントリーポイントの特定
2. 処理フローの追跡
3. 関連コードの把握

```bash
# キーワード検索
grep -r "{keyword}" apps/ packages/

# ファイル検索
find . -name "*{pattern}*"
```

## セキュリティ分析

**使用エージェント**: `security-agent`

セキュリティリスクを分析します。

### チェック項目

- 認証情報のハードコード
- SQLインジェクション
- XSS脆弱性
- OWASP Top 10

## 関連リソース

| 種類 | リソース |
| ---- | -------- |
| ルール | `api.md`, `web.md`, `admin.md` |
| テンプレート | `code-reading/architecture-analysis.md`, `code-reading/dependency-analysis.md`, `code-reading/code-investigation.md` |
| エージェント | `security-agent` |
| ドキュメント | `docs/architecture/` |

## 出力フォーマット

```markdown
## 分析レポート

### 分析タイプ
- タイプ: {type}
- 対象: {target}

### 発見事項

#### 構造
- {finding-1}
- {finding-2}

#### 問題点
- {issue-1}
- {issue-2}

#### 改善提案
1. {suggestion-1}
2. {suggestion-2}

### 関連ファイル
- {file-1}
- {file-2}
```
