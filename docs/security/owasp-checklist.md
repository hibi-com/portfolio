---
title: OWASP Top 10 チェックリスト (2021)
description: OWASP Top 10に基づくセキュリティ評価チェックリスト
---

## 概要

このチェックリストは、OWASP Top 10 (2021) に基づいてプロジェクトのセキュリティを評価するためのものです。

## A01:2021 - アクセス制御の不備

- [ ] すべての保護されたリソースに認証チェックがある
- [ ] ロールベースのアクセス制御が実装されている
- [ ] 直接オブジェクト参照（IDOR）が防止されている
- [ ] 認可バイパスのテストが実施されている
- [ ] デフォルトで拒否するポリシーが適用されている

### 実装例

```typescript
// apps/api/src/interface/rest/protected.ts
app.use("/admin/*", authMiddleware, requireRole("admin"));
app.use("/api/*", authMiddleware);

// 直接オブジェクト参照の防止
app.get("/users/:id", async (c) => {
    const requestedId = c.req.param("id");
    const currentUser = c.get("user");

    // 自分のデータまたは管理者のみアクセス可能
    if (requestedId !== currentUser.id && !currentUser.isAdmin) {
        throw AppError.fromCode(ErrorCodes.AUTH_FORBIDDEN);
    }
});
```

## A02:2021 - 暗号化の失敗

- [ ] すべての通信がHTTPS/TLSで暗号化されている
- [ ] パスワードが適切にハッシュ化されている（bcrypt/argon2）
- [ ] 機密データが保存時に暗号化されている
- [ ] 弱い暗号アルゴリズムが使用されていない
- [ ] 暗号鍵が安全に管理されている

### 実装確認

| 項目 | 現状 | 対策 |
| ---- | ---- | ---- |
| HTTPS | Cloudflare自動 | 強制リダイレクト設定済み |
| パスワードハッシュ | Better Auth (bcrypt) | 設定確認済み |
| シークレット管理 | Cloudflare Secrets | wrangler secret使用 |

## A03:2021 - インジェクション

- [ ] すべてのユーザー入力がバリデーションされている
- [ ] パラメータ化クエリ/ORMが使用されている
- [ ] 出力がコンテキストに応じてエスケープされている
- [ ] コマンドインジェクションが防止されている
- [ ] XSSが防止されている

### 脆弱性タイプと対策

| タイプ | 対策 | 実装 |
| ------ | ---- | ---- |
| SQLインジェクション | Prisma ORM使用 | パラメータ化クエリ |
| XSS | DOMPurify使用 | 出力サニタイズ |
| コマンドインジェクション | 外部コマンド不使用 | N/A |
| NoSQLインジェクション | Zodバリデーション | 入力検証 |

## A04:2021 - 安全でない設計

- [ ] 脅威モデリングが実施されている
- [ ] セキュリティ要件が定義されている
- [ ] セキュアな設計パターンが使用されている
- [ ] ビジネスロジックの脆弱性がテストされている
- [ ] レート制限が実装されている

### 設計レビューポイント

```text
□ 認証フローが安全か
□ 認可モデルが適切か
□ データフローに漏洩リスクがないか
□ エラー処理が情報を漏らさないか
□ ログに機密情報が含まれないか
```

## A05:2021 - セキュリティの設定ミス

- [ ] 不要な機能が無効化されている
- [ ] デフォルト認証情報が変更されている
- [ ] エラーメッセージがスタックトレースを含まない
- [ ] セキュリティヘッダーが設定されている
- [ ] 最新のセキュリティパッチが適用されている

### 確認コマンド

```bash
# セキュリティヘッダー確認
curl -I https://your-domain.com | grep -E "^(X-|Content-Security|Strict)"

# 依存関係の脆弱性
bun audit

# 設定ファイルの権限
ls -la .env* 2>/dev/null || echo "No .env files (good)"
```

## A06:2021 - 脆弱で古いコンポーネント

