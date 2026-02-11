import { describe, expect, test, vi } from "vitest";
import type { ChatRepository, ChatRoomWithParticipants } from "~/domain/chat";
import { GetChatRoomByIdUseCase } from "./getChatRoomById";

describe("GetChatRoomByIdUseCase", () => {
    const now = "2024-01-01T00:00:00.000Z";
    const mockChatRoom: ChatRoomWithParticipants = {
        id: "room-1",
        customerId: "customer-1",
        inquiryId: "inquiry-1",
        status: "ACTIVE",
        createdAt: now,
        updatedAt: now,
        participants: [
            {
                id: "participant-1",
                chatRoomId: "room-1",
                name: "Customer One",
                role: "CUSTOMER",
                joinedAt: now,
                isOnline: true,
                createdAt: now,
                updatedAt: now,
            },
        ],
    };

    const createMockRepository = (overrides: Partial<ChatRepository> = {}): ChatRepository => ({
        findAllRooms: vi.fn().mockResolvedValue([]),
        findRoomById: vi.fn().mockResolvedValue(mockChatRoom),
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
            test("IDでチャットルームを取得できる", async () => {
                const roomId = "room-1";

                const mockRepository = createMockRepository({
                    findRoomById: vi.fn().mockResolvedValue(mockChatRoom),
                });

                const useCase = new GetChatRoomByIdUseCase(mockRepository);

                const result = await useCase.execute(roomId);

                expect(result).toEqual(mockChatRoom);
                expect(result?.participants).toBeDefined();
                expect(result?.participants).toHaveLength(1);
                expect(mockRepository.findRoomById).toHaveBeenCalledWith(roomId);
                expect(mockRepository.findRoomById).toHaveBeenCalledTimes(1);
            });
        });

        describe("異常系", () => {
            test("存在しないIDの場合はnullを返す", async () => {
                const roomId = "non-existent";

                const mockRepository = createMockRepository({
                    findRoomById: vi.fn().mockResolvedValue(null),
                });

                const useCase = new GetChatRoomByIdUseCase(mockRepository);

                const result = await useCase.execute(roomId);

                expect(result).toBeNull();
                expect(mockRepository.findRoomById).toHaveBeenCalledWith(roomId);
            });
        });
    });
});
