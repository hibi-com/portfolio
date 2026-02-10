import { z } from "zod";

export const chatRoomStatusSchema = z.enum(["ACTIVE", "ARCHIVED", "CLOSED"]);
export const chatParticipantRoleSchema = z.enum(["CUSTOMER", "AGENT", "OBSERVER"]);
export const chatMessageTypeSchema = z.enum(["TEXT", "IMAGE", "FILE", "SYSTEM"]);

export const chatRoomSchema = z.object({
    id: z.string().min(1),
    customerId: z.string().optional(),
    inquiryId: z.string().optional(),
    name: z.string().optional(),
    status: chatRoomStatusSchema,
    metadata: z.record(z.string(), z.unknown()).optional(),
    closedAt: z.coerce.date().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const chatParticipantSchema = z.object({
    id: z.string().min(1),
    chatRoomId: z.string().min(1),
    userId: z.string().optional(),
    name: z.string().min(1),
    role: chatParticipantRoleSchema,
    isOnline: z.boolean(),
    lastSeenAt: z.coerce.date().optional(),
    joinedAt: z.coerce.date(),
    leftAt: z.coerce.date().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const chatMessageSchema = z.object({
    id: z.string().min(1),
    chatRoomId: z.string().min(1),
    participantId: z.string().min(1),
    type: chatMessageTypeSchema,
    content: z.string().min(1),
    metadata: z.record(z.string(), z.unknown()).optional(),
    readBy: z.array(z.string()).optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const createChatRoomInputSchema = z.object({
    customerId: z.string().optional(),
    inquiryId: z.string().optional(),
    name: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});

export const addParticipantInputSchema = z.object({
    chatRoomId: z.string().min(1),
    userId: z.string().optional(),
    name: z.string().min(1),
    role: chatParticipantRoleSchema.optional(),
});

export const sendMessageInputSchema = z.object({
    chatRoomId: z.string().min(1),
    participantId: z.string().min(1),
    type: chatMessageTypeSchema.optional(),
    content: z.string().min(1),
    metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ChatRoomStatus = z.infer<typeof chatRoomStatusSchema>;
export type ChatParticipantRole = z.infer<typeof chatParticipantRoleSchema>;
export type ChatMessageType = z.infer<typeof chatMessageTypeSchema>;
export type ChatRoom = z.infer<typeof chatRoomSchema>;
export type ChatParticipant = z.infer<typeof chatParticipantSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type CreateChatRoomInput = z.infer<typeof createChatRoomInputSchema>;
export type AddParticipantInput = z.infer<typeof addParticipantInputSchema>;
export type SendMessageInput = z.infer<typeof sendMessageInputSchema>;
