import { describe, expect, test, vi } from "vitest";
import type { ChatRepository, ChatRoom } from "~/domain/chat";
import { GetChatRoomsUseCase } from "./getChatRooms";

describe("GetChatRoomsUseCase", () => {
    const mockChatRooms: ChatRoom[] = [
        {
            id: "room-1",
            customerId: "customer-1",
            inquiryId: "inquiry-1",
            status: "ACTIVE",
            closedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "room-2",
            customerId: "customer-2",
            inquiryId: null,
            status: "CLOSED",
            closedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const createMockRepository = (overrides: Partial<ChatRepository> = {}): ChatRepository => ({
        findAllRooms: vi.fn().mockResolvedValue(mockChatRooms),
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
        findMessagesByRoomId: vi.fn().mockResolvedValue([]),
        findMessageById: vi.fn().mockResolvedValue(null),
        createMessage: vi.fn().mockResolvedValue({} as any),
        markMessagesAsRead: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("全チャットルームを取得できる", async () => {
                // Given: モックリポジトリ
                const mockRepository = createMockRepository({
                    findAllRooms: vi.fn().mockResolvedValue(mockChatRooms),
                });

                const useCase = new GetChatRoomsUseCase(mockRepository);

                // When: チャットルーム一覧を取得
                const result = await useCase.execute();

                // Then: チャットルーム一覧が返される
                expect(result).toEqual(mockChatRooms);
                expect(result).toHaveLength(2);
                expect(result[0].status).toBe("ACTIVE");
                expect(result[1].status).toBe("CLOSED");
                expect(mockRepository.findAllRooms).toHaveBeenCalledTimes(1);
            });
        });

        describe("エッジケース", () => {
            test("チャットルームが存在しない場合は空配列を返す", async () => {
                // Given: チャットルームなし
                const mockRepository = createMockRepository({
                    findAllRooms: vi.fn().mockResolvedValue([]),
                });

                const useCase = new GetChatRoomsUseCase(mockRepository);

                // When: チャットルーム一覧を取得
                const result = await useCase.execute();

                // Then: 空配列が返される
                expect(result).toEqual([]);
                expect(result).toHaveLength(0);
            });
        });
    });
});
