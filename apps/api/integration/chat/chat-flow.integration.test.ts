import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import type { DIContainer } from "~/di/container";
import { createTestContainer } from "../setup/container.setup";
import { clearTestDb, seedTestData, setupTestDb, teardownTestDb } from "../setup/db.setup";

describe("Chat Flow Integration", () => {
    let container: DIContainer;

    beforeAll(async () => {
        await setupTestDb();
        container = createTestContainer();
    });

    afterEach(async () => {
        await clearTestDb();
    });

    afterAll(async () => {
        await teardownTestDb();
    });

    describe("POST /api/chat/rooms - チャットルーム作成", () => {
        test("正常系: チャットルームを作成する", async () => {
            await seedTestData({
                customers: [{ id: "cust-1", name: "Test Customer" }],
            });

            const useCase = container.getCreateChatRoomUseCase();
            const result = await useCase.execute({
                customerId: "cust-1",
            });

            expect(result).toBeDefined();
            expect(result.id).toBeDefined();
            expect(result.status).toBe("ACTIVE");
        });

        test("正常系: 顧客IDなしでチャットルームを作成する", async () => {
            const useCase = container.getCreateChatRoomUseCase();
            const result = await useCase.execute({});

            expect(result).toBeDefined();
            expect(result.customerId).toBeNull();
        });
    });

    describe("GET /api/chat/rooms - チャットルーム一覧取得", () => {
        test("正常系: チャットルーム一覧を取得する", async () => {
            const createUseCase = container.getCreateChatRoomUseCase();
            await createUseCase.execute({});
            await createUseCase.execute({});
            const useCase = container.getGetChatRoomsUseCase();
            const result = await useCase.execute();

            expect(result).toHaveLength(2);
        });
    });

    describe("POST /api/chat/rooms/:id/messages - メッセージ送信", () => {
        test("正常系: メッセージを送信する", async () => {
            const createRoomUseCase = container.getCreateChatRoomUseCase();
            const room = await createRoomUseCase.execute({});

            const addParticipantUseCase = container.getAddChatParticipantUseCase();
            const participant = await addParticipantUseCase.execute({
                chatRoomId: room.id,
                name: "Test Agent",
                role: "AGENT",
            });

            const sendMessageUseCase = container.getSendChatMessageUseCase();
            const message = await sendMessageUseCase.execute({
                chatRoomId: room.id,
                participantId: participant.id,
                type: "TEXT",
                content: "Hello, this is a test message.",
            });

            expect(message).toBeDefined();
            expect(message.content).toBe("Hello, this is a test message.");
            expect(message.type).toBe("TEXT");
        });
    });

    describe("GET /api/chat/rooms/:id/messages - メッセージ一覧取得", () => {
        test("正常系: メッセージ一覧を取得する", async () => {
            const createRoomUseCase = container.getCreateChatRoomUseCase();
            const room = await createRoomUseCase.execute({});

            const addParticipantUseCase = container.getAddChatParticipantUseCase();
            const participant = await addParticipantUseCase.execute({
                chatRoomId: room.id,
                name: "Test Agent",
                role: "AGENT",
            });

            const sendMessageUseCase = container.getSendChatMessageUseCase();
            await sendMessageUseCase.execute({
                chatRoomId: room.id,
                participantId: participant.id,
                type: "TEXT",
                content: "Message 1",
            });
            await sendMessageUseCase.execute({
                chatRoomId: room.id,
                participantId: participant.id,
                type: "TEXT",
                content: "Message 2",
            });

            const getMessagesUseCase = container.getGetChatMessagesUseCase();
            const messages = await getMessagesUseCase.execute(room.id);

            expect(messages).toHaveLength(2);
        });
    });

    describe("POST /api/chat/rooms/:id/close - チャットルームクローズ", () => {
        test("正常系: チャットルームをクローズする", async () => {
            const createRoomUseCase = container.getCreateChatRoomUseCase();
            const room = await createRoomUseCase.execute({});

            const closeUseCase = container.getCloseChatRoomUseCase();
            const result = await closeUseCase.execute(room.id);

            expect(result).toBeDefined();
            expect(result.status).toBe("CLOSED");
        });
    });
});
