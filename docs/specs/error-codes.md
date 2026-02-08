# エラーコード仕様

## 概要

このプロジェクトでは、PF形式の構造化されたエラーコードを採用しています。すべてのエラーは `AppError` クラスを通じて管理され、一貫したエラーレスポンスを提供します。

## エラーコード体系

### PFxxxxxx形式

エラーコードは `PF` + 6桁の数字で構成されます。
最初の桁（3文字目）がカテゴリを示します。

```text
PF1xxxxx: 認証エラー (Authentication)
PF2xxxxx: バリデーションエラー (Validation)
PF3xxxxx: リソース未発見 (Not Found)
PF4xxxxx: 内部エラー (Internal)
PF5xxxxx: 外部サービスエラー (External)
PF6xxxxx: レート制限 (Rate Limit)
PF7xxxxx: データベースエラー (Database)
PF8xxxxx: キャッシュエラー (Cache)
```

### カテゴリと番号体系

| 先頭桁 | カテゴリ | 説明 | HTTPステータス |
| ------ | -------- | ---- | -------------- |
| 1 | AUTHENTICATION | 認証関連エラー | 401 / 403 |
| 2 | VALIDATION | 入力検証エラー | 400 |
| 3 | NOT_FOUND | リソース未発見 | 404 |
| 4 | INTERNAL | サーバー内部エラー | 500 |
| 5 | EXTERNAL | 外部サービスエラー | 500 |
| 6 | RATE_LIMIT | レート制限超過 | 429 |
| 7 | DATABASE | データベースエラー | 500 |
| 8 | CACHE | キャッシュエラー | 500 |

## エラーコード一覧

### 認証エラー (PF1xxxxx)

| コード | 定数名 | 説明 | HTTPステータス | デフォルトメッセージ |
| ------ | ------ | ---- | -------------- | -------------------- |
| `PF100001` | AUTH_INVALID_TOKEN | トークンが無効 | 401 | 無効なトークンです |
| `PF100002` | AUTH_TOKEN_EXPIRED | トークンが期限切れ | 401 | トークンの有効期限が切れています |
| `PF100003` | AUTH_UNAUTHORIZED | 認証が必要 | 401 | 認証が必要です |
| `PF100004` | AUTH_FORBIDDEN | アクセス権限なし | 403 | アクセス権限がありません |
| `PF100005` | AUTH_MISSING_CREDENTIALS | 認証情報が不足 | 401 | 認証情報が不足しています |

### バリデーションエラー (PF2xxxxx)

| コード | 定数名 | 説明 | HTTPステータス | デフォルトメッセージ |
| ------ | ------ | ---- | -------------- | -------------------- |
| `PF200001` | VALIDATION_MISSING_FIELD | 必須フィールドが不足 | 400 | 必須フィールドが不足しています |
| `PF200002` | VALIDATION_INVALID_FORMAT | 形式が不正 | 400 | 無効な形式です |
| `PF200003` | VALIDATION_OUT_OF_RANGE | 範囲外の値 | 400 | 値が範囲外です |
| `PF200004` | VALIDATION_INVALID_TYPE | 型が不正 | 400 | 無効な型です |

### リソース未発見エラー (PF3xxxxx)

| コード | 定数名 | 説明 | HTTPステータス | デフォルトメッセージ |
| ------ | ------ | ---- | -------------- | -------------------- |
| `PF300001` | NOT_FOUND_RESOURCE | 汎用リソース未発見 | 404 | リソースが見つかりません |
| `PF300002` | NOT_FOUND_USER | ユーザー未発見 | 404 | ユーザーが見つかりません |
| `PF300003` | NOT_FOUND_PORTFOLIO | ポートフォリオ未発見 | 404 | ポートフォリオが見つかりません |
| `PF300004` | NOT_FOUND_POST | 投稿未発見 | 404 | 投稿が見つかりません |

### 内部エラー (PF4xxxxx)

| コード | 定数名 | 説明 | HTTPステータス | デフォルトメッセージ |
| ------ | ------ | ---- | -------------- | -------------------- |
| `PF400001` | INTERNAL_SERVER_ERROR | サーバーエラー | 500 | サーバー内部エラーが発生しました |
| `PF400002` | INTERNAL_PROCESSING_ERROR | 処理エラー | 500 | 処理中にエラーが発生しました |

### 外部サービスエラー (PF5xxxxx)

| コード | 定数名 | 説明 | HTTPステータス | デフォルトメッセージ |
| ------ | ------ | ---- | -------------- | -------------------- |
| `PF500001` | EXTERNAL_API_ERROR | 外部APIエラー | 500 | 外部APIでエラーが発生しました |
| `PF500002` | EXTERNAL_TIMEOUT | タイムアウト | 500 | 外部サービスへのリクエストがタイムアウトしました |
| `PF500003` | EXTERNAL_RATE_LIMIT | 外部レート制限 | 500 | 外部サービスのレート制限に達しました |

### レート制限エラー (PF6xxxxx)

