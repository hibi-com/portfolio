---
title: Web アプリケーション仕様
description: ポートフォリオサイトの仕様定義
---

## 概要

ポートフォリオサイト（`apps/web`）の仕様を定義します。

## 技術スタック

| 項目 | 技術 |
| ---- | ---- |
| フレームワーク | Remix |
| ホスティング | Cloudflare Pages |
| スタイリング | Tailwind CSS |
| アーキテクチャ | Feature-Sliced Design (FSD) |

## ディレクトリ構造

```text
apps/web/
├── app/
│   ├── routes/          # ページコンポーネント
│   ├── widgets/         # 大きなUIブロック
│   ├── features/        # ユーザー機能
│   ├── entities/        # ドメインモデル
│   └── shared/          # 共通リソース
├── public/              # 静的ファイル
└── e2e/                 # E2Eテスト
```

## ルーティング

| パス | ページ | 説明 |
| ---- | ------ | ---- |
| `/` | Home | トップページ |
| `/blog` | Blog List | ブログ記事一覧 |
| `/blog/:slug` | Blog Detail | ブログ記事詳細 |
| `/portfolio` | Portfolio List | ポートフォリオ一覧 |
| `/portfolio/:slug` | Portfolio Detail | ポートフォリオ詳細 |
| `/contact` | Contact | お問い合わせフォーム |
| `/about` | About | 自己紹介 |

## ページ仕様

### トップページ (`/`)

サイトのメインエントリーポイント。ポートフォリオのハイライトと最新ブログ記事を表示。

**コンポーネント構成:**

```text
<Header />
<Hero />
<FeaturedPortfolio />
<LatestBlog />
<Footer />
```

#### データ取得

```typescript
// app/routes/_index.tsx
export const loader = async ({ context }: LoaderFunctionArgs) => {
    const portfolios = await fetchFeaturedPortfolios(context);
    const posts = await fetchLatestPosts(context);
    return json({ portfolios, posts });
};
```

### ブログ一覧 (`/blog`)

公開済みのブログ記事を一覧表示。タグでフィルタリング可能。

**コンポーネント構成:**

```text
<Header />
<BlogList>
    <TagFilter />
    <PostCard[] />
    <Pagination />
</BlogList>
<Footer />
```

#### クエリパラメータ

| パラメータ | 型 | 説明 |
| ---------- | -- | ---- |
| `tag` | string | タグでフィルタリング |
| `page` | number | ページ番号（デフォルト: 1） |

### ブログ詳細 (`/blog/:slug`)

ブログ記事の本文を表示。

**コンポーネント構成:**

```text
<Header />
<Article>
    <ArticleHeader />
    <ArticleContent />
    <ArticleTags />
    <RelatedPosts />
</Article>
<Footer />
```

#### メタデータ

```typescript
export const meta: MetaFunction<typeof loader> = ({ data }) => [
    { title: `${data.post.title} | Portfolio` },
    { name: "description", content: data.post.description },
];
```

### ポートフォリオ一覧 (`/portfolio`)

ポートフォリオプロジェクトを一覧表示。

**コンポーネント構成:**

```text
<Header />
<PortfolioGrid>
    <PortfolioCard[] />
</PortfolioGrid>
<Footer />
```

### ポートフォリオ詳細 (`/portfolio/:slug`)

ポートフォリオプロジェクトの詳細を表示。

**コンポーネント構成:**

```text
<Header />
<PortfolioDetail>
    <ImageGallery />
    <ProjectInfo />
    <TechStack />
    <Description />
</PortfolioDetail>
<Footer />
```

### お問い合わせ (`/contact`)

お問い合わせフォームを表示。

**コンポーネント構成:**

```text
<Header />
<ContactForm>
    <NameInput />
    <EmailInput />
    <MessageTextarea />
    <SubmitButton />
</ContactForm>
<Footer />
```

#### バリデーション

| フィールド | ルール |
| ---------- | ------ |
| name | 必須、1-100文字 |
| email | 必須、メール形式 |
| message | 必須、10-1000文字 |

## 共通コンポーネント

### Header

```text
┌─────────────────────────────────────────────┐
│ Logo      Blog  Portfolio  About  Contact   │
└─────────────────────────────────────────────┘
```

### Footer

```text
┌─────────────────────────────────────────────┐
│ © 2024 Portfolio | GitHub | Twitter | ...   │
└─────────────────────────────────────────────┘
```

## パフォーマンス要件

| 項目 | 目標値 |
| ---- | ------ |
| FCP (First Contentful Paint) | < 1.8s |
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTI (Time to Interactive) | < 3.8s |

## SEO要件

- 各ページに適切な`<title>`と`<meta description>`
- Open Graphタグの設定
- 構造化データ（JSON-LD）の設定
- サイトマップの生成
- robots.txtの設定

## アクセシビリティ要件

- WCAG 2.1 AA準拠
- キーボードナビゲーション対応
- スクリーンリーダー対応
- 適切なカラーコントラスト

## 関連ドキュメント

- [アーキテクチャ概要](../../architecture/overview.md)
- [FSD設計](../../architecture/feature-sliced.md)
- [コーディング規約](../../development/coding-standards.md)
