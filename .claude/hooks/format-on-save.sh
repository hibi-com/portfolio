#!/bin/bash
# format-on-save.sh - Write/Edit後にBiomeでフォーマット

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|json|md)$ ]]; then
  exit 0
fi

if [[ "$FILE_PATH" =~ (node_modules|dist|build|\.cache) ]]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0
bun run biome format --write "$FILE_PATH" 2>/dev/null || true

exit 0
