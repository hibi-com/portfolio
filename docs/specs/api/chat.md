---
title: "Chat API 仕様"
---

リアルタイムチャットシステムのAPI仕様書です。

## 概要

Chat APIは以下の機能を提供します:

- **ChatRoom**: チャットルームの管理
- **ChatParticipant**: 参加者の管理
- **ChatMessage**: メッセージの送受信
- **WebSocket**: リアルタイム通信

## 認証

すべてのChat APIエンドポイントは認証が必要です。

## エンドポイント一覧

| Method | Path | 説明 |
| ------ | ---- | ---- |
| GET | `/api/chat/rooms` | ルーム一覧取得 |
| POST | `/api/chat/rooms` | ルーム作成 |
| GET | `/api/chat/rooms/:id` | ルーム詳細取得 |
| POST | `/api/chat/rooms/:id/close` | ルームクローズ |
| POST | `/api/chat/rooms/:id/participants` | 参加者追加 |
| GET | `/api/chat/rooms/:id/messages` | メッセージ一覧取得 |
| POST | `/api/chat/rooms/:id/messages` | メッセージ送信 |
| GET | `/api/chat/rooms/:id/ws` | WebSocket接続 |

## データモデル

### ChatRoom

```typescript
interface ChatRoom {
    id: string;
    customerId?: string;
    inquiryId?: string;
    status: "ACTIVE" | "ARCHIVED" | "CLOSED";
    createdAt: string;
    updatedAt: string;
    participants: ChatParticipant[];
}
```

### ChatParticipant

```typescript
interface ChatParticipant {
    id: string;
    roomId: string;
    userId?: string;
    customerId?: string;
    role: "CUSTOMER" | "AGENT" | "OBSERVER";
    joinedAt: string;
    leftAt?: string;
}
```

### ChatMessage

```typescript
interface ChatMessage {
    id: string;
    roomId: string;
    participantId: string;
    type: "TEXT" | "IMAGE" | "FILE" | "SYSTEM";
    content: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
}
```

## 関連シーケンス図

- [チャットルーム作成](../sequence/api/chat/chat-room-create.md)
- [メッセージ送信](../sequence/api/chat/chat-message-send.md)
- [参加者追加](../sequence/api/chat/chat-participant-add.md)
