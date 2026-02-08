---
title: "Integration (Freee) API 仕様"
---

freee会計との連携機能のAPI仕様書です。OAuth 2.0認証とデータ同期機能を提供します。

## 概要

Integration APIは以下の機能を提供します:

- **OAuth認証**: freeeとのOAuth 2.0連携
- **データ同期**: 取引先のインポート/エクスポート
- **同期ログ**: 同期履歴の管理

## 認証

すべてのIntegration APIエンドポイントは認証が必要です。

## エンドポイント一覧

| Method | Path | 説明 |
| ------ | ---- | ---- |
| GET | `/api/freee/auth` | 認証URL取得 |
| POST | `/api/freee/callback` | OAuthコールバック |
| GET | `/api/freee/integration` | 連携状態取得 |
| POST | `/api/freee/:id/disconnect` | 連携解除 |
| POST | `/api/freee/:id/sync/partners/import` | freee→CRM同期 |
| POST | `/api/freee/:id/sync/partners/export` | CRM→freee同期 |
| GET | `/api/freee/:id/sync/logs` | 同期ログ取得 |

## データモデル

### FreeeIntegration

```typescript
interface FreeeIntegration {
    id: string;
    userId: string;
    companyId: number;
    companyName: string;
    accessToken: string;      // 暗号化保存
    refreshToken: string;     // 暗号化保存
    tokenExpiresAt: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
```

### FreeeSyncLog

```typescript
interface FreeeSyncLog {
    id: string;
    integrationId: string;
    syncType: "IMPORT" | "EXPORT" | "BIDIRECTIONAL";
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
    totalRecords: number;
    processedRecords: number;
    failedRecords: number;
    errorMessage?: string;
    startedAt: string;
    completedAt?: string;
}
```

## OAuth フロー

1. クライアントが `/api/freee/auth` で認証URLを取得
2. ユーザーがfreeeで認証・認可
3. freeeがリダイレクトURIにコードを付与してリダイレクト
4. クライアントが `/api/freee/callback` でトークンを取得
5. トークンを使用してAPIアクセス

## 関連シーケンス図

- [Freee OAuth認証](../sequence/api/integration/freee-auth.md)
- [Freeeデータ同期](../sequence/api/integration/freee-sync.md)
