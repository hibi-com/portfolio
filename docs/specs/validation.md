---
title: バリデーション仕様
description: Zodを使用したスキーマベースバリデーションの仕様
---

## 概要

このプロジェクトでは **Zod** を使用してスキーマベースのバリデーションを実装しています。

## バリデーションパッケージ

### パッケージ構成

`packages/validation/` に `src/`と `tests/` を配置する。  
詳細はリポジトリを参照。

## コアバリデーション関数

### ValidationResult インターフェース

`ValidationResult<T>` は `success`（boolean）、成功時は `data`、失敗時は `errors`（ZodError）を持つ。  
型定義は `@portfolio/validation` を参照。

### validate()

安全なバリデーション。エラーをスローせず、結果オブジェクト（success / data / errors）を返す。  
`validate(schema, data)` で呼び出し、`result.success` に応じて `data` または `errors` を扱う。

### validateOrThrow()

バリデーション失敗時に ZodError をスローする。  
`validateOrThrow(schema, input)` で呼び出し、try/catch で ZodError を捕捉して処理する。

## スキーマ定義

スキーマは `packages/validation/src/` 配下のファイル（shared, post, portfolio, graphql など）ごとに定義されている。  
スキーマ名・フィールド・検証内容は実装の変更に伴い変わるため、一覧はこのドキュメントでは固定せず、**`packages/validation/src/` を直接参照**すること。

## APIバリデーション関数

### apps/api/src/lib/validation.ts

| 関数名 | 説明 | 戻り値 |
| ------ | ---- | ------ |
| `isValidSlug(slug)` | スラッグ形式を検証 | boolean |
| `isValidUuid(id)` | UUID v4形式を検証 | boolean |
| `isValidImageContentType(type)` | 画像Content-Typeを検証 | boolean |
| `isValidImageExtension(ext)` | 画像拡張子を検証 | boolean |
| `validateImageMagicBytes(buffer)` | マジックバイトで画像種別を判定 | string \| null |
| `sanitizeFilename(name)` | ファイル名をサニタイズ | string |
| `getFileExtension(name)` | 拡張子を取得 | string |

### スラッグ検証

`isValidSlug(slug)`: 英数字・ハイフン・アンダースコアのみ許可する正規表現で検証する。  
実装は `apps/api/src/lib/validation.ts` を参照。

### UUID検証

`isValidUuid(id)`: UUID v4 形式の正規表現で検証する。  
実装は上記同一ファイルを参照。

### 画像検証

#### 許可されるContent-Type

- `image/jpeg`
- `image/png`
- `image/gif`
- `image/webp`

#### 許可される拡張子

- `.jpg`, `.jpeg`
- `.png`
- `.gif`
- `.webp`

#### マジックバイト検出

| 形式 | マジックバイト |
| ---- | -------------- |
| JPEG | `FF D8 FF` |
| PNG | `89 50 4E 47 0D 0A 1A 0A` |
| GIF | `47 49 46 38` |
| WebP | `52 49 46 46 ... 57 45 42 50` |

## バリデーションパターン

### APIルートでのバリデーション

ルートハンドラー内でパラメータ（例: id）を取得し、`isValidUuid(id)` 等で事前検証する。  
不正な場合は `AppError.fromCode` でエラーを生成し、`c.json(error.toJSON(), error.httpStatus)` で返す。  
実装例は `apps/api/src/interface/rest/` を参照。

### UseCaseでのバリデーション

UseCase の execute でファイルや入力を受け取り、`isValidImageContentType(type)` 等で検証する。  
不正な場合は `AppError.fromCode` を throw する。  
実装例は `apps/api/src/usecase/` を参照。

### フロントエンドでのバリデーション

Zod でフォーム用スキーマ（例: name 必須、email 形式、message 最小長）を定義し、`z.infer` で型を導出する。  
実装例は各アプリの `shared/lib/validation.ts` を参照。

## テスト

バリデーションのテストでは、正常系のデータで `validate(schema, data)` の `result.success` が true、異常系（必須不足・形式不正）で false になることを検証する。  
実装例は `packages/validation/tests/` を参照。

## 関連ドキュメント

- [エラーコード仕様](./error-codes.md)
- [API仕様](./api/)
- [テストガイド](../testing/testing-guide.md)
