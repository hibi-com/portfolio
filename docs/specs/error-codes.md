---
title: エラーコード仕様
description: PF形式の構造化エラーコード仕様
---

## 概要

このプロジェクトでは、PF形式の構造化されたエラーコードを採用しています。  
すべてのエラーは `AppError` クラスを通じて管理され、一貫したエラーレスポンスを提供します。

## エラーコード体系

### PFxxxxxx形式

エラーコードは `PF` + 6桁の数字で構成する。  
3文字目（先頭桁）がカテゴリを示す: PF1=認証、PF2=バリデーション、PF3=Not Found、PF4=内部、PF5=外部サービス、PF6=レート制限、PF7=DB、PF8=キャッシュ。

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

`AppError.fromCode(ErrorCodes.xxx, message, { metadata })` でエラーを生成する。  
`error.code` / `category` / `httpStatus` で参照し、API レスポンスには `error.toJSON()` を使う。  
実装例は `@portfolio/log` を参照。

### APIルートでのエラーハンドリング

try 内で useCase を実行し、catch で `AppError` の場合はそのまま、それ以外は `AppError.fromCode(INTERNAL_SERVER_ERROR, ...)` に包む。  
レスポンスは `c.json(appError.toJSON(), appError.httpStatus)` で返す。  
実装例は `apps/api/src/interface/rest/` を参照。

## エラーレスポンス形式

### 成功レスポンス

成功時は `{ data: { ... } }` 形式で返す。

### エラーレスポンス

エラー時は `code`（PF形式）、`category`、`message`、`httpStatus`、任意で `metadata` を含む JSON を返す。  
例: 404 の場合は code "PF300003"、message "ポートフォリオが見つかりません"、metadata に slug 等。

## ヘルパー関数

### getErrorCategory

`getErrorCategory(ErrorCodes.xxx)` でエラーコードからカテゴリ（AUTHENTICATION 等）を取得する。  
実装は `@portfolio/log` を参照。

### getHttpStatusFromErrorCode

`getHttpStatusFromErrorCode(ErrorCodes.xxx)` で HTTP ステータス（例: 404）を取得する。

### getErrorCodeName

`getErrorCodeName(ErrorCodes.xxx)` で PF 形式から定数名（例: "AUTH_INVALID_TOKEN"）を取得する。

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
