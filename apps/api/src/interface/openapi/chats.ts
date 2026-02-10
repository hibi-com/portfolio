import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { AppError, ErrorCodes } from "@portfolio/log";
import type { Handler } from "hono";
import { DIContainer } from "~/di/container";
import { getLogger, getMetrics } from "~/lib/logger";
import { isValidUuid } from "~/lib/validation";

type Env = {
	DATABASE_URL: string;
	CACHE_URL: string;
};

const app = new OpenAPIHono<{ Bindings: Env }>();

// Schemas
const ChatRoomStatusSchema = z.enum(["ACTIVE", "ARCHIVED", "CLOSED"]).openapi("ChatRoomStatus");
const ChatParticipantRoleSchema = z.enum(["OWNER", "ADMIN", "MEMBER", "GUEST"]).openapi("ChatParticipantRole");
const ChatMessageTypeSchema = z.enum(["TEXT", "IMAGE", "FILE", "SYSTEM"]).openapi("ChatMessageType");

const ChatParticipantSchema = z.object({
	id: z.string().uuid(),
	chatRoomId: z.string().uuid(),
	userId: z.string().uuid().optional(),
	name: z.string(),
	role: ChatParticipantRoleSchema,
	joinedAt: z.string().datetime(),
	leftAt: z.string().datetime().optional(),
}).openapi("ChatParticipant");

const ChatRoomSchema = z.object({
	id: z.string().uuid(),
	customerId: z.string().uuid().optional(),
	inquiryId: z.string().uuid().optional(),
	name: z.string().optional(),
	status: ChatRoomStatusSchema,
	metadata: z.record(z.string(), z.unknown()).optional(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
}).openapi("ChatRoom");

const ChatRoomWithParticipantsSchema = ChatRoomSchema.extend({
	participants: z.array(ChatParticipantSchema),
}).openapi("ChatRoomWithParticipants");

const ChatMessageSchema = z.object({
	id: z.string().uuid(),
	chatRoomId: z.string().uuid(),
	participantId: z.string().uuid(),
	type: ChatMessageTypeSchema,
	content: z.string(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
}).openapi("ChatMessage");

const CreateChatRoomInputSchema = z.object({
	customerId: z.string().uuid().optional(),
	inquiryId: z.string().uuid().optional(),
	name: z.string().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
}).openapi("CreateChatRoomInput");

const AddParticipantInputSchema = z.object({
	userId: z.string().uuid().optional(),
	name: z.string(),
	role: ChatParticipantRoleSchema.optional(),
}).openapi("AddParticipantInput");

const SendMessageInputSchema = z.object({
	participantId: z.string().uuid(),
	type: ChatMessageTypeSchema.optional(),
	content: z.string(),
	metadata: z.record(z.string(), z.unknown()).optional(),
}).openapi("SendMessageInput");

const ErrorResponseSchema = z.object({
	error: z.string(),
	details: z.unknown().optional(),
}).openapi("ErrorResponse");

const IdParamSchema = z.object({
	id: z.string().uuid().openapi({ description: "Chat Room ID" }),
});

// Routes
const listRoomsRoute = createRoute({
	method: "get",
	path: "/rooms",
	tags: ["Chat"],
	summary: "List all chat rooms",
	responses: {
		200: { content: { "application/json": { schema: z.array(ChatRoomSchema) } }, description: "List of chat rooms" },
	},
});

const getRoomRoute = createRoute({
	method: "get",
	path: "/rooms/{id}",
	tags: ["Chat"],
	summary: "Get a chat room by ID",
	request: { params: IdParamSchema },
	responses: {
		200: { content: { "application/json": { schema: ChatRoomWithParticipantsSchema } }, description: "Chat room details" },
		404: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Not found" },
	},
});

const createRoomRoute = createRoute({
	method: "post",
	path: "/rooms",
	tags: ["Chat"],
	summary: "Create a new chat room",
	request: { body: { content: { "application/json": { schema: CreateChatRoomInputSchema } } } },
	responses: {
		201: { content: { "application/json": { schema: ChatRoomSchema } }, description: "Chat room created" },
		400: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Validation error" },
	},
});

const closeRoomRoute = createRoute({
	method: "post",
	path: "/rooms/{id}/close",
	tags: ["Chat"],
	summary: "Close a chat room",
	request: { params: IdParamSchema },
	responses: {
		200: { content: { "application/json": { schema: ChatRoomSchema } }, description: "Chat room closed" },
		404: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Not found" },
	},
});

const addParticipantRoute = createRoute({
	method: "post",
	path: "/rooms/{id}/participants",
	tags: ["Chat"],
	summary: "Add a participant to a chat room",
	request: {
		params: IdParamSchema,
		body: { content: { "application/json": { schema: AddParticipantInputSchema } } },
	},
	responses: {
		201: { content: { "application/json": { schema: ChatParticipantSchema } }, description: "Participant added" },
		400: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Validation error" },
	},
});

const getMessagesRoute = createRoute({
	method: "get",
	path: "/rooms/{id}/messages",
	tags: ["Chat"],
	summary: "Get messages from a chat room",
	request: { params: IdParamSchema },
	responses: {
		200: { content: { "application/json": { schema: z.array(ChatMessageSchema) } }, description: "List of messages" },
		404: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Not found" },
	},
});

const sendMessageRoute = createRoute({
	method: "post",
	path: "/rooms/{id}/messages",
	tags: ["Chat"],
	summary: "Send a message to a chat room",
	request: {
		params: IdParamSchema,
		body: { content: { "application/json": { schema: SendMessageInputSchema } } },
	},
	responses: {
		201: { content: { "application/json": { schema: ChatMessageSchema } }, description: "Message sent" },
		400: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Validation error" },
	},
});

// Handlers
const listRoomsHandler: Handler<{ Bindings: Env }> = async (c) => {
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getGetChatRoomsUseCase();
		const rooms = await useCase.execute();

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "GET", route: "/api/chat/rooms", status: "200" }, duration);

		return c.json(rooms, 200);
	} catch (error) {
		const logger = getLogger();
		const appError = error instanceof AppError ? error : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch chat rooms", { originalError: error instanceof Error ? error : new Error(String(error)) });
		logger.logError(appError, { route: "/api/chat/rooms", method: "GET" });
		return c.json({ error: appError.message }, 500);
	}
};

const getRoomHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	if (!isValidUuid(id)) return c.json({ error: "Invalid chat room ID format" }, 400);

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getGetChatRoomByIdUseCase();
		const room = await useCase.execute(id);
		if (!room) return c.json({ error: "Chat room not found" }, 404);
		return c.json(room, 200);
	} catch (error) {
		const logger = getLogger();
		const appError = error instanceof AppError ? error : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch chat room", { originalError: error instanceof Error ? error : new Error(String(error)) });
		logger.logError(appError, { route: "/api/chat/rooms/:id", method: "GET", id });
		return c.json({ error: appError.message }, 500);
	}
};

const createRoomHandler: Handler<{ Bindings: Env }> = async (c) => {
	try {
		const body = await c.req.json();
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getCreateChatRoomUseCase();
		const room = await useCase.execute(body);
		return c.json(room, 201);
	} catch (error) {
		const logger = getLogger();
		const appError = error instanceof AppError ? error : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to create chat room", { originalError: error instanceof Error ? error : new Error(String(error)) });
		logger.logError(appError, { route: "/api/chat/rooms", method: "POST" });
		return c.json({ error: appError.message }, 400);
	}
};

const closeRoomHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	if (!isValidUuid(id)) return c.json({ error: "Invalid chat room ID format" }, 400);

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getCloseChatRoomUseCase();
		const room = await useCase.execute(id);
		return c.json(room, 200);
	} catch (error) {
		const logger = getLogger();
		const appError = error instanceof AppError ? error : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to close chat room", { originalError: error instanceof Error ? error : new Error(String(error)) });
		logger.logError(appError, { route: "/api/chat/rooms/:id/close", method: "POST", id });
		return c.json({ error: appError.message }, 400);
	}
};

const addParticipantHandler: Handler<{ Bindings: Env }> = async (c) => {
	const chatRoomId = c.req.param("id");
	if (!isValidUuid(chatRoomId)) return c.json({ error: "Invalid chat room ID format" }, 400);

	try {
		const body = await c.req.json();
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getAddChatParticipantUseCase();
		const participant = await useCase.execute({ chatRoomId, ...body });
		return c.json(participant, 201);
	} catch (error) {
		const logger = getLogger();
		const appError = error instanceof AppError ? error : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to add participant", { originalError: error instanceof Error ? error : new Error(String(error)) });
		logger.logError(appError, { route: "/api/chat/rooms/:id/participants", method: "POST", chatRoomId });
		return c.json({ error: appError.message }, 400);
	}
};

const getMessagesHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	if (!isValidUuid(id)) return c.json({ error: "Invalid chat room ID format" }, 400);

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getGetChatMessagesUseCase();
		const messages = await useCase.execute(id);
		return c.json(messages, 200);
	} catch (error) {
		const logger = getLogger();
		const appError = error instanceof AppError ? error : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch messages", { originalError: error instanceof Error ? error : new Error(String(error)) });
		logger.logError(appError, { route: "/api/chat/rooms/:id/messages", method: "GET", id });
		return c.json({ error: appError.message }, 500);
	}
};

const sendMessageHandler: Handler<{ Bindings: Env }> = async (c) => {
	const chatRoomId = c.req.param("id");
	if (!isValidUuid(chatRoomId)) return c.json({ error: "Invalid chat room ID format" }, 400);

	try {
		const body = await c.req.json();
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getSendChatMessageUseCase();
		const message = await useCase.execute({ chatRoomId, ...body });
		return c.json(message, 201);
	} catch (error) {
		const logger = getLogger();
		const appError = error instanceof AppError ? error : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to send message", { originalError: error instanceof Error ? error : new Error(String(error)) });
		logger.logError(appError, { route: "/api/chat/rooms/:id/messages", method: "POST", chatRoomId });
		return c.json({ error: appError.message }, 400);
	}
};

// Register routes
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(listRoomsRoute, listRoomsHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(getRoomRoute, getRoomHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(createRoomRoute, createRoomHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(closeRoomRoute, closeRoomHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(addParticipantRoute, addParticipantHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(getMessagesRoute, getMessagesHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(sendMessageRoute, sendMessageHandler as any);

export { app as chatsRouter };
