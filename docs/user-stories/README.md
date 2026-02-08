---
title: "ユーザーストーリー"
---

このドキュメントは、システムのユーザーストーリーを定義します。各ユーザーストーリーは対応するLarge Test（E2Eテスト）と1:1で対応しています。

## ストーリー形式

各ユーザーストーリーは以下の形式で記述されます:

```
As a [ロール]
I want to [目的]
So that [理由]
```

## ユーザーロール

| ロール | 説明 |
|--------|------|
| **Visitor** | サイト訪問者（未認証） |
| **Admin** | 管理者（認証済み） |
| **CRM User** | CRMシステム利用者 |

## ストーリー一覧

### Visitor（訪問者）

- [ブログを閲覧する](./visitor/browse-blog.md)
- [ポートフォリオを閲覧する](./visitor/browse-portfolio.md)
- [問い合わせを送信する](./visitor/submit-inquiry.md)

### Admin（管理者）

- [投稿を管理する](./admin/manage-posts.md)
- [ポートフォリオを管理する](./admin/manage-portfolios.md)
- [問い合わせを管理する](./admin/manage-inquiries.md)

### CRM User（CRM利用者）

- [顧客を管理する](./crm-user/manage-customers.md)
- [リードを管理する](./crm-user/manage-leads.md)
- [商談を管理する](./crm-user/manage-deals.md)

## テストとの対応

各ユーザーストーリーには対応するLarge Testが存在します:

```
docs/user-stories/visitor/browse-blog.md
  ↓ 対応
apps/web/e2e/large/visitor/browse-blog.large.spec.ts
```

Large Testではユーザーストーリーのシナリオを自動化テストとして実装します。
