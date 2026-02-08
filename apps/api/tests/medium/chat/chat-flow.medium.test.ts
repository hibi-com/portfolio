/**
 * @sequence docs/sequence/api/chat/chat-room-create.md
 * @description チャットフローの統合テスト
 *
 * シーケンス図に基づき、以下のフローを検証:
 * Client → API → DIContainer → UseCase → Repository → DB
 */

import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { clearTestDb, seedTestData, setupTestDb, teardownTestDb } from "../setup/db.setup";
import { createTestContainer } from "../setup/container.setup";
import type { DIContainer } from "../../../src/di/container";

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
            // Given: 顧客が存在する
            await seedTestData({
                customers: [{ id: "cust-1", name: "Test Customer" }],
            });

            // When: CreateChatRoomUseCase を実行
            const useCase = container.getCreateChatRoomUseCase();
            const result = await useCase.execute({
                customerId: "cust-1",
            });

            // Then: チャットルームが作成される
            expect(result).toBeDefined();
            expect(result.id).toBeDefined();
            expect(result.status).toBe("ACTIVE");
        });

        test("正常系: 顧客IDなしでチャットルームを作成する", async () => {
            // When: 顧客IDなしで CreateChatRoomUseCase を実行
            const useCase = container.getCreateChatRoomUseCase();
            const result = await useCase.execute({});

            // Then: チャットルームが作成される
            expect(result).toBeDefined();
            expect(result.customerId).toBeNull();
        });
    });

    describe("GET /api/chat/rooms - チャットルーム一覧取得", () => {
        test("正常系: チャットルーム一覧を取得する", async () => {
            // Given: チャットルームが存在する
            // Note: シードデータでチャットルームを直接作成する機能は未実装
            // UseCase経由で作成
            const createUseCase = container.getCreateChatRoomUseCase();
            await createUseCase.execute({});
            await createUseCase.execute({});

            // When: GetChatRoomsUseCase を実行
            const useCase = container.getGetChatRoomsUseCase();
            const result = await useCase.execute();

            // Then: チャットルーム一覧がレスポンスされる
            expect(result).toHaveLength(2);
        });
    });

    describe("POST /api/chat/rooms/:id/messages - メッセージ送信", () => {
        test("正常系: メッセージを送信する", async () => {
            // Given: チャットルームと参加者が存在する
            const createRoomUseCase = container.getCreateChatRoomUseCase();
            const room = await createRoomUseCase.execute({});

            // 参加者を追加
            const addParticipantUseCase = container.getAddChatParticipantUseCase();
            const participant = await addParticipantUseCase.execute(room.id, {
                role: "AGENT",
            });

            // When: SendChatMessageUseCase を実行
            const sendMessageUseCase = container.getSendChatMessageUseCase();
            const message = await sendMessageUseCase.execute(room.id, {
                participantId: participant.id,
                type: "TEXT",
                content: "Hello, this is a test message.",
            });

            // Then: メッセージが送信される
            expect(message).toBeDefined();
            expect(message.content).toBe("Hello, this is a test message.");
            expect(message.type).toBe("TEXT");
        });
    });

    describe("GET /api/chat/rooms/:id/messages - メッセージ一覧取得", () => {
        test("正常系: メッセージ一覧を取得する", async () => {
            // Given: チャットルームとメッセージが存在する
            const createRoomUseCase = container.getCreateChatRoomUseCase();
            const room = await createRoomUseCase.execute({});

            const addParticipantUseCase = container.getAddChatParticipantUseCase();
            const participant = await addParticipantUseCase.execute(room.id, { role: "AGENT" });

            const sendMessageUseCase = container.getSendChatMessageUseCase();
            await sendMessageUseCase.execute(room.id, {
                participantId: participant.id,
                type: "TEXT",
                content: "Message 1",
            });
            await sendMessageUseCase.execute(room.id, {
                participantId: participant.id,
                type: "TEXT",
                content: "Message 2",
            });

            // When: GetChatMessagesUseCase を実行
            const getMessagesUseCase = container.getGetChatMessagesUseCase();
            const messages = await getMessagesUseCase.execute(room.id);

            // Then: メッセージ一覧がレスポンスされる
            expect(messages).toHaveLength(2);
        });
    });

    describe("POST /api/chat/rooms/:id/close - チャットルームクローズ", () => {
        test("正常系: チャットルームをクローズする", async () => {
            // Given: アクティブなチャットルームが存在する
            const createRoomUseCase = container.getCreateChatRoomUseCase();
            const room = await createRoomUseCase.execute({});

            // When: CloseChatRoomUseCase を実行
            const closeUseCase = container.getCloseChatRoomUseCase();
            const result = await closeUseCase.execute(room.id);

            // Then: ステータスがCLOSEDになる
            expect(result).toBeDefined();
            expect(result.status).toBe("CLOSED");
        });
    });
});
