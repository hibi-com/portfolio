# CRM/サポートシステム スキーマ作成 (Phase 1)

## 作業日時
2026-02-01

## 解釈した仕様

### 目的
Zendesk + HubSpot風のCRM・サポートシステムのデータベーススキーマを作成する。

### 要件
1. **CRM機能**: 顧客、リード、商談、パイプライン、コンタクト履歴
2. **サポート機能**: 問い合わせ、返信
3. **チャット機能**: チャットルーム、メッセージ、参加者（Durable Objects/WebSocket用）
4. **メール機能**: 送信ログ、テンプレート（Resend統合用）
5. **freee連携**: OAuth認証、同期ログ、顧客・商談マッピング

## 変更したファイル

### 新規作成
| ファイル | 説明 |
|---------|------|
| `packages/db/prisma/schema/crm.prisma` | CRMモデル（Customer, Lead, Deal, Pipeline, PipelineStage, ContactHistory） |
| `packages/db/prisma/schema/inquiry.prisma` | 問い合わせモデル（Inquiry, InquiryResponse） |
| `packages/db/prisma/schema/chat.prisma` | チャットモデル（ChatRoom, ChatMessage, ChatParticipant） |
| `packages/db/prisma/schema/email.prisma` | メールモデル（EmailLog, EmailTemplate） |
| `packages/db/prisma/schema/integration.prisma` | freee連携モデル（FreeeIntegration, FreeeSyncLog, CustomerFreeeMapping, DealFreeeMapping） |

### 修正
| ファイル | 変更内容 |
|---------|---------|
| `packages/db/prisma/schema/auth.prisma` | Userモデルに新規リレーション追加 |

## 作成したデータモデル

### CRM (crm.prisma)
```
Customer (顧客)
├── Lead (リード) - 1:N
├── Deal (商談) - 1:N
├── ContactHistory (コンタクト履歴) - 1:N
├── Inquiry (問い合わせ) - 1:N
├── ChatRoom (チャットルーム) - 1:N
├── EmailLog (メールログ) - 1:N
└── CustomerFreeeMapping (freeeマッピング) - 1:N

Pipeline (パイプライン)
└── PipelineStage (ステージ) - 1:N
    └── Deal (商談) - 1:N
```

### 問い合わせ (inquiry.prisma)
```
Inquiry (問い合わせ)
├── InquiryResponse (返信) - 1:N
└── ChatRoom (チャットルーム) - 1:1
```

### チャット (chat.prisma)
```
ChatRoom (チャットルーム)
├── ChatParticipant (参加者) - 1:N
└── ChatMessage (メッセージ) - 1:N
```

### メール (email.prisma)
```
EmailTemplate (テンプレート)
└── EmailLog (送信ログ) - 1:N
```

### freee連携 (integration.prisma)
```
FreeeIntegration (連携設定)
└── FreeeSyncLog (同期ログ) - 1:N

CustomerFreeeMapping (顧客マッピング)
DealFreeeMapping (商談マッピング)
```

## 検証した結果

1. **スキーマ検証**: `prisma validate` - 成功
2. **データベース同期**: `prisma db push` - 成功
3. **Prisma Client生成**: 成功（Customer, Lead, Deal等の型が生成）
4. **ERDドキュメント生成**: `docs/database/erd.md` に反映

## 残っている課題

### Phase 2以降のタスク
1. **API実装**: Domain, Infra, Usecase, Interface層の実装
2. **Durable Objects**: ChatRoomDO（WebSocket）の実装
3. **Resend統合**: EmailServiceの実装
4. **freee連携**: OAuth認証フロー、同期ロジックの実装
5. **Admin UI**: CRM画面、サポート画面の実装

### 注意事項
- 既存のテスト(`mysql.test.ts`)にvi.mockの問題があるが、今回の変更とは無関係
- prisma-markdownを開発依存として追加

## Enumの定義

### CRM
- `CustomerStatus`: ACTIVE, INACTIVE, PROSPECT, CHURNED
- `LeadStatus`: NEW, CONTACTED, QUALIFIED, UNQUALIFIED, CONVERTED
- `DealStatus`: OPEN, WON, LOST, STALLED
- `ContactType`: EMAIL, PHONE, MEETING, CHAT, NOTE, OTHER

### 問い合わせ
- `InquiryStatus`: OPEN, IN_PROGRESS, WAITING_CUSTOMER, RESOLVED, CLOSED
- `InquiryPriority`: LOW, MEDIUM, HIGH, URGENT
- `InquiryCategory`: GENERAL, TECHNICAL, BILLING, SALES, COMPLAINT, FEATURE_REQUEST, OTHER

### チャット
- `ChatRoomStatus`: ACTIVE, ARCHIVED, CLOSED
- `ChatParticipantRole`: CUSTOMER, AGENT, OBSERVER
- `ChatMessageType`: TEXT, IMAGE, FILE, SYSTEM

### メール
- `EmailStatus`: PENDING, SENT, DELIVERED, BOUNCED, FAILED
- `EmailTemplateCategory`: MARKETING, TRANSACTIONAL, SUPPORT, NOTIFICATION

### freee連携
- `SyncStatus`: PENDING, IN_PROGRESS, COMPLETED, FAILED
- `SyncDirection`: IMPORT, EXPORT, BIDIRECTIONAL
