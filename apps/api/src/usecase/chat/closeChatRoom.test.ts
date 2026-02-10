import { describe, expect, test, vi } from "vitest";
import type { ChatRepository, ChatRoom } from "~/domain/chat";
import { CloseChatRoomUseCase } from "./closeChatRoom";

describe("CloseChatRoomUseCase", () => {
    const mockChatRoom: ChatRoom = {
        id: "room-1",
        customerId: "customer-1",
        inquiryId: "inquiry-1",
        status: "CLOSED",
        closedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const createMockRepository = (overrides: Partial<ChatRepository> = {}): ChatRepository => ({
        findAllRooms: vi.fn().mockResolvedValue([]),
        findRoomById: vi.fn().mockResolvedValue(null),
        findRoomsByCustomerId: vi.fn().mockResolvedValue([]),
        findRoomByInquiryId: vi.fn().mockResolvedValue(null),
        createRoom: vi.fn().mockResolvedValue({} as any),
        updateRoomStatus: vi.fn().mockResolvedValue({} as any),
        closeRoom: vi.fn().mockResolvedValue(mockChatRoom),
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
            test("チャットルームをクローズできる", async () => {
                // Given: チャットルームID
                const roomId = "room-1";

                const mockRepository = createMockRepository({
                    closeRoom: vi.fn().mockResolvedValue(mockChatRoom),
                });

                const useCase = new CloseChatRoomUseCase(mockRepository);

                // When: チャットルームをクローズ
                const result = await useCase.execute(roomId);

                // Then: チャットルームがクローズされる
                expect(result).toEqual(mockChatRoom);
                expect(result.status).toBe("CLOSED");
                expect(result.closedAt).toBeDefined();
                expect(mockRepository.closeRoom).toHaveBeenCalledWith(roomId);
                expect(mockRepository.closeRoom).toHaveBeenCalledTimes(1);
            });
        });
    });
});
