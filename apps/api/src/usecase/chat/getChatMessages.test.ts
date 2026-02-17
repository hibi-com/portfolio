import type { ChatMessage, ChatRepository } from "~/domain/chat";
import { GetChatMessagesUseCase } from "./getChatMessages";

describe("GetChatMessagesUseCase", () => {
    const now = "2024-01-01T00:00:00.000Z";
    const mockMessages: ChatMessage[] = [
        {
            id: "message-1",
            chatRoomId: "room-1",
            participantId: "participant-1",
            type: "TEXT",
            content: "Hello",
            createdAt: now,
            updatedAt: now,
        },
        {
            id: "message-2",
            chatRoomId: "room-1",
            participantId: "participant-2",
            type: "TEXT",
            content: "Hi there",
            createdAt: now,
            updatedAt: now,
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
                const chatRoomId = "room-1";

                const mockRepository = createMockRepository({
                    findMessagesByRoomId: vi.fn().mockResolvedValue(mockMessages),
                });

                const useCase = new GetChatMessagesUseCase(mockRepository);

                const result = await useCase.execute(chatRoomId);

                expect(result).toEqual(mockMessages);
                expect(result).toHaveLength(2);
                expect(mockRepository.findMessagesByRoomId).toHaveBeenCalledWith(chatRoomId, undefined, undefined);
                expect(mockRepository.findMessagesByRoomId).toHaveBeenCalledTimes(1);
            });

            test("制限数を指定してメッセージを取得できる", async () => {
                const chatRoomId = "room-1";
                const limit = 10;

                const mockRepository = createMockRepository({
                    findMessagesByRoomId: vi.fn().mockResolvedValue([mockMessages[0]]),
                });

                const useCase = new GetChatMessagesUseCase(mockRepository);

                const result = await useCase.execute(chatRoomId, limit);

                expect(result).toHaveLength(1);
                expect(mockRepository.findMessagesByRoomId).toHaveBeenCalledWith(chatRoomId, limit, undefined);
            });

            test("日時を指定して過去のメッセージを取得できる", async () => {
                const chatRoomId = "room-1";
                const before = new Date();

                const mockRepository = createMockRepository({
                    findMessagesByRoomId: vi.fn().mockResolvedValue(mockMessages),
                });

                const useCase = new GetChatMessagesUseCase(mockRepository);

                const result = await useCase.execute(chatRoomId, undefined, before);

                expect(result).toEqual(mockMessages);
                expect(mockRepository.findMessagesByRoomId).toHaveBeenCalledWith(chatRoomId, undefined, before);
            });
        });

        describe("エッジケース", () => {
            test("メッセージが存在しない場合は空配列を返す", async () => {
                const chatRoomId = "room-empty";

                const mockRepository = createMockRepository({
                    findMessagesByRoomId: vi.fn().mockResolvedValue([]),
                });

                const useCase = new GetChatMessagesUseCase(mockRepository);

                const result = await useCase.execute(chatRoomId);

                expect(result).toEqual([]);
                expect(result).toHaveLength(0);
            });
        });
    });
});
