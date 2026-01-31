import { PrismaClient } from "@prisma/client";
import type {
    AddParticipantInput,
    ChatMessage,
    ChatParticipant,
    ChatRepository,
    ChatRoom,
    ChatRoomStatus,
    ChatRoomWithParticipants,
    CreateChatRoomInput,
    SendMessageInput,
} from "~/domain/chat";

export class ChatRepositoryImpl implements ChatRepository {
    private prisma: PrismaClient;

    constructor(databaseUrl?: string) {
        this.prisma = new PrismaClient({
            datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
        });
    }

    private parseJsonField<T>(value: string | null | undefined): T | undefined {
        if (!value) return undefined;
        try {
            return JSON.parse(value) as T;
        } catch {
            return undefined;
        }
    }

    private stringifyJsonField(value: unknown): string | null {
        if (value === undefined || value === null) return null;
        return JSON.stringify(value);
    }

    private mapToChatRoom(record: {
        id: string;
        customerId: string | null;
        inquiryId: string | null;
        name: string | null;
        status: string;
        metadata: string | null;
        closedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }): ChatRoom {
        return {
            id: record.id,
            customerId: record.customerId ?? undefined,
            inquiryId: record.inquiryId ?? undefined,
            name: record.name ?? undefined,
            status: record.status as ChatRoomStatus,
            metadata: this.parseJsonField<Record<string, unknown>>(record.metadata),
            closedAt: record.closedAt ?? undefined,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        };
    }

    private mapToParticipant(record: {
        id: string;
        chatRoomId: string;
        userId: string | null;
        name: string;
        role: string;
        isOnline: boolean;
        lastSeenAt: Date | null;
        joinedAt: Date;
        leftAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }): ChatParticipant {
        return {
            id: record.id,
            chatRoomId: record.chatRoomId,
            userId: record.userId ?? undefined,
            name: record.name,
            role: record.role as ChatParticipant["role"],
            isOnline: record.isOnline,
            lastSeenAt: record.lastSeenAt ?? undefined,
            joinedAt: record.joinedAt,
            leftAt: record.leftAt ?? undefined,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        };
    }

    private mapToMessage(record: {
        id: string;
        chatRoomId: string;
        participantId: string;
        type: string;
        content: string;
        metadata: string | null;
        readBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }): ChatMessage {
        return {
            id: record.id,
            chatRoomId: record.chatRoomId,
            participantId: record.participantId,
            type: record.type as ChatMessage["type"],
            content: record.content,
            metadata: this.parseJsonField<Record<string, unknown>>(record.metadata),
            readBy: this.parseJsonField<string[]>(record.readBy),
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        };
    }

    async findAllRooms(): Promise<ChatRoom[]> {
        const rooms = await this.prisma.chatRoom.findMany({
            orderBy: { updatedAt: "desc" },
        });
        return rooms.map((room) => this.mapToChatRoom(room));
    }

    async findRoomById(id: string): Promise<ChatRoomWithParticipants | null> {
        const room = await this.prisma.chatRoom.findUnique({
            where: { id },
            include: { participants: true },
        });
        if (!room) return null;
        return {
            ...this.mapToChatRoom(room),
            participants: room.participants.map((p) => this.mapToParticipant(p)),
        };
    }

    async findRoomsByCustomerId(customerId: string): Promise<ChatRoom[]> {
        const rooms = await this.prisma.chatRoom.findMany({
            where: { customerId },
            orderBy: { updatedAt: "desc" },
        });
        return rooms.map((room) => this.mapToChatRoom(room));
    }

    async findRoomByInquiryId(inquiryId: string): Promise<ChatRoom | null> {
        const room = await this.prisma.chatRoom.findUnique({
            where: { inquiryId },
        });
        return room ? this.mapToChatRoom(room) : null;
    }

