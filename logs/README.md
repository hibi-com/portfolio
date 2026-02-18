# Logs

プロジェクトの各種ログを格納するディレクトリです。

## ディレクトリ構成

```text
logs/
├── security/          # セキュリティチェックログ（隔週）
│   └── YYYY-MM-DD-security-check.md
├── dependencies/      # 依存関係更新ログ（月次）
│   └── YYYY-MM-DD-update.md
├── deployment/        # デプロイ履歴ログ
│   ├── README.md
│   └── YYYY-MM-DD-{environment}.md
└── README.md
```

## ログの種類

### Security Logs

OWASP Top 10に基づくセキュリティチェックのログ。

- **頻度**: 隔週（2週間に1回）
- **作成方法**: `/security` スキルを使用
- **テンプレート**: `.claude/templates/security/owasp-checklist.md`

### Dependencies Update Logs

依存関係（npm/bunパッケージ）の更新履歴。

- **頻度**: 月次（第1営業日）、またはセキュリティパッチ発見時
- **作成方法**: `/update-deps` スキルを使用
- **テンプレート**: `.claude/templates/dependencies/update-log.md`
- **内容**: 更新パッケージ、破壊的変更、テスト結果

### Deployment Logs

デプロイ履歴と実行結果のログ。

- **頻度**: デプロイ実行時（RC: 手動承認、STG: 日次0:00 UTC、PRD: 日次12:00 UTC）
- **作成方法**: CircleCI自動実行（手動記録）
- **テンプレート**: `.claude/templates/deployment/deployment-log.md`
- **内容**: デプロイ対象、実行結果、エラー、ロールバック情報
- **重要**: **ローカルからのデプロイは禁止**

## 注意事項

- **機密情報**: ログに機密情報を含めない
- **Git管理**: ログファイルはGit管理対象外（logs/.gitignoreで除外）
- **保持期間**: 古いログは適宜アーカイブまたは削除

## 関連ドキュメント

- [セキュリティガイドライン](../docs/security/guidelines.md)
- [チェックリストテンプレート](../.claude/templates/security/owasp-checklist.md)
