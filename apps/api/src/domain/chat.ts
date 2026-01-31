export type ChatRoomStatus = "ACTIVE" | "ARCHIVED" | "CLOSED";
export type ChatParticipantRole = "CUSTOMER" | "AGENT" | "OBSERVER";
export type ChatMessageType = "TEXT" | "IMAGE" | "FILE" | "SYSTEM";

export interface ChatRoom {
    id: string;
    customerId?: string;
    inquiryId?: string;
    name?: string;
    status: ChatRoomStatus;
    metadata?: Record<string, unknown>;
    closedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatParticipant {
    id: string;
    chatRoomId: string;
    userId?: string;
    name: string;
    role: ChatParticipantRole;
    isOnline: boolean;
    lastSeenAt?: Date;
    joinedAt: Date;
    leftAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatMessage {
    id: string;
    chatRoomId: string;
    participantId: string;
    type: ChatMessageType;
    content: string;
    metadata?: Record<string, unknown>;
    readBy?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateChatRoomInput {
    customerId?: string;
    inquiryId?: string;
    name?: string;
    metadata?: Record<string, unknown>;
}

export interface AddParticipantInput {
    chatRoomId: string;
    userId?: string;
    name: string;
    role?: ChatParticipantRole;
}

export interface SendMessageInput {
    chatRoomId: string;
    participantId: string;
    type?: ChatMessageType;
    content: string;
    metadata?: Record<string, unknown>;
}

export interface ChatRoomWithParticipants extends ChatRoom {
    participants: ChatParticipant[];
}

export interface ChatRoomWithMessages extends ChatRoom {
    messages: ChatMessage[];
}

export interface ChatRepository {
    findAllRooms(): Promise<ChatRoom[]>;
    findRoomById(id: string): Promise<ChatRoomWithParticipants | null>;
    findRoomsByCustomerId(customerId: string): Promise<ChatRoom[]>;
    findRoomByInquiryId(inquiryId: string): Promise<ChatRoom | null>;
    createRoom(input: CreateChatRoomInput): Promise<ChatRoom>;
    updateRoomStatus(id: string, status: ChatRoomStatus): Promise<ChatRoom>;
    closeRoom(id: string): Promise<ChatRoom>;

    findParticipantsByRoomId(chatRoomId: string): Promise<ChatParticipant[]>;
    findParticipantById(id: string): Promise<ChatParticipant | null>;
    addParticipant(input: AddParticipantInput): Promise<ChatParticipant>;
    updateParticipantOnlineStatus(id: string, isOnline: boolean): Promise<ChatParticipant>;
    removeParticipant(id: string): Promise<void>;

    findMessagesByRoomId(chatRoomId: string, limit?: number, before?: Date): Promise<ChatMessage[]>;
    findMessageById(id: string): Promise<ChatMessage | null>;
    createMessage(input: SendMessageInput): Promise<ChatMessage>;
    markMessagesAsRead(chatRoomId: string, participantId: string, messageIds: string[]): Promise<void>;
}
