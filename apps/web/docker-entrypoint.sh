#!/bin/sh
# 環境変数の優先順位: 既存の環境変数 > Secret Manager（orchestrator が注入）> /run/secrets/* ファイル
# 本番では Secret Manager から取得した値を environment で渡す想定。未設定時のみファイルから読む。
set -e
[ -z "${NODE_ENV}" ]         && [ -f /run/secrets/node_env ]          && export NODE_ENV=$(cat /run/secrets/node_env)
[ -z "${API_URL}" ]          && [ -f /run/secrets/api_base_url ]      && export API_URL=$(cat /run/secrets/api_base_url)
[ -z "${VITE_BASE_URL}" ]    && [ -f /run/secrets/vite_base_url ]    && export VITE_BASE_URL=$(cat /run/secrets/vite_base_url)
[ -z "${SENTRY_DSN}" ]       && [ -f /run/secrets/sentry_dsn ]       && export SENTRY_DSN=$(cat /run/secrets/sentry_dsn)
exec "$@"
