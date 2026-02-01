#!/bin/sh
set -e
[ -z "${DATABASE_URL}" ]        && [ -f /run/secrets/database_url ]        && export DATABASE_URL=$(cat /run/secrets/database_url)
[ -z "${REDIS_URL}" ]           && [ -f /run/secrets/redis_url ]            && export REDIS_URL=$(cat /run/secrets/redis_url)
[ -z "${NODE_ENV}" ]            && [ -f /run/secrets/node_env ]             && export NODE_ENV=$(cat /run/secrets/node_env)
[ -z "${BETTER_AUTH_SECRET}" ]  && [ -f /run/secrets/better_auth_secret ]   && export BETTER_AUTH_SECRET=$(cat /run/secrets/better_auth_secret)
[ -z "${BETTER_AUTH_URL}" ]     && [ -f /run/secrets/better_auth_url ]     && export BETTER_AUTH_URL=$(cat /run/secrets/better_auth_url)
[ -z "${GOOGLE_CLIENT_ID}" ]    && [ -f /run/secrets/google_client_id ]    && export GOOGLE_CLIENT_ID=$(cat /run/secrets/google_client_id)
[ -z "${GOOGLE_CLIENT_SECRET}" ] && [ -f /run/secrets/google_client_secret ] && export GOOGLE_CLIENT_SECRET=$(cat /run/secrets/google_client_secret)
[ -z "${SENTRY_DSN}" ]          && [ -f /run/secrets/sentry_dsn ]          && export SENTRY_DSN=$(cat /run/secrets/sentry_dsn)
[ -z "${APP_VERSION}" ]         && [ -f /run/secrets/app_version ]         && export APP_VERSION=$(cat /run/secrets/app_version)
exec "$@"
