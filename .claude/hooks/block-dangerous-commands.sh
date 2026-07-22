#!/bin/bash
# block-dangerous-commands.sh - 危険なBashコマンドをブロック

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

DANGEROUS_PATTERNS=(
  "rm -rf /"
  "rm -rf ~"
  "rm -rf \$HOME"
  "> /dev/sda"
  "mkfs\."
  "dd if=/dev/zero"
  ":(){:|:&};:"
  "chmod -R 777 /"
  "chown -R"
  "curl.*\| ?sh"
  "wget.*\| ?sh"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "危険なコマンドがブロックされました: $pattern" >&2
    printf '%s\n' '{"permissionDecision":"deny","permissionDecisionReason":"危険なコマンドが検出されました"}'
    exit 2
  fi
done

printf '%s\n' '{"permissionDecision":"allow"}'
exit 0