| コード | 定数名 | 説明 | HTTPステータス | デフォルトメッセージ |
| ------ | ------ | ---- | -------------- | -------------------- |
| `PF600001` | RATE_LIMIT_EXCEEDED | レート制限超過 | 429 | レート制限を超えました |

### データベースエラー (PF7xxxxx)

| コード | 定数名 | 説明 | HTTPステータス | デフォルトメッセージ |
| ------ | ------ | ---- | -------------- | -------------------- |
| `PF700001` | DATABASE_CONNECTION_ERROR | 接続エラー | 500 | データベースへの接続に失敗しました |
| `PF700002` | DATABASE_QUERY_ERROR | クエリエラー | 500 | データベースクエリの実行に失敗しました |
| `PF700003` | DATABASE_TRANSACTION_ERROR | トランザクションエラー | 500 | データベーストランザクションに失敗しました |

### キャッシュエラー (PF8xxxxx)

| コード | 定数名 | 説明 | HTTPステータス | デフォルトメッセージ |
| ------ | ------ | ---- | -------------- | -------------------- |
| `PF800001` | CACHE_CONNECTION_ERROR | 接続エラー | 500 | キャッシュへの接続に失敗しました |
| `PF800002` | CACHE_OPERATION_ERROR | 操作エラー | 500 | キャッシュ操作に失敗しました |

## AppErrorクラス

### プロパティ

| プロパティ | 型 | 説明 |
| ---------- | -- | ---- |
| `code` | string | PF形式のエラーコード |
| `category` | ErrorCategory | エラーカテゴリ |
| `httpStatus` | number | HTTPステータスコード |
| `message` | string | エラーメッセージ |
| `metadata` | Record<string, unknown> | 追加情報 |
| `originalError` | Error \| undefined | 元のエラー |

### 使用例

```typescript
import { AppError, ErrorCodes } from "@portfolio/log";

// エラーの作成
const error = AppError.fromCode(
    ErrorCodes.VALIDATION_MISSING_FIELD,
    "メールアドレスが必要です",
    {
        metadata: { field: "email" },
    }
);

console.log(error.code);       // "PF200001"
console.log(error.category);   // "VALIDATION"
console.log(error.httpStatus); // 400

// JSONレスポンス用
const json = error.toJSON();
// {
//   code: "PF200001",
//   category: "VALIDATION",
//   message: "メールアドレスが必要です",
//   httpStatus: 400,
//   metadata: { field: "email" }
// }
```

### APIルートでのエラーハンドリング

```typescript
// apps/api/src/interface/rest/crm.ts
import { AppError, ErrorCodes } from "@portfolio/log";

app.get("/customers/:id", async (c) => {
    try {
        const customer = await useCase.getById(c.req.param("id"));
        return c.json(customer);
    } catch (error) {
        const appError = error instanceof AppError
            ? error
            : AppError.fromCode(
                ErrorCodes.INTERNAL_SERVER_ERROR,
                "Unexpected error",
                { originalError: error instanceof Error ? error : undefined }
            );

        return c.json(appError.toJSON(), appError.httpStatus);
    }
});
```

## エラーレスポンス形式

### 成功レスポンス

```json
{
    "data": {
        "id": "123",
        "name": "Example"
    }
}
```

### エラーレスポンス

```json
{
    "code": "PF300003",
    "category": "NOT_FOUND",
    "message": "ポートフォリオが見つかりません",
    "httpStatus": 404,
    "metadata": {
        "slug": "non-existent-slug"
    }
}
```

## ヘルパー関数

### getErrorCategory

エラーコードからカテゴリを取得します。

```typescript
import { getErrorCategory, ErrorCodes, ErrorCategory } from "@portfolio/log";

const category = getErrorCategory(ErrorCodes.AUTH_INVALID_TOKEN);
// ErrorCategory.AUTHENTICATION ("AUTH")
```

### getHttpStatusFromErrorCode

エラーコードからHTTPステータスを取得します。

```typescript
import { getHttpStatusFromErrorCode, ErrorCodes } from "@portfolio/log";

const status = getHttpStatusFromErrorCode(ErrorCodes.NOT_FOUND_POST);
// 404
```

### getErrorCodeName

PF形式のコードから人間が読める名前を取得します。

```typescript
import { getErrorCodeName, ErrorCodes } from "@portfolio/log";

const name = getErrorCodeName(ErrorCodes.AUTH_INVALID_TOKEN);
// "AUTH_INVALID_TOKEN"
```

## 新規エラーコードの追加方法

1. カテゴリに応じた番号範囲を選択（例: 認証エラーはPF1xxxxx）
2. `packages/log/src/errors/error-codes.ts` に定数を追加
3. `packages/log/src/errors/app-error.ts` にデフォルトメッセージを追加
4. テストを追加
5. このドキュメントを更新

## 関連ドキュメント

- [バリデーション仕様](./validation.md)
- [API仕様](./api/)
- [ロギング設定](../development/troubleshooting.md)
