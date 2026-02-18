---
title: "Domain-Driven Design (DDD)"
---

このプロジェクトでは、**Domain-Driven Design (DDD)** アーキテクチャを採用しています。
DDDは、複雑なビジネスロジックを扱うバックエンドアプリケーションの設計手法です。

## レイヤー構造

DDDは、アプリケーションを次のレイヤーに分割します。

### src/ (DDD Root)

すべてのレイヤーは`src/`ディレクトリ配下に配置されます。

```text
src/
├── usecase/          # Application Rules (ユースケース層)
├── domain/           # Enterprise Rules (ドメイン層)
├── infra/            # Frameworks (インフラストラクチャ層)
├── interface/        # Adapters (インターフェース層)
├── lib/              # Shared internal utilities
└── di/               # Dependency Injection
```

### usecase/ (Application Rules)

アプリケーション固有のビジネスロジックを実装します。

- ユースケース（ユーザーの操作単位）を表現
- ドメインサービスやリポジトリを組み合わせて処理を実現
- トランザクション管理やエラーハンドリングを含む

```text
usecase/
└── <ドメイン名>/
    └── <ユースケース名>.ts
```

### domain/ (Enterprise Rules)

ドメインの核心となるビジネスルールを定義します。

- **Model**: エンティティ、値オブジェクト、ドメインイベント
- **Repository Interface**: データアクセスの抽象化

```text
domain/
└── <ドメイン名>/
    ├── model/
    │   ├── entity.ts           # エンティティ
    │   ├── valueObject.ts      # 値オブジェクト
    │   └── event.ts            # ドメインイベント
    └── repository.ts           # リポジトリインターフェース
```

### infra/ (Frameworks)

外部システムとの接続を実装します。

- **Repository Implementation**: リポジトリインターフェースの実装
- **Database**: D1（Cloudflare D1）へのアクセス
- **External Services**: 外部APIクライアントなど

```text
infra/
├── <ドメイン名>/
│   ├── repository.ts         # Repository実装
│   └── cached-<ドメイン名>.repository.ts  # キャッシュ付きRepository実装
├── cache.service.ts          # キャッシュサービス
└── ...
```

### interface/ (Adapters)

外部との接点を定義します。

- **REST Handlers**: REST APIエンドポイントの定義
- **Middleware**: 認証、ロギング、エラーハンドリングなど

```text
interface/
├── rest/
│   ├── posts.ts              # Posts RESTハンドラー
│   └── portfolios.ts         # Portfolios RESTハンドラー
└── middleware/
    └── auth.ts               # 認証ミドルウェア
```

### lib/ (Shared Internal Utilities)

アプリケーション内で共有されるユーティリティを配置します。

- 共通ユーティリティ
- ロガー実装

```text
lib/
└── logger.ts
```

### di/ (Dependency Injection)

依存性注入の設定を管理します。

- 各レイヤーの依存関係を定義
- テスト時のモック注入を容易にする

```text
di/
└── container.ts
```

## 依存関係のルール

DDDの依存関係ルールに従い、外側のレイヤーから内側のレイヤーへのみ依存できます。

**許可される依存関係:**

- ✅ `interface/` → `usecase/`, `domain/`, `lib/`, `di/`
- ✅ `usecase/` → `domain/`, `lib/`
- ✅ `infra/` → `domain/`, `lib/`
- ✅ `domain/` → `lib/`（可能な限り最小限に）
- ✅ `di/` → すべてのレイヤー（依存性注入のため）

**禁止される依存関係:**

- ❌ `domain/` → `usecase/`, `infra/`, `interface/`
- ❌ `usecase/` → `infra/`, `interface/`
- ❌ `infra/` → `usecase/`, `interface/`
- ❌ 内側のレイヤーから外側のレイヤーへの依存（循環依存の防止）

## ディレクトリ構造のルール

### アプリケーション層 (`apps/api`)

- **必須**: `src/`ディレクトリをソースルートとして使用します
- **禁止**: `app/`ディレクトリは使用しません
- 例: `apps/api/src/`

### 命名規則

- **重要**: `utils`というディレクトリ名は**厳格に禁止**されています
- 代わりに`lib`、`shared`、`infra`、または具体的な名前を使用してください

## 参考資料

- [Domain-Driven Design (Eric Evans)](https://www.domainlanguage.com/ddd/)
- [Implementing Domain-Driven Design (Vaughn Vernon)](https://vaughnvernon.com/implementing-domain-driven-design/)
- [DDD Reference](https://www.domainlanguage.com/ddd/reference/)
