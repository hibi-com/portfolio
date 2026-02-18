---
name: changeset
description: changesetを作成します。バージョン管理とCHANGELOG生成を自動化します。
argument-hint: ""
allowed-tools: Bash, Read, Write, AskUserQuestion, Glob
---

# Changeset Skill

パッケージのバージョン管理とCHANGELOG生成のためのchangesetを作成します。

## 使用方法

```text
/changeset    # インタラクティブにchangeset作成
```

## 実行手順

### 1. 変更確認

- `git status`で変更されたファイルを確認
- ユーザーに変更内容を報告

### 2. パッケージ特定

- 変更されたファイルから影響を受けるパッケージを特定
- workspaceのpackage.jsonから全パッケージリストを取得
- 変更されたパスからパッケージを推定

### 3. バージョンアップ種類の質問

AskUserQuestionで以下を質問:

- 質問: "どのバージョンアップを行いますか？"
- 選択肢:
  - `patch` - バグ修正、ドキュメント更新
  - `minor` - 新機能追加（後方互換性あり）
  - `major` - 破壊的変更

### 4. 変更カテゴリの質問

**IMPORTANT**: `docs/development/git-commit.md`で定義されている13種類のタイプのみ使用可能

AskUserQuestionで以下を質問:

- 質問: "変更のカテゴリを選択してください"
- 選択肢（13種類）: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert, improvement, security
- 参照: `docs/development/git-commit.md` のコミットタイプ定義

### 5. サマリーの質問

AskUserQuestionで以下を質問:

- 質問: "変更内容のサマリーを入力してください"
- 事前定義テンプレート（選択肢として提示）:
  - "新機能を追加"
  - "バグを修正"
  - "ドキュメントを更新"
  - "パフォーマンスを改善"
  - "依存関係を更新"
  - "リファクタリングを実施"

### 6. Changesetファイル生成

- ランダムなファイル名生成（例: `random-word-word.md`）

- 以下のフォーマットでファイル作成:

  ```markdown
  ---
  "@portfolio/package-name": バージョン種類
  ---

  カテゴリ: サマリー
  ```

### 7. コミット

- `git add .changeset/ファイル名.md`
- `git commit -m "changeset: サマリー"`

## バージョンアップの種類

### Major (破壊的変更)

- APIの削除や変更
- 既存のコードを壊す変更
- 移行作業が必要な変更

### Minor (新機能追加)

- 新しい機能の追加
- 後方互換性を保った変更
- オプション機能の追加

### Patch (バグ修正)

- バグの修正
- ドキュメントの更新
- 内部実装の改善

## 変更カテゴリ

**IMPORTANT**: `docs/development/git-commit.md`で定義されている13種類のタイプのみ使用

| カテゴリ | 説明 | 参照 |
| -------- | ---- | ---- |
| `feat` | 新機能の追加 | git-commit.md |
| `fix` | バグの修正 | git-commit.md |
| `docs` | ドキュメントのみの変更 | git-commit.md |
| `style` | コードの動作に影響しない変更 | git-commit.md |
| `refactor` | コードのリファクタリング | git-commit.md |
| `perf` | パフォーマンス改善 | git-commit.md |
| `test` | テストの追加や修正 | git-commit.md |
| `build` | ビルドシステムの変更 | git-commit.md |
| `ci` | CI設定の変更 | git-commit.md |
| `chore` | その他の変更 | git-commit.md |
| `revert` | 以前のコミットの取り消し | git-commit.md |
| `improvement` | 既存機能の改善 | git-commit.md |
| `security` | セキュリティ関連の修正 | git-commit.md |

## 事前定義サマリーテンプレート

以下のテンプレートを選択肢として提示:

| テンプレート | 使用場面 |
| ------------ | -------- |
| 新機能を追加 | 新しい機能の実装 |
| バグを修正 | バグの修正 |
| ドキュメントを更新 | ドキュメントの追加・更新 |
| パフォーマンスを改善 | パフォーマンスの最適化 |
| 依存関係を更新 | ライブラリのアップデート |
| リファクタリングを実施 | コードの改善 |
| セキュリティを強化 | セキュリティ関連の修正 |
| テストを追加 | テストコードの追加 |
| ビルド設定を変更 | ビルドツールの設定変更 |
| CI設定を更新 | CI/CDの設定変更 |

## 注意事項

- **変更カテゴリは`docs/development/git-commit.md`で定義されている13種類のみ使用**
- 変更内容を正確に反映すること
- 破壊的変更の場合は必ず詳細を記載
- 複数パッケージに影響がある場合は全て含める
- changesetファイル名はランダム生成（例: `happy-trees-grow.md`）
- サマリーは日本語で記述

## 参考ドキュメント

- [Changesets ドキュメント](https://github.com/changesets/changesets)
- [Git Commitガイド](docs/development/git-commit.md)
