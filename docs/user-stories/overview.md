---
title: ユーザーストーリー概要
description: BDD形式のユーザーストーリー管理
---

## 概要

このディレクトリには、BDD（振る舞い駆動開発）形式のユーザーストーリーを管理しています。各ストーリーはLarge Tests（E2Eテスト）と1:1で対応します。

## ディレクトリ構成

```text
docs/user-stories/
├── overview.md           # このファイル
├── visitor/              # 一般訪問者のストーリー
│   ├── browse-blog.md
│   ├── browse-portfolio.md
│   └── submit-inquiry.md
├── admin/                # 管理者のストーリー
│   ├── manage-posts.md
│   ├── manage-portfolios.md
│   └── manage-inquiries.md
└── crm-user/             # CRMユーザーのストーリー
    ├── manage-customers.md
    ├── manage-leads.md
    └── manage-deals.md
```

## ペルソナ定義

### Visitor（一般訪問者）

| 属性 | 値 |
| ---- | -- |
| 認証 | 不要 |
| 目的 | ポートフォリオ閲覧、ブログ閲覧、問い合わせ |
| 技術レベル | 初心者〜上級者 |

### Admin（管理者）

| 属性 | 値 |
| ---- | -- |
| 認証 | 必要（管理者権限） |
| 目的 | コンテンツ管理、問い合わせ対応 |
| 技術レベル | 中級者〜上級者 |

### CRM User（CRMユーザー）

| 属性 | 値 |
| ---- | -- |
| 認証 | 必要（CRM権限） |
| 目的 | 顧客管理、リード管理、案件管理 |
| 技術レベル | 中級者 |

## ストーリー形式

```text
As a {ペルソナ}
I want to {目標}
So that {利益}
```

## 受け入れ条件形式

```text
Given {前提条件}
When {アクション}
Then {期待結果}
```

## ストーリー一覧

### Visitor ストーリー

| ストーリー | 説明 | E2Eテスト |
| ---------- | ---- | --------- |
| [ブログ閲覧](./visitor/browse-blog.md) | ブログ記事を閲覧する | `browse-blog.large.spec.ts` |
| [ポートフォリオ閲覧](./visitor/browse-portfolio.md) | ポートフォリオを閲覧する | `browse-portfolio.large.spec.ts` |
| [問い合わせ送信](./visitor/submit-inquiry.md) | 問い合わせフォームから送信する | `submit-inquiry.large.spec.ts` |

### Admin ストーリー

| ストーリー | 説明 | E2Eテスト |
| ---------- | ---- | --------- |
| [記事管理](./admin/manage-posts.md) | ブログ記事のCRUD操作 | `manage-posts.large.spec.ts` |
| [ポートフォリオ管理](./admin/manage-portfolios.md) | ポートフォリオのCRUD操作 | `manage-portfolios.large.spec.ts` |
| [問い合わせ管理](./admin/manage-inquiries.md) | 問い合わせの確認・返信 | `manage-inquiries.large.spec.ts` |

### CRM User ストーリー

| ストーリー | 説明 | E2Eテスト |
| ---------- | ---- | --------- |
| [顧客管理](./crm-user/manage-customers.md) | 顧客情報のCRUD操作 | `manage-customers.large.spec.ts` |
| [リード管理](./crm-user/manage-leads.md) | リードの管理と変換 | `manage-leads.large.spec.ts` |
| [案件管理](./crm-user/manage-deals.md) | 案件パイプラインの管理 | `manage-deals.large.spec.ts` |

## テンプレート

ユーザーストーリーを作成する際は、以下のテンプレートを使用してください。

```text
.claude/templates/sdd/user-story.md
```

## 関連ドキュメント

- [テスト戦略](../development/testing.md)
- [QAシート](../testing/qa-sheet.md)
- [シーケンス図](../sequence/)