    async createRoom(input: CreateChatRoomInput): Promise<ChatRoom> {
        const room = await this.prisma.chatRoom.create({
            data: {
                customerId: input.customerId,
                inquiryId: input.inquiryId,
                name: input.name,
                metadata: this.stringifyJsonField(input.metadata),
            },
        });
        return this.mapToChatRoom(room);
    }

    async updateRoomStatus(id: string, status: ChatRoomStatus): Promise<ChatRoom> {
        const room = await this.prisma.chatRoom.update({
            where: { id },
            data: { status },
        });
        return this.mapToChatRoom(room);
    }

    async closeRoom(id: string): Promise<ChatRoom> {
        const room = await this.prisma.chatRoom.update({
            where: { id },
            data: {
                status: "CLOSED",
                closedAt: new Date(),
            },
        });
        return this.mapToChatRoom(room);
    }

    async findParticipantsByRoomId(chatRoomId: string): Promise<ChatParticipant[]> {
        const participants = await this.prisma.chatParticipant.findMany({
            where: { chatRoomId },
            orderBy: { joinedAt: "asc" },
        });
        return participants.map((p) => this.mapToParticipant(p));
    }

    async findParticipantById(id: string): Promise<ChatParticipant | null> {
        const participant = await this.prisma.chatParticipant.findUnique({
            where: { id },
        });
        return participant ? this.mapToParticipant(participant) : null;
    }

    async addParticipant(input: AddParticipantInput): Promise<ChatParticipant> {
        const participant = await this.prisma.chatParticipant.create({
            data: {
                chatRoomId: input.chatRoomId,
                userId: input.userId,
                name: input.name,
                role: input.role ?? "CUSTOMER",
            },
        });
        return this.mapToParticipant(participant);
    }

    async updateParticipantOnlineStatus(id: string, isOnline: boolean): Promise<ChatParticipant> {
        const participant = await this.prisma.chatParticipant.update({
            where: { id },
            data: {
                isOnline,
                lastSeenAt: isOnline ? new Date() : undefined,
            },
        });
        return this.mapToParticipant(participant);
    }

    async removeParticipant(id: string): Promise<void> {
        await this.prisma.chatParticipant.update({
            where: { id },
            data: { leftAt: new Date() },
        });
    }

    async findMessagesByRoomId(chatRoomId: string, limit = 50, before?: Date): Promise<ChatMessage[]> {
        const messages = await this.prisma.chatMessage.findMany({
            where: {
                chatRoomId,
                ...(before && { createdAt: { lt: before } }),
            },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
        return messages.map((m) => this.mapToMessage(m)).reverse();
    }

    async findMessageById(id: string): Promise<ChatMessage | null> {
        const message = await this.prisma.chatMessage.findUnique({
            where: { id },
        });
        return message ? this.mapToMessage(message) : null;
    }

    async createMessage(input: SendMessageInput): Promise<ChatMessage> {
        const message = await this.prisma.chatMessage.create({
            data: {
                chatRoomId: input.chatRoomId,
                participantId: input.participantId,
                type: input.type ?? "TEXT",
                content: input.content,
                metadata: this.stringifyJsonField(input.metadata),
            },
        });

        await this.prisma.chatRoom.update({
            where: { id: input.chatRoomId },
            data: { updatedAt: new Date() },
        });

        return this.mapToMessage(message);
    }

    async markMessagesAsRead(chatRoomId: string, participantId: string, messageIds: string[]): Promise<void> {
        for (const messageId of messageIds) {
            const message = await this.prisma.chatMessage.findUnique({
                where: { id: messageId },
            });

            if (message && message.chatRoomId === chatRoomId) {
                const currentReadBy = this.parseJsonField<string[]>(message.readBy) ?? [];
                if (!currentReadBy.includes(participantId)) {
                    currentReadBy.push(participantId);
                    await this.prisma.chatMessage.update({
                        where: { id: messageId },
                        data: { readBy: JSON.stringify(currentReadBy) },
                    });
                }
            }
        }
    }
}
