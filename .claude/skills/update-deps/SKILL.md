# 依存関係更新スキル

## 概要

プロジェクトの依存関係（npm/bun パッケージ）を更新し、更新履歴をログに記録します。

## 使い方

```bash
/update-deps
```

## 実行内容

### 1. 依存関係の確認

```bash
# 古くなった依存関係をチェック
bun outdated
```

### 2. 更新対象の選定

- **パッチバージョン（0.0.X）**: 自動更新
- **マイナーバージョン（0.X.0）**: 破壊的変更を確認して更新
- **メジャーバージョン（X.0.0）**: 慎重に検討（BREAKING CHANGES確認必須）

### 3. 更新実行

```bash
# 全パッケージを最新に更新
bun update

# 特定パッケージのみ更新
bun update <package-name>

# メジャーバージョンアップ
bun add <package-name>@latest
```

### 4. 検証

```bash
# 品質チェック
bun run lint
bun run typecheck
bun run test
bun run build
```

### 5. ログ記録

`.claude/templates/dependencies/update-log.md` のテンプレートに従い、
`logs/dependencies/YYYY-MM-DD-update.md` に更新内容を記録します。

## ログテンプレート

以下のテンプレートを使用してログを作成：

```markdown
# 依存関係更新ログ

**日付**: YYYY-MM-DD
**実行者**: Claude Code
**更新理由**: 定期更新 / セキュリティパッチ / 新機能利用

## 更新パッケージ

| パッケージ | 更新前 | 更新後 | 種別 | 備考 |
| ---------- | ------ | ------ | ---- | ---- |
| @tanstack/router | 1.0.0 | 1.1.0 | minor | 新機能追加 |
| react | 18.2.0 | 18.3.0 | minor | パフォーマンス改善 |

## 破壊的変更

- なし

## テスト結果

- [x] lint: 成功
- [x] typecheck: 成功
- [x] test: 成功
- [x] build: 成功

## 備考

特になし
```

## 更新頻度

- **定期更新**: 月1回（第1営業日）
- **セキュリティパッチ**: 発見次第即座に
- **メジャーアップデート**: 必要に応じて

## 注意事項

- メジャーバージョンアップは必ずCHANGELOGとMigration Guideを確認
- 更新後は必ず全テストを実行
- 失敗した場合はロールバック（`git checkout -- package.json bun.lockb`）
- Monorepo全体の依存関係を考慮（workspace:*の影響）

## 関連ドキュメント

- [依存関係更新テンプレート](../../templates/dependencies/update-log.md)
- [更新履歴](../../logs/dependencies/)
