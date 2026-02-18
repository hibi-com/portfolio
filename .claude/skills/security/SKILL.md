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

1. **テンプレート読み込み**: `.claude/templates/security/owasp-checklist.md` を読み込む
2. **日付情報の設定**: チェック日、対象期間、次回チェック予定を設定
3. **各項目のチェック実行**: OWASP Top 10の各項目について、チェックリストに従ってチェック
4. **結果の記録**: `logs/security/YYYY-MM-DD-security-check.md` に保存
5. **サマリー作成**: 総合評価、優先度の高いアクションをリストアップ
6. **報告**: チェック結果のサマリーをユーザーに報告

## チェック項目

**IMPORTANT**: セキュリティチェック実行時は以下のテンプレートを参照してください。

- **[OWASPチェックリスト](../../templates/security/owasp-checklist.md)** - 具体的なチェック項目とコマンド（Single Source of Truth）
- **[セキュリティガイドライン](docs/security/guidelines.md)** - プロジェクト固有のセキュリティ対策

### チェック対象（OWASP Top 10）

1. A01: アクセス制御の不備
2. A02: 暗号化の失敗
3. A03: インジェクション
4. A04: 安全でない設計
5. A05: セキュリティ設定ミス
6. A06: 脆弱で古いコンポーネント
7. A07: 識別と認証の失敗
8. A08: ソフトウェアとデータの整合性の失敗
9. A09: セキュリティログとモニタリングの失敗
10. A10: SSRF

詳細なチェック項目とコマンドは `.claude/templates/security/owasp-checklist.md` を参照。

## チェック頻度

- **推奨頻度**: 隔週（2週間に1回）
- **最小頻度**: 月次（1ヶ月に1回）

## 評価基準

| 状態 | 基準 |
| ---- | ---- |
| ✅ 問題なし | すべてのチェック項目をクリア、既知の脆弱性なし |
| ⚠️ 要注意 | 軽微な問題あり、改善推奨事項あり |
| ❌ 要対応 | 重大な脆弱性あり、緊急対応が必要 |

## 結果の記録

### ファイル名

```text
logs/security/YYYY-MM-DD-security-check.md
```

例: `2026-02-19-security-check.md`

### 出力フォーマット

```markdown
# セキュリティチェック結果

## サマリー

- **チェック日**: YYYY-MM-DD
- **総合評価**: ✅ 合格 / ⚠️ 要改善 / ❌ 不合格

## 総合評価

| カテゴリ | 状態 | 備考 |
| -------- | ---- | ---- |
| A01: アクセス制御 | ✅ | ... |
...

## 優先度の高いアクション

1. ...
2. ...
```

## 参考ドキュメント

| ドキュメント | 説明 |
| ------------ | ---- |
| [OWASPチェックリスト](../../templates/security/owasp-checklist.md) | **具体的なチェック項目とコマンド（必読）** |
| [セキュリティガイドライン](docs/security/guidelines.md) | プロジェクト固有のセキュリティ対策 |
| [OWASP Top 10 2021](https://owasp.org/Top10/) | 公式ドキュメント |

## 注意事項

- **Single Source of Truth原則に従う**: チェックリストの詳細は `.claude/templates/security/owasp-checklist.md` を参照
- **スキルファイルには詳細を記載しない**: 修正のヌケモレを防ぐため、詳細はテンプレートに集約
- **本番環境へのアクセス**: 本番環境のチェックは慎重に行う
- **機密情報**: ログに機密情報を含めない
- **False Positive**: 誤検知の可能性を考慮

## 関連スキル

- `/review` - コードレビュー時にセキュリティ観点も確認
- `/lint` - リントチェックでセキュリティルールも確認
