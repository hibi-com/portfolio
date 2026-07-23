#!/usr/bin/env sh
set -eu

TARGET_URL="${TARGET_URL:-}"
TARGETS_FILE="${TARGETS_FILE:-testing/dast/targets-stg.txt}"

is_stg_url() {
  case "$1" in
    https://stg.www.ageha734.jp|https://stg.www.ageha734.jp/*|https://stg.api.ageha734.jp|https://stg.api.ageha734.jp/*)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

if [ -n "${TARGET_URL}" ]; then
  if ! is_stg_url "${TARGET_URL}"; then
    echo "DAST is STG-only. Refusing TARGET_URL=${TARGET_URL}" >&2
    exit 1
  fi
  exit 0
fi

if [ ! -f "${TARGETS_FILE}" ]; then
  echo "Targets file not found: ${TARGETS_FILE}" >&2
  exit 1
fi

while IFS= read -r line || [ -n "${line}" ]; do
  case "${line}" in
    ""|\#*) continue ;;
  esac
  if ! is_stg_url "${line}"; then
    echo "DAST is STG-only. Refusing target: ${line}" >&2
    exit 1
  fi
done < "${TARGETS_FILE}"
