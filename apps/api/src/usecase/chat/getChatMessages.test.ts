import { describe, expect, test, vi } from "vitest";
import type { ChatMessage, ChatRepository } from "~/domain/chat";
import { GetChatMessagesUseCase } from "./getChatMessages";

describe("GetChatMessagesUseCase", () => {
    const mockMessages: ChatMessage[] = [
        {
            id: "message-1",
            chatRoomId: "room-1",
            chatParticipantId: "participant-1",
            type: "TEXT",
            content: "Hello",
            isRead: true,
            readAt: new Date(),
            createdAt: new Date(),
        },
        {
            id: "message-2",
            chatRoomId: "room-1",
            chatParticipantId: "participant-2",
            type: "TEXT",
            content: "Hi there",
            isRead: false,
            readAt: null,
            createdAt: new Date(),
        },
    ];

    const createMockRepository = (overrides: Partial<ChatRepository> = {}): ChatRepository => ({
        findAllRooms: vi.fn().mockResolvedValue([]),
        findRoomById: vi.fn().mockResolvedValue(null),
        findRoomsByCustomerId: vi.fn().mockResolvedValue([]),
        findRoomByInquiryId: vi.fn().mockResolvedValue(null),
        createRoom: vi.fn().mockResolvedValue({} as any),
        updateRoomStatus: vi.fn().mockResolvedValue({} as any),
        closeRoom: vi.fn().mockResolvedValue({} as any),
        findParticipantsByRoomId: vi.fn().mockResolvedValue([]),
        findParticipantById: vi.fn().mockResolvedValue(null),
        addParticipant: vi.fn().mockResolvedValue({} as any),
        updateParticipantOnlineStatus: vi.fn().mockResolvedValue({} as any),
        removeParticipant: vi.fn().mockResolvedValue(undefined),
        findMessagesByRoomId: vi.fn().mockResolvedValue(mockMessages),
        findMessageById: vi.fn().mockResolvedValue(null),
        createMessage: vi.fn().mockResolvedValue({} as any),
        markMessagesAsRead: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("チャットルームのメッセージ一覧を取得できる", async () => {
                // Given: チャットルームID
                const chatRoomId = "room-1";

                const mockRepository = createMockRepository({
                    findMessagesByRoomId: vi.fn().mockResolvedValue(mockMessages),
                });

                const useCase = new GetChatMessagesUseCase(mockRepository);

                // When: メッセージを取得
                const result = await useCase.execute(chatRoomId);

                // Then: メッセージ一覧が返される
                expect(result).toEqual(mockMessages);
                expect(result).toHaveLength(2);
                expect(mockRepository.findMessagesByRoomId).toHaveBeenCalledWith(
                    chatRoomId,
                    undefined,
                    undefined,
                );
                expect(mockRepository.findMessagesByRoomId).toHaveBeenCalledTimes(1);
            });

            test("制限数を指定してメッセージを取得できる", async () => {
                // Given: チャットルームIDと制限数
                const chatRoomId = "room-1";
                const limit = 10;

                const mockRepository = createMockRepository({
                    findMessagesByRoomId: vi.fn().mockResolvedValue([mockMessages[0]]),
                });

                const useCase = new GetChatMessagesUseCase(mockRepository);

                // When: 制限数を指定してメッセージを取得
                const result = await useCase.execute(chatRoomId, limit);

                // Then: 指定数のメッセージが返される
                expect(result).toHaveLength(1);
                expect(mockRepository.findMessagesByRoomId).toHaveBeenCalledWith(
                    chatRoomId,
                    limit,
                    undefined,
                );
            });

            test("日時を指定して過去のメッセージを取得できる", async () => {
                // Given: チャットルームIDと基準日時
                const chatRoomId = "room-1";
                const before = new Date();

                const mockRepository = createMockRepository({
                    findMessagesByRoomId: vi.fn().mockResolvedValue(mockMessages),
                });

                const useCase = new GetChatMessagesUseCase(mockRepository);

                // When: 基準日時より前のメッセージを取得
                const result = await useCase.execute(chatRoomId, undefined, before);

                // Then: メッセージが返される
                expect(result).toEqual(mockMessages);
                expect(mockRepository.findMessagesByRoomId).toHaveBeenCalledWith(
                    chatRoomId,
                    undefined,
                    before,
                );
            });
        });

        describe("エッジケース", () => {
            test("メッセージが存在しない場合は空配列を返す", async () => {
                // Given: メッセージのないチャットルーム
                const chatRoomId = "room-empty";

                const mockRepository = createMockRepository({
                    findMessagesByRoomId: vi.fn().mockResolvedValue([]),
                });

                const useCase = new GetChatMessagesUseCase(mockRepository);

                // When: メッセージを取得
                const result = await useCase.execute(chatRoomId);

                // Then: 空配列が返される
                expect(result).toEqual([]);
                expect(result).toHaveLength(0);
            });
        });
    });
});
