#!/bin/bash
# load-project-context.sh - セッション開始時にプロジェクトコンテキストを読み込み

cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0

BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')

cat << EOF
## プロジェクト状態
- ブランチ: $BRANCH
- 未コミット変更: ${UNCOMMITTED}件
- 作業ディレクトリ: $CLAUDE_PROJECT_DIR

## クイックリファレンス
- 仕様書: docs/sequence/, docs/specs/
- テスト: bun run test
- リント: bun run lint
EOF

exit 0
