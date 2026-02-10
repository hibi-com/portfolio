export type {
    AddParticipantInput,
    ChatMessage,
    ChatMessageType,
    ChatParticipant,
    ChatParticipantRole,
    ChatRoom,
    ChatRoomStatus,
    ChatRoomWithParticipants,
    CreateChatRoomInput,
    SendMessageInput,
} from "@portfolio/api/generated/zod";

import type {
    AddParticipantInput,
    ChatMessage,
    ChatParticipant,
    ChatRoom,
    ChatRoomStatus,
    ChatRoomWithParticipants,
    CreateChatRoomInput,
    SendMessageInput,
} from "@portfolio/api/generated/zod";

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
