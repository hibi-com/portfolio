# Pulumi backend を Cloudflare R2 に切り替え

日付: 2026-07-23

## 概要

Pulumi Cloud 依存をやめ、state を R2 バケット `portfolio-pulumi-state` に保存する。CircleCI Context `pulumi` の変数登録はユーザー完了済み。

## 変更

- `infra/Pulumi.yaml` … `backend.url` を R2 S3 互換 URL に設定
- `.circleci/config.yml` … `login-pulumi-r2` / `prepare-infra-env`、infra ジョブ更新、`env-config` Context 追加
- `infra/scripts/env-yaml-to-dotenv.mjs` … `env.yaml` → `.env`
- `docs/setup/circleci-pulumi-r2.md` … 手順書

## 次

- master で `infra-rc` / `infra-prd` を実行し preview を確認
- 初回は空 backend のため `pulumi stack select --create`
