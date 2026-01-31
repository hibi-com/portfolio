import type { DurableObjectNamespace } from "@cloudflare/workers-types";
import { AppError, ErrorCodes } from "@portfolio/log";
import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import { DIContainer } from "~/di/container";
import { getLogger, getMetrics } from "~/lib/logger";
import { isValidUuid } from "~/lib/validation";

export async function getChatRooms(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetChatRoomsUseCase();
        const rooms = await useCase.execute();

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/chat/rooms", status: "200" }, duration);
        metrics.httpRequestTotal.inc({ method: "GET", route: "/api/chat/rooms", status: "200" });

        return c.json(rooms);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch chat rooms", {
                      metadata: { route: "/api/chat/rooms" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/chat/rooms", method: "GET" });
        metrics.httpRequestErrors.inc({
            method: "GET",
            route: "/api/chat/rooms",
            status: String(appError.httpStatus),
        });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getChatRoomById(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid chat room ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetChatRoomByIdUseCase();
        const room = await useCase.execute(id);

        if (!room) {
            const notFoundError = AppError.fromCode(ErrorCodes.NOT_FOUND_RESOURCE, "Chat room not found", {
                metadata: { id },
            });
            return c.json(notFoundError.toJSON(), notFoundError.httpStatus as StatusCode);
        }

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/chat/rooms/:id", status: "200" }, duration);

        return c.json(room);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch chat room", {
                      metadata: { route: "/api/chat/rooms/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/chat/rooms/:id", method: "GET", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function createChatRoom(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const body = await c.req.json();

        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getCreateChatRoomUseCase();
        const room = await useCase.execute(body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "POST", route: "/api/chat/rooms", status: "201" }, duration);

        return c.json(room, 201);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to create chat room", {
                      metadata: { route: "/api/chat/rooms" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/chat/rooms", method: "POST" });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function closeChatRoom(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid chat room ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getCloseChatRoomUseCase();
        const room = await useCase.execute(id);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "POST", route: "/api/chat/rooms/:id/close", status: "200" },
            duration,
        );

        return c.json(room);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to close chat room", {
                      metadata: { route: "/api/chat/rooms/:id/close", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/chat/rooms/:id/close", method: "POST", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function addChatParticipant(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const chatRoomId = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!chatRoomId || !isValidUuid(chatRoomId)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid chat room ID format", {
            metadata: { field: "id", receivedValue: chatRoomId },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const body = await c.req.json();

        if (!body.name) {
            const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Name is required", {
                metadata: { field: "name" },
            });
            return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
        }

        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getAddChatParticipantUseCase();
        const participant = await useCase.execute({
            chatRoomId,
            ...body,
        });

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "POST", route: "/api/chat/rooms/:id/participants", status: "201" },
            duration,
        );

        return c.json(participant, 201);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to add participant", {
                      metadata: { route: "/api/chat/rooms/:id/participants", chatRoomId },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/chat/rooms/:id/participants", method: "POST", chatRoomId });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getChatMessages(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const chatRoomId = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!chatRoomId || !isValidUuid(chatRoomId)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid chat room ID format", {
            metadata: { field: "id", receivedValue: chatRoomId },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const limit = c.req.query("limit") ? Number.parseInt(c.req.query("limit") as string, 10) : undefined;
        const before = c.req.query("before") ? new Date(c.req.query("before") as string) : undefined;

        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetChatMessagesUseCase();
        const messages = await useCase.execute(chatRoomId, limit, before);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "GET", route: "/api/chat/rooms/:id/messages", status: "200" },
            duration,
        );

        return c.json(messages);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch messages", {
                      metadata: { route: "/api/chat/rooms/:id/messages", chatRoomId },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/chat/rooms/:id/messages", method: "GET", chatRoomId });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function sendChatMessage(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const chatRoomId = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!chatRoomId || !isValidUuid(chatRoomId)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid chat room ID format", {
            metadata: { field: "id", receivedValue: chatRoomId },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const body = await c.req.json();

        if (!body.participantId || !body.content) {
            const validationError = AppError.fromCode(
                ErrorCodes.VALIDATION_MISSING_FIELD,
                "participantId and content are required",
                {
                    metadata: { fields: ["participantId", "content"] },
                },
            );
            return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
        }

        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getSendChatMessageUseCase();
        const message = await useCase.execute({
            chatRoomId,
            ...body,
        });

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "POST", route: "/api/chat/rooms/:id/messages", status: "201" },
            duration,
        );

        return c.json(message, 201);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to send message", {
                      metadata: { route: "/api/chat/rooms/:id/messages", chatRoomId },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/chat/rooms/:id/messages", method: "POST", chatRoomId });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function handleChatWebSocket(c: Context): Promise<Response> {
    const chatRooms = c.env.CHAT_ROOMS as DurableObjectNamespace | undefined;
    const roomId = c.req.param("id");

    if (!roomId || !isValidUuid(roomId)) {
        return c.json({ error: "Invalid room ID" }, 400) as unknown as Response;
    }

    if (!chatRooms) {
        return c.json({ error: "Chat service not available" }, 503) as unknown as Response;
    }

    const id = chatRooms.idFromName(roomId);
    const stub = chatRooms.get(id);

    const url = new URL(c.req.url);
    url.pathname = "/websocket";

    const response = await stub.fetch(url.toString(), {
        headers: c.req.raw.headers,
    });

    return response as unknown as Response;
}
