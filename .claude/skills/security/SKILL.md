---
name: security
description: OWASP Top 10に基づくセキュリティチェックを実行し、隔週レポートを作成します。
argument-hint: ""
allowed-tools: Bash, Read, Write, Glob, Grep
---

# Security Check Skill

OWASP Top 10に基づくセキュリティチェックを実行し、結果をログに記録します。

## 使用方法

```text
/security    # セキュリティチェックを実行
```

## 実行手順

### 1. テンプレート読み込み

`.claude/templates/security/owasp-checklist.md` を読み込みます。

### 2. 日付情報の設定

- **チェック日**: 本日の日付
- **対象期間**: 前回チェックから今回まで（隔週）
- **次回チェック予定**: 2週間後

### 3. 各項目のチェック実行

OWASP Top 10の各項目について、以下を実行：

#### A01: アクセス制御の不備
```bash
grep -r "authMiddleware\|requireRole" apps/api/src/interface/rest/
```

#### A02: 暗号化の失敗
```bash
# Cloudflare HTTPS設定確認（本番環境の場合）
curl -I https://your-domain.com | grep -i "strict-transport-security"
```

#### A03: インジェクション
```bash
# Zodバリデーション確認
grep -r "z\." packages/validation/src/

# 生SQL検索
grep -r "\$queryRaw\|\$executeRaw" packages/db/
```

#### A04: 安全でない設計
```bash
# レート制限確認
grep -r "rateLimit\|throttle" apps/api/src/
```

#### A05: セキュリティの設定ミス
```bash
# セキュリティヘッダー確認
curl -I https://your-domain.com

# .env ファイルの権限確認
find . -name ".env*" -exec ls -la {} \;
```

#### A06: 脆弱で古いコンポーネント
```bash
# 脆弱性チェック
bun audit

# 更新可能パッケージ確認
bun outdated

# 未使用パッケージ確認
bunx depcheck
```

#### A07: 識別と認証の失敗
```bash
# パスワードポリシー確認
grep -r "password.*validation\|passwordPolicy" packages/validation/src/
```

#### A08: ソフトウェアとデータの整合性の失敗
```bash
# Trivyスキャン実行
trivy fs --severity HIGH,CRITICAL .
```

#### A09: セキュリティログとモニタリングの失敗
```bash
# ログ出力確認
grep -r "logger\.\(info\|warn\|error\)" apps/api/src/
```

#### A10: SSRF
```bash
# URL検証確認
grep -r "validateUrl\|isPrivateIp" apps/api/src/lib/
```

### 4. 結果の記録

チェック結果を `logs/security/YYYY-MM-DD-security-check.md` に保存します。

ファイル名形式: `YYYY-MM-DD-security-check.md`
例: `2024-02-19-security-check.md`

### 5. サマリー作成

- 各カテゴリの状態を評価（✅ 問題なし / ⚠️ 要注意 / ❌ 要対応）
- 優先度の高いアクションをリストアップ
- 次回チェック予定日を設定

### 6. 報告

ユーザーにチェック結果のサマリーを報告し、ログファイルのパスを通知します。

## チェック頻度

- **推奨頻度**: 隔週（2週間に1回）
- **最小頻度**: 月次（1ヶ月に1回）

## 評価基準

### ✅ 問題なし
- すべてのチェック項目をクリア
- 既知の脆弱性なし
- 設定が適切

### ⚠️ 要注意
- 軽微な問題あり
- 改善推奨事項あり
- 次回チェックまでに対応

### ❌ 要対応
- 重大な脆弱性あり
- 緊急対応が必要
- すぐに修正すべき問題

## 出力例

```markdown
## サマリー

### 総合評価

| カテゴリ | 状態 | 備考 |
| -------- | ---- | ---- |
| A01: アクセス制御 | ✅ | 認証ミドルウェア適用済み |
| A02: 暗号化 | ✅ | HTTPS強制、bcrypt使用 |
| A03: インジェクション | ⚠️ | XSS対策の追加確認が必要 |
...

### 優先度の高いアクション

1. XSS対策の追加実装（DOMPurify適用範囲を拡大）
2. レート制限の実装（現在未実装）
3. 依存関係の更新（3件の軽微な脆弱性）
```

## 注意事項

- **本番環境へのアクセス**: 本番環境のチェックは慎重に行う
- **機密情報**: ログに機密情報を含めない
- **自動化**: 可能な限りCI/CDに統合
- **False Positive**: 誤検知の可能性を考慮

## 参考ドキュメント

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [チェックリストテンプレート](.claude/templates/security/owasp-checklist.md)
- [セキュリティガイドライン](docs/security/guidelines.md)

## 関連スキル

- `/review` - コードレビュー時にセキュリティ観点も確認
- `/lint` - リントチェックでセキュリティルールも確認
