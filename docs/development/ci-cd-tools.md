---
title: "CI/CDツール"
---

このプロジェクトでは、コード品質と依存関係管理のために次のツールを使用しています。

## CircleCI ワークフロー

このプロジェクトでは、CI/CDパイプラインとしてCircleCIを使用しています。

- **CIワークフロー**: コード品質チェック、テスト、ビルド
- **CDワークフロー**: 環境別デプロイメント（RC/STG/PRD）

### 設定ファイル

設定ファイルは `.circleci/config.yml` にあります。

### CIワークフロー

#### トリガー条件

- **push**: 全ブランチへのpush時（`copilot/`で始まるブランチを除く）

#### ジョブ一覧

1. **setup**
   - 環境セットアップ（Bun、依存関係のインストール）
   - コマンド: `bun install --frozen-lockfile && bun run setup`
   - キャッシュ: `bun.lock`ハッシュベース

2. **format**
   - TypeScriptファイルのフォーマットチェック
   - コマンド: `bun run fmt:ts:check`
   - 依存: `setup`

3. **lint**
   - TypeScriptファイルのリントチェック
   - コマンド: `bun run lint:ts:check`
   - 依存: `setup`

4. **typecheck**
   - TypeScriptの型チェック
   - コマンド: `bun run typecheck`
   - 依存: `setup`

5. **test**
   - ユニットテストの実行
   - コマンド: `bun run test`
   - 依存: `format`, `lint`, `typecheck`
   - 失敗時: GitHub Issueを自動作成

6. **e2e**
   - E2Eテストの実行（Playwright）
   - コマンド: `bun run e2e`
   - リソース: `large`（4 vCPU, 8GB RAM）
   - アーティファクト: `playwright-report`
   - 依存: `test`
   - 失敗時: GitHub Issueを自動作成

7. **build**
   - アプリケーションのビルド
   - コマンド: `bun run build`
   - 依存: `e2e`
   - 失敗時: GitHub Issueを自動作成

8. **upload-artifacts**
   - ビルド成果物をBackblaze B2にアップロード
   - 保存先: `artifacts/{commit-sha}/{app}/`
   - 依存: `build`
   - 実行条件: `master`/`main`ブランチのみ

### CDワークフロー

#### deploy-rc（RC環境）

- **トリガー**: `master`ブランチ
- **実行条件**: 承認後
- **フロー**:
  1. Backblaze B2からArtifactをダウンロード
  2. 承認待ち（approval）
  3. RC環境へデプロイ

#### deploy-stg（STG環境）

- **トリガー**: スケジュール（毎日0:00 UTC）
- **実行条件**: `master`ブランチ、テスト成功後
- **フロー**:
  1. セットアップ
  2. テスト実行
  3. E2Eテスト実行
  4. Backblaze B2からArtifactをダウンロード
  5. STG環境へデプロイ

#### deploy-prd（PRD環境）

- **トリガー**: スケジュール（毎日12:00 UTC）
- **実行条件**: `master`ブランチ、テスト成功後
- **フロー**: deploy-stgと同様

### CI/CDフロー図

```text
CIフロー:
  push → setup → [format, lint, typecheck] → test → e2e → build → upload(B2)
                                                              ↓
                                                        [失敗時]
                                                         Issue作成

CDフロー:
  [RC] 承認 → download(B2) → deploy(rc)
                              ↓
  [STG] 毎日0:00 → test → [成功] → deploy(stg)
                   ↓
                 [失敗] → Issue作成
                              ↓
  [PRD] 毎日12:00 → test → [成功] → deploy(prd)
                   ↓
                 [失敗] → Issue作成
```

### 環境変数

CircleCIのContextsで管理:

| Context | 変数 | 説明 |
| ------- | ---- | ---- |
| backblaze-b2 | `B2_APPLICATION_KEY_ID` | B2認証ID |
| backblaze-b2 | `B2_APPLICATION_KEY` | B2認証キー |
| backblaze-b2 | `B2_BUCKET_NAME` | バケット名 |
| cloudflare | `CLOUDFLARE_API_TOKEN` | Cloudflare APIトークン |
| doppler | `DOPPLER_TOKEN` | Dopplerトークン |

Project Settingsで管理:

| 変数 | 説明 |
| ---- | ---- |
| `GITHUB_TOKEN` | GitHub Issue作成用 |

### テスト失敗時のIssue自動作成

テスト、E2E、ビルドジョブが失敗した場合、GitHub Issueが自動作成されます。

**Issue内容**:
- 失敗したジョブ名
- ブランチ名
- コミットSHA
- CircleCIビルドログへのリンク
- ラベル: `ci-failure`, `automated`

## Renovate

Renovateは依存関係の自動更新を管理するツールです。

### Renovate設定

設定ファイルは `renovate.json` にあります。

### Renovateの主な機能

- **自動依存関係検出**: `package.json` の依存関係を自動的に検出
- **スケジュール実行**: 毎週月曜日の午前10時（JST）にPRを作成
- **グループ化**: 関連するパッケージをまとめて更新
- **自動マージ**: マイナー・パッチバージョンの更新は自動マージ可能
- **セキュリティ更新**: 脆弱性が検出された場合は即座にPRを作成

## SonarCloud

SonarCloudはコード品質・セキュリティ分析をするクラウドサービスです。

### SonarCloud設定

設定ファイルは `sonar-project.properties` にあります。

### SonarCloudの主な機能

- **コード品質分析**: TypeScript/JavaScriptコードの品質を分析
- **セキュリティ脆弱性検出**: 既知の脆弱性パターンを検出
- **コードカバレッジ統合**: テストカバレッジレポートを統合
- **PRコメント**: プルリクエストに品質ゲート結果をコメント

### カバレッジレポート

SonarCloudは次のカバレッジレポートを使用します：

- **パス**: `docs/vitest/coverage/lcov.info`
- **形式**: LCOV形式
- **生成**: `bun run coverage` コマンドで生成

## Backblaze B2（Artifact Storage）

ビルド成果物の長期保存にBackblaze B2を使用しています。

### バケット構成

- **バケット名**: `portfolio-artifacts`
- **構造**: `artifacts/{commit-sha}/{app}/{dist|build}/`

### 料金

- ストレージ: $0.006/GB/月（最初の10GB無料）
- ダウンロード: $0.01/GB（最初の1GB/日無料）

## トラブルシューティング

### CircleCIジョブが失敗する

- CircleCIのビルドログを確認
- 環境変数（Contexts）が正しく設定されているか確認
- キャッシュをクリアして再実行

### Artifactがアップロードされない

- `B2_APPLICATION_KEY_ID`、`B2_APPLICATION_KEY`、`B2_BUCKET_NAME`が設定されているか確認
- `master`または`main`ブランチでビルドしているか確認

### デプロイが実行されない

- RC: 承認が必要（CircleCI UIで承認）
- STG/PRD: スケジュール実行のため、指定時刻まで待機
- テストが失敗している場合はデプロイがスキップされる

### RenovateがPRを作成しない

- Renovate Appがリポジトリにインストールされているか確認
- `renovate.json` が正しく配置されているか確認

### SonarCloudが実行されない

- `SONAR_TOKEN` シークレットが設定されているか確認
- `sonar-project.properties` のプロジェクトキーが正しいか確認
