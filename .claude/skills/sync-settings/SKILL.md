---
name: sync-settings
description: プロジェクトのClaude Code設定（.claude/配下）をGitリポジトリと同期する。設定変更後のコミット・プッシュに使用
argument-hint: "[push|pull|status]（省略時はstatus）"
---

# プロジェクト設定同期

このプロジェクトのClaude Code設定をGitリポジトリと同期します。

## 同期対象

プロジェクトルート配下の`.claude/`ディレクトリ全体が同期対象です：

```text
.claude/
├── CLAUDE.md           # プロジェクトCLAUDE.md（ルートにシンボリックリンク推奨）
├── settings.json       # プロジェクト固有設定（hooks、permissions等）
├── rules/              # コンテキストルール
│   ├── admin.md
│   ├── api.md
│   ├── debugging.md
│   ├── spec-driven.md
│   ├── testing.md
│   └── web.md
├── skills/             # プロジェクトスキル
│   ├── build/
│   ├── commit/
│   ├── gen-mock/
│   ├── integration-test/
│   ├── lint/
│   ├── pr/
│   ├── review/
│   ├── sync-docs/
│   ├── sync-knowledge/
│   ├── sync-settings/
│   └── unit-test/
├── agents/             # エージェント定義
├── hooks/              # フックスクリプト
└── log/                # 作業ログ（Git除外推奨）
```

```gitignore
.claude/settings.local.json
.claude/cache/
```

## 引数によるモード指定

| 引数 | 動作 |
| ---- | ---- |
| `status` | 未コミットの設定変更を表示（デフォルト） |
| `push` | 設定変更をコミット・プッシュ |
| `pull` | リモートの設定変更をプル |

## 実行手順

### status（デフォルト）

未コミットの`.claude/`配下の変更を確認：

```bash
git status .claude/
git diff .claude/
```

### push

1. **変更内容の確認**

   ```bash
   git status .claude/
   git diff .claude/
   ```

2. **機密情報チェック**

   以下が含まれていないか確認：
   - APIキー、トークン
   - パスワード、シークレット
   - 個人情報

3. **ステージング**

   ```bash
   git add .claude/rules/ .claude/skills/ .claude/agents/ .claude/hooks/ .claude/settings.json .claude/CLAUDE.md
   ```

   **除外**: `.claude/settings.local.json`, `.claude/log/`

4. **コミット**

   ```bash
   git commit -m "chore: update Claude Code settings"
   ```

5. **プッシュ**（ユーザー確認後）

   ```bash
   git push
   ```

### pull

1. **リモート変更の取得**

   ```bash
   git fetch origin
   git diff HEAD origin/master -- .claude/
   ```

2. **マージ**（ユーザー確認後）

   ```bash
   git pull origin master
   ```

3. **ローカル設定との競合確認**

   `settings.local.json`がある場合、`settings.json`とのマージを確認

## settings.json と settings.local.json の使い分け

| ファイル | 用途 | Git管理 |
| -------- | ---- | ------- |
| `settings.json` | チーム共通設定（hooks、permissions雛形） | ○ |
| `settings.local.json` | 個人設定（statusLine、OS固有パス） | × |

### settings.local.json の例

```json
{
  "statusLine": {
    "enabled": true,
    "command": "/path/to/local/statusline.sh"
  }
}
```

## フックスクリプトの同期

`.claude/hooks/`配下のスクリプトはGit管理されます：

| スクリプト | 用途 |
| ---------- | ---- |
| `format-on-save.sh` | Write/Edit後のBiomeフォーマット |
| `block-dangerous-commands.sh` | 危険コマンドのブロック |
| `load-project-context.sh` | セッション開始時のコンテキスト読み込み |

**IMPORTANT**: フックスクリプト内のパスは`$CLAUDE_PROJECT_DIR`環境変数を使用し、絶対パスを避ける

## 同期対象外

以下はプロジェクト外のグローバル設定のため、このスキルでは同期しません：

- `~/.claude/settings.json` - ユーザーグローバル設定
- `~/.claude.json` - MCPサーバー設定
- `~/.claude/projects/` - 他プロジェクトの設定

## 出力例

### status実行時

```markdown
## .claude/ 設定状況

### 変更あり
- `.claude/rules/api.md` - 新しいトリガー追加
- `.claude/skills/sync-docs/SKILL.md` - ドキュメント構造更新

### 未追跡
- `.claude/log/2025-02-09-task.md`（Git除外対象）

### アクション
`/sync-settings push` でコミット・プッシュできます
```

### push実行時

```markdown
## 設定をプッシュしました

### コミット内容
- `.claude/rules/api.md`
- `.claude/skills/sync-docs/SKILL.md`

### コミットメッセージ
`chore: update Claude Code settings`

### リモート
`origin/master` にプッシュ完了
```
