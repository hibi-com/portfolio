---
title: "CI/CDツール"
---

このプロジェクトの CI/CD は **CircleCI** で実行し、ビルド成果物は **Backblaze B2** に保存する。  
ジョブ構成・トリガー・コマンド・環境変数は設定ファイルと CircleCI の画面が**単一の参照先**であり、このドキュメントでは概要と運用方針のみ記載する。

## 参照先（更新はここで行う）

| 対象 | 参照先 |
| ---- | ------ |
| ワークフロー定義 | `.circleci/config.yml` |
| 環境変数・Contexts | CircleCI の Project Settings / Contexts |
| 成果物ストレージ | Backblaze B2 のバケット・料金設定 |

## 概要

- **CI**: push 時に品質チェック（format / lint / typecheck）→ test → e2e → build → 成果物を B2 へアップロード。`copilot/` で始まるブランチは除外。
- **CD**: RC は承認後に B2 から取得してデプロイ。STG / PRD はスケジュール（日次等）で同様にデプロイ。いずれもテスト成功が前提。
- **失敗時**: テスト・E2E・ビルド・デプロイの失敗で GitHub Issue を自動作成（ジョブ名・ブランチ・コミット・ログリンク・ラベル付与）。詳細な条件は `.circleci/config.yml` を参照。
- **デプロイ**: **ローカルからのデプロイは禁止**。すべて CircleCI 経由で実行。デプロイログは `logs/deployment/` に記録。

## 運用上の注意

- ジョブの追加・変更・トリガー条件を変えたら **`.circleci/config.yml` を更新**する。このドキュメントの「ジョブ一覧」は持たない。
- 環境変数（B2、Cloudflare、Doppler、GITHUB_TOKEN 等）を変えたら **CircleCI の Contexts / Project Settings** を更新する。変数一覧はこのドキュメントで保持しない。
- 成果物のパスやバケット名を変えたら **B2 と config.yml** を整合させる。料金・無料枠は B2 のダッシュボードを参照する。

## 依存関係管理

**Renovateは使用しません**。依存関係の更新は Claude Code で行います。

- **ツール**: `/update-deps` スキル
- **頻度**: 月次（第1営業日）、またはセキュリティパッチ発見時
- **ログ**: `logs/dependencies/` に更新履歴を記録
- **参照**: [依存関係更新スキル](../../.claude/skills/update-deps/SKILL.md)

## デプロイ

**重要**: デプロイは CircleCI で自動実行されます。ローカルからの手動デプロイは**禁止**です。

### デプロイフロー

| 環境 | トリガー | 手順書 |
| ---- | -------- | ------ |
| RC | masterへのpush後、手動承認 | [デプロイ手順書](../../logs/deployment/README.md) |
| STG | 日次スケジュール（0:00 UTC） | [デプロイ手順書](../../logs/deployment/README.md) |
| PRD | 日次スケジュール（12:00 UTC） | [デプロイ手順書](../../logs/deployment/README.md) |

### デプロイログ

デプロイ実行後は、以下のテンプレートを使ってログを記録：

- **テンプレート**: `.claude/templates/deployment/deployment-log.md`
- **保存先**: `logs/deployment/YYYY-MM-DD-{environment}.md`

### 改善点（v2.0）

CircleCIのデプロイ設定を以下のように改善しました：

1. **リトライロジック追加**: デプロイ失敗時に最大3回自動リトライ
2. **Wrangler CLI追加**: デプロイ用にWrangler CLIを明示的にインストール
3. **エラーハンドリング強化**: 各ステップで適切なエラーメッセージを出力
4. **ヘルスチェック追加**: デプロイ後に各環境のURLをチェック
5. **タイムアウト設定**: 15分のタイムアウトを設定
6. **失敗時のIssue作成**: デプロイ失敗時にGitHub Issueを自動作成（ロールバックコマンド付き）

## トラブルシューティング

- ジョブが失敗する: CircleCI のビルドログと、使用している Contexts / 環境変数が設定されているかを確認する。必要ならキャッシュをクリアして再実行する。
- 成果物がアップロードされない: B2 用の認証情報（Context）とブランチ条件（例: master/main のみ）を確認する。
- デプロイが動かない: RC は承認が必要。STG/PRD はスケジュールとテスト成功を確認する。
- デプロイが失敗する: [デプロイ手順書のトラブルシューティング](../../logs/deployment/README.md#トラブルシューティング)を参照。

詳細なフロー図・ジョブ一覧は `.circleci/config.yml` を開いて確認すること。
