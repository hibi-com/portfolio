#!/usr/bin/env bash
set -euo pipefail

# CircleCI Environment Variables Upload Script
#
# Usage:
#   ./scripts/upload-env-to-circleci.sh [environment]
#
# Arguments:
#   environment: rc, stg, prd, or all (default: all)
#
# Required environment variables:
#   CIRCLECI_API_TOKEN: CircleCI Personal API Token
#   CIRCLE_PROJECT_USERNAME: GitHub username or organization
#   CIRCLE_PROJECT_REPONAME: Repository name

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$(dirname "${SCRIPT_DIR}")"
ENV_FILE="${INFRA_DIR}/env.yaml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check required environment variables
check_requirements() {
  local missing=0

  if [ -z "${CIRCLECI_API_TOKEN:-}" ]; then
    echo -e "${RED}✗ CIRCLECI_API_TOKEN is not set${NC}"
    echo "  Get your token from: https://app.circleci.com/settings/user/tokens"
    missing=1
  fi

  if [ -z "${CIRCLE_PROJECT_USERNAME:-}" ]; then
    echo -e "${RED}✗ CIRCLE_PROJECT_USERNAME is not set${NC}"
    echo "  Example: export CIRCLE_PROJECT_USERNAME=ageha734"
    missing=1
  fi

  if [ -z "${CIRCLE_PROJECT_REPONAME:-}" ]; then
    echo -e "${RED}✗ CIRCLE_PROJECT_REPONAME is not set${NC}"
    echo "  Example: export CIRCLE_PROJECT_REPONAME=portfolio"
    missing=1
  fi

  if [ ! -f "${ENV_FILE}" ]; then
    echo -e "${RED}✗ env.yaml not found at: ${ENV_FILE}${NC}"
    missing=1
  fi

  if [ ${missing} -eq 1 ]; then
    echo ""
    echo "Setup instructions:"
    echo "  1. Create a CircleCI Personal API Token:"
    echo "     https://app.circleci.com/settings/user/tokens"
    echo "  2. Export required variables:"
    echo "     export CIRCLECI_API_TOKEN=your_token_here"
    echo "     export CIRCLE_PROJECT_USERNAME=your_github_username"
    echo "     export CIRCLE_PROJECT_REPONAME=portfolio"
    exit 1
  fi
}

# Encode env.yaml to base64
encode_env_file() {
  if command -v base64 > /dev/null 2>&1; then
    # macOS and most Linux
    base64 < "${ENV_FILE}" | tr -d '\n'
  else
    echo -e "${RED}✗ base64 command not found${NC}"
    exit 1
  fi
}

# Upload environment variable to CircleCI
upload_env_var() {
  local env_name=$1
  local var_name="ENV_CONFIG_${env_name^^}"

  echo -e "${YELLOW}Uploading ${var_name}...${NC}"

  local encoded_value
  encoded_value=$(encode_env_file)

  local api_url="https://circleci.com/api/v2/project/gh/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/envvar"

  # Check if variable already exists
  local existing
  existing=$(curl -s \
    -H "Circle-Token: ${CIRCLECI_API_TOKEN}" \
    "${api_url}/${var_name}" 2>/dev/null || echo "")

  if echo "${existing}" | grep -q "\"name\":\"${var_name}\""; then
    # Update existing variable
    echo "  Updating existing variable..."
    curl -s -X DELETE \
      -H "Circle-Token: ${CIRCLECI_API_TOKEN}" \
      "${api_url}/${var_name}" > /dev/null
  fi

  # Create new variable
  local response
  response=$(curl -s -X POST \
    -H "Circle-Token: ${CIRCLECI_API_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"${var_name}\",\"value\":\"${encoded_value}\"}" \
    "${api_url}")

  if echo "${response}" | grep -q "\"name\":\"${var_name}\""; then
    echo -e "${GREEN}✓ ${var_name} uploaded successfully${NC}"
    return 0
  else
    echo -e "${RED}✗ Failed to upload ${var_name}${NC}"
    echo "Response: ${response}"
    return 1
  fi
}

# Main function
main() {
  local target_env="${1:-all}"

  echo "=========================================="
  echo "CircleCI Environment Variables Upload"
  echo "=========================================="
  echo ""

  check_requirements

  echo "Repository: ${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}"
  echo "Env file: ${ENV_FILE}"
  echo ""

  case "${target_env}" in
    rc|stg|prd)
      upload_env_var "${target_env}"
      ;;
    all)
      upload_env_var "rc"
      upload_env_var "stg"
      upload_env_var "prd"
      ;;
    *)
      echo -e "${RED}✗ Invalid environment: ${target_env}${NC}"
      echo "Usage: $0 [rc|stg|prd|all]"
      exit 1
      ;;
  esac

  echo ""
  echo -e "${GREEN}=========================================="
  echo "✓ Upload completed successfully"
  echo "==========================================${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Verify variables in CircleCI:"
  echo "     https://app.circleci.com/settings/project/gh/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/environment-variables"
  echo "  2. Push to master branch to trigger pipeline"
}

main "$@"