- [ ] 依存関係が最新に保たれている
- [ ] 既知の脆弱性がないことが確認されている
- [ ] 使用していないコンポーネントが削除されている
- [ ] ソフトウェア構成表（SBOM）が維持されている
- [ ] 自動更新の仕組みがある

### 依存関係チェック

```bash
# 脆弱性チェック
bun audit

# 更新可能なパッケージ
bun outdated

# 未使用パッケージ
npx depcheck
```

## A07:2021 - 識別と認証の失敗

- [ ] 強力なパスワードポリシーが適用されている
- [ ] ブルートフォース攻撃が防止されている
- [ ] セッション管理が安全である
- [ ] MFA（多要素認証）がサポートされている
- [ ] パスワードリセットが安全に実装されている

### パスワードポリシー

| 要件 | 設定値 |
| ---- | ------ |
| 最小長 | 12文字 |
| 大文字 | 必須 |
| 小文字 | 必須 |
| 数字 | 必須 |
| 記号 | 必須 |
| 履歴チェック | 過去5回 |

## A08:2021 - ソフトウェアとデータの整合性の失敗

- [ ] CI/CDパイプラインが保護されている
- [ ] 依存関係の整合性が検証されている
- [ ] シリアライズされたデータが検証されている
- [ ] コード署名が実装されている
- [ ] 自動更新機能が安全である

### CI/CDセキュリティ

```yaml
# .github/workflows/security.yml
name: Security Check
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: bun audit
      - run: trivy fs --severity HIGH,CRITICAL .
```

## A09:2021 - セキュリティログとモニタリングの失敗

- [ ] ログインの成功/失敗がログに記録されている
- [ ] アクセス制御の失敗がログに記録されている
- [ ] ログが改ざんから保護されている
- [ ] アラートが適切に設定されている
- [ ] インシデント対応計画がある

### ログ出力基準

| イベント | ログレベル | 必須情報 |
| -------- | ---------- | -------- |
| 認証成功 | INFO | user_id, ip, timestamp |
| 認証失敗 | WARN | ip, attempt_count, timestamp |
| 認可エラー | WARN | user_id, resource, required_permission |
| 入力検証エラー | WARN | endpoint, validation_errors |
| システムエラー | ERROR | error_code, stack_trace, context |

## A10:2021 - サーバーサイドリクエストフォージェリ (SSRF)

- [ ] ユーザー提供のURLが検証されている
- [ ] 内部ネットワークへのアクセスがブロックされている
- [ ] リダイレクトが制限されている
- [ ] 許可リストによるURL検証がある
- [ ] DNSリバインディングが防止されている

### URL検証例

```typescript
// apps/api/src/lib/url-validator.ts
const BLOCKED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "169.254.169.254", // AWS metadata
    "metadata.google.internal", // GCP metadata
];

export function isAllowedUrl(urlString: string): boolean {
    try {
        const url = new URL(urlString);

        // プロトコル制限
        if (!["http:", "https:"].includes(url.protocol)) {
            return false;
        }

        // ブロックリスト確認
        if (BLOCKED_HOSTS.includes(url.hostname)) {
            return false;
        }

        // プライベートIPチェック
        if (isPrivateIP(url.hostname)) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}
```

## 総合チェックリスト

### 定期レビュー（月次）

- [ ] A01: アクセス制御のテスト
- [ ] A02: 暗号化設定の確認
- [ ] A03: インジェクションテスト
- [ ] A06: 依存関係の更新
- [ ] A09: ログレビュー

### デプロイ前チェック

- [ ] `bun audit` が通過
- [ ] `trivy fs` がCritical/High検出なし
- [ ] セキュリティヘッダー設定確認
- [ ] 機密情報がコードに含まれていない

## 関連ドキュメント

- [セキュリティガイドライン](./guidelines.md)
- [エラーコード仕様](../specs/error-codes.md)
- [テスト戦略](../development/testing.md)
