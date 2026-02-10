import { describe, expect, test } from "vitest";
import {
	addParticipantInputSchema,
	chatMessageSchema,
	chatMessageTypeSchema,
	chatParticipantRoleSchema,
	chatParticipantSchema,
	chatRoomSchema,
	chatRoomStatusSchema,
	createChatRoomInputSchema,
	sendMessageInputSchema,
} from "./chat";

describe("Chat Zod Schemas", () => {
	describe("chatRoomStatusSchema", () => {
		test("should validate valid status values", () => {
			expect(chatRoomStatusSchema.safeParse("ACTIVE").success).toBe(true);
			expect(chatRoomStatusSchema.safeParse("ARCHIVED").success).toBe(true);
			expect(chatRoomStatusSchema.safeParse("CLOSED").success).toBe(true);
		});

		test("should reject invalid status", () => {
			expect(chatRoomStatusSchema.safeParse("UNKNOWN").success).toBe(false);
		});
	});

	describe("chatParticipantRoleSchema", () => {
		test("should validate valid role values", () => {
			expect(chatParticipantRoleSchema.safeParse("CUSTOMER").success).toBe(true);
			expect(chatParticipantRoleSchema.safeParse("AGENT").success).toBe(true);
			expect(chatParticipantRoleSchema.safeParse("OBSERVER").success).toBe(true);
		});

		test("should reject invalid role", () => {
			expect(chatParticipantRoleSchema.safeParse("ADMIN").success).toBe(false);
		});
	});

	describe("chatMessageTypeSchema", () => {
		test("should validate valid type values", () => {
			expect(chatMessageTypeSchema.safeParse("TEXT").success).toBe(true);
			expect(chatMessageTypeSchema.safeParse("IMAGE").success).toBe(true);
			expect(chatMessageTypeSchema.safeParse("FILE").success).toBe(true);
			expect(chatMessageTypeSchema.safeParse("SYSTEM").success).toBe(true);
		});

		test("should reject invalid type", () => {
			expect(chatMessageTypeSchema.safeParse("VIDEO").success).toBe(false);
		});
	});

	describe("chatRoomSchema", () => {
		test("should validate complete chat room", () => {
			const result = chatRoomSchema.safeParse({
				id: "room-123",
				customerId: "cust-123",
				inquiryId: "inq-456",
				name: "Support Chat",
				status: "ACTIVE",
				metadata: { channel: "web" },
				closedAt: "2024-06-01T00:00:00Z",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should validate chat room with minimum required fields", () => {
			const result = chatRoomSchema.safeParse({
				id: "room-123",
				status: "ACTIVE",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should reject chat room without id", () => {
			const result = chatRoomSchema.safeParse({
				status: "ACTIVE",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("chatParticipantSchema", () => {
		test("should validate complete participant", () => {
			const result = chatParticipantSchema.safeParse({
				id: "part-123",
				chatRoomId: "room-123",
				userId: "user-456",
				name: "John Doe",
				role: "CUSTOMER",
				isOnline: true,
				lastSeenAt: "2024-01-01T12:00:00Z",
				joinedAt: "2024-01-01T00:00:00Z",
				leftAt: "2024-01-01T13:00:00Z",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should validate participant with minimum required fields", () => {
			const result = chatParticipantSchema.safeParse({
				id: "part-123",
				chatRoomId: "room-123",
				name: "John",
				role: "AGENT",
				isOnline: false,
				joinedAt: "2024-01-01T00:00:00Z",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should reject participant without name", () => {
			const result = chatParticipantSchema.safeParse({
				id: "part-123",
				chatRoomId: "room-123",
				role: "AGENT",
				isOnline: false,
				joinedAt: "2024-01-01T00:00:00Z",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("chatMessageSchema", () => {
		test("should validate complete message", () => {
			const result = chatMessageSchema.safeParse({
				id: "msg-123",
				chatRoomId: "room-123",
				participantId: "part-456",
				type: "TEXT",
				content: "Hello, how can I help?",
				metadata: { originalLang: "en" },
				readBy: ["part-789"],
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should validate message with minimum required fields", () => {
			const result = chatMessageSchema.safeParse({
				id: "msg-123",
				chatRoomId: "room-123",
				participantId: "part-456",
				type: "TEXT",
				content: "Hi",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should validate system message", () => {
			const result = chatMessageSchema.safeParse({
				id: "msg-123",
				chatRoomId: "room-123",
				participantId: "system",
				type: "SYSTEM",
				content: "User joined the chat",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should reject message without content", () => {
			const result = chatMessageSchema.safeParse({
				id: "msg-123",
				chatRoomId: "room-123",
				participantId: "part-456",
				type: "TEXT",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("createChatRoomInputSchema", () => {
		test("should validate create input with all fields", () => {
			const result = createChatRoomInputSchema.safeParse({
				customerId: "cust-123",
				inquiryId: "inq-456",
				name: "New Chat",
				metadata: { source: "widget" },
			});
			expect(result.success).toBe(true);
		});

		test("should validate create input with empty object", () => {
			const result = createChatRoomInputSchema.safeParse({});
			expect(result.success).toBe(true);
		});
	});

	describe("addParticipantInputSchema", () => {
		test("should validate add participant input with all fields", () => {
			const result = addParticipantInputSchema.safeParse({
				chatRoomId: "room-123",
				userId: "user-456",
				name: "Jane Doe",
				role: "AGENT",
			});
			expect(result.success).toBe(true);
		});

		test("should validate add participant input with minimum fields", () => {
			const result = addParticipantInputSchema.safeParse({
				chatRoomId: "room-123",
				name: "Guest",
			});
			expect(result.success).toBe(true);
		});

		test("should reject add participant without chatRoomId", () => {
			const result = addParticipantInputSchema.safeParse({
				name: "Guest",
			});
			expect(result.success).toBe(false);
		});

		test("should reject add participant without name", () => {
			const result = addParticipantInputSchema.safeParse({
				chatRoomId: "room-123",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("sendMessageInputSchema", () => {
		test("should validate send message input with all fields", () => {
			const result = sendMessageInputSchema.safeParse({
				chatRoomId: "room-123",
				participantId: "part-456",
				type: "TEXT",
				content: "Hello!",
				metadata: { attachmentUrl: "https://example.com/file.pdf" },
			});
			expect(result.success).toBe(true);
		});

		test("should validate send message input with minimum fields", () => {
			const result = sendMessageInputSchema.safeParse({
				chatRoomId: "room-123",
				participantId: "part-456",
				content: "Hi",
			});
			expect(result.success).toBe(true);
		});

		test("should reject send message without chatRoomId", () => {
			const result = sendMessageInputSchema.safeParse({
				participantId: "part-456",
				content: "Hi",
			});
			expect(result.success).toBe(false);
		});

		test("should reject send message without participantId", () => {
			const result = sendMessageInputSchema.safeParse({
				chatRoomId: "room-123",
				content: "Hi",
			});
			expect(result.success).toBe(false);
		});

		test("should reject send message without content", () => {
			const result = sendMessageInputSchema.safeParse({
				chatRoomId: "room-123",
				participantId: "part-456",
			});
			expect(result.success).toBe(false);
		});
	});
});
