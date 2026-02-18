# 依存関係更新ログ

**日付**: {DATE}
**実行者**: {EXECUTOR}
**更新理由**: {REASON}

## 更新パッケージ

| パッケージ | 更新前 | 更新後 | 種別 | 備考 |
| ---------- | ------ | ------ | ---- | ---- |
| {PACKAGE_NAME} | {OLD_VERSION} | {NEW_VERSION} | {TYPE} | {NOTE} |

## 破壊的変更

{BREAKING_CHANGES}

## テスト結果

- [ ] lint: {LINT_RESULT}
- [ ] typecheck: {TYPECHECK_RESULT}
- [ ] test: {TEST_RESULT}
- [ ] build: {BUILD_RESULT}
- [ ] e2e: {E2E_RESULT}

## セキュリティ修正

{SECURITY_FIXES}

## パフォーマンス影響

{PERFORMANCE_IMPACT}

## 備考

{NOTES}

## チェックリスト

- [ ] `bun outdated` で古い依存関係を確認
- [ ] メジャーバージョンアップの場合、CHANGELOGとMigration Guideを確認
- [ ] `bun update` または `bun add <package>@latest` で更新
- [ ] `bun install` で lockfile を更新
- [ ] 全品質チェック（lint/typecheck/test/build）を実行
- [ ] E2Eテストを実行（必要に応じて）
- [ ] 更新内容をこのログに記録
- [ ] 変更をコミット（`feat(deps): 依存関係を更新`）

## トラブルシューティング

### ビルドエラーが発生した場合

1. エラーメッセージを確認
2. パッケージのCHANGELOGでBreaking Changesを確認
3. Migration Guideに従って修正
4. 修正が困難な場合は一旦ロールバック

### 型エラーが発生した場合

1. `@types/*` パッケージも最新か確認
2. 型定義の変更をコードに反映
3. `bun run typecheck` で全て解決するまで繰り返す

### テストが失敗した場合

1. テストコードの修正が必要か確認
2. パッケージの仕様変更に合わせてテストを更新
3. モックの調整が必要な場合は修正

## 参考リンク

- [依存関係更新スキル](../../.claude/skills/update-deps/SKILL.md)
- [更新履歴一覧](../../../logs/dependencies/)
