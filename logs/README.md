# Logs

プロジェクトの各種ログを格納するディレクトリです。

## ディレクトリ構成

```
logs/
├── security/          # セキュリティチェックログ（隔週）
│   └── YYYY-MM-DD-security-check.md
└── README.md
```

## ログの種類

### Security Logs

OWASP Top 10に基づくセキュリティチェックのログ。

- **頻度**: 隔週（2週間に1回）
- **作成方法**: `/security` スキルを使用
- **テンプレート**: `.claude/templates/security/owasp-checklist.md`

## 注意事項

- **機密情報**: ログに機密情報を含めない
- **Git管理**: ログファイルはGit管理対象外（logs/.gitignoreで除外）
- **保持期間**: 古いログは適宜アーカイブまたは削除

## 関連ドキュメント

- [セキュリティガイドライン](../docs/security/guidelines.md)
- [公開用OWASPチェックリスト](../docs/security/owasp-checklist.md)
