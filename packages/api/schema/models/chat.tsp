import "@typespec/http";
import "@typespec/openapi3";

enum ChatRoomStatus {
    ACTIVE,
    ARCHIVED,
    CLOSED,
}

enum ChatParticipantRole {
    CUSTOMER,
    AGENT,
    OBSERVER,
}

enum ChatMessageType {
    TEXT,
    IMAGE,
    FILE,
    SYSTEM,
}

model ChatRoom {
    id: string;
    customerId?: string;
    inquiryId?: string;
    name?: string;
    status: ChatRoomStatus;
    metadata?: Record<unknown>;
    closedAt?: string;
    createdAt: string;
    updatedAt: string;
}

model ChatParticipant {
    id: string;
    chatRoomId: string;
    userId?: string;
    name: string;
    role: ChatParticipantRole;
    isOnline: boolean;
    lastSeenAt?: string;
    joinedAt: string;
    leftAt?: string;
    createdAt: string;
    updatedAt: string;
}

model ChatMessage {
    id: string;
    chatRoomId: string;
    participantId: string;
    type: ChatMessageType;
    content: string;
    metadata?: Record<unknown>;
    readBy?: string[];
    createdAt: string;
    updatedAt: string;
}

model CreateChatRoomInput {
    customerId?: string;
    inquiryId?: string;
    name?: string;
    metadata?: Record<unknown>;
}

model AddParticipantInput {
    chatRoomId: string;
    userId?: string;
    name: string;
    role?: ChatParticipantRole;
}

model SendMessageInput {
    chatRoomId: string;
    participantId: string;
    type?: ChatMessageType;
    content: string;
    metadata?: Record<unknown>;
}

model ChatRoomWithParticipants {
    ...ChatRoom;
    participants: ChatParticipant[];
}

model ChatRoomWithMessages {
    ...ChatRoom;
    messages: ChatMessage[];
}
