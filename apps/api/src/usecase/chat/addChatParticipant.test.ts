import type { AddParticipantInput, ChatParticipant, ChatRepository } from "~/domain/chat";
import { AddChatParticipantUseCase } from "./addChatParticipant";

describe("AddChatParticipantUseCase", () => {
    const now = "2024-01-01T00:00:00.000Z";
    const mockParticipant: ChatParticipant = {
        id: "participant-1",
        chatRoomId: "room-1",
        name: "Customer One",
        role: "CUSTOMER",
        joinedAt: now,
        isOnline: true,
        createdAt: now,
        updatedAt: now,
    };

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
        addParticipant: vi.fn().mockResolvedValue(mockParticipant),
        updateParticipantOnlineStatus: vi.fn().mockResolvedValue(mockParticipant),
        removeParticipant: vi.fn().mockResolvedValue(undefined),
        findMessagesByRoomId: vi.fn().mockResolvedValue([]),
        findMessageById: vi.fn().mockResolvedValue(null),
        createMessage: vi.fn().mockResolvedValue({} as any),
        markMessagesAsRead: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("顧客をチャットルームに追加できる", async () => {
                const input: AddParticipantInput = {
                    chatRoomId: "room-1",
                    name: "Customer One",
                    role: "CUSTOMER",
                };

                const mockRepository = createMockRepository({
                    addParticipant: vi.fn().mockResolvedValue(mockParticipant),
                });

                const useCase = new AddChatParticipantUseCase(mockRepository);

                const result = await useCase.execute(input);

                expect(result).toEqual(mockParticipant);
                expect(mockRepository.addParticipant).toHaveBeenCalledWith(input);
                expect(mockRepository.addParticipant).toHaveBeenCalledTimes(1);
            });

            test("管理者をチャットルームに追加できる", async () => {
                const input: AddParticipantInput = {
                    chatRoomId: "room-1",
                    name: "Agent One",
                    userId: "user-1",
                    role: "AGENT",
                };

                const adminParticipant: ChatParticipant = {
                    id: "participant-2",
                    chatRoomId: "room-1",
                    name: "Agent One",
                    userId: "user-1",
                    role: "AGENT",
                    joinedAt: now,
                    isOnline: true,
                    createdAt: now,
                    updatedAt: now,
                };

                const mockRepository = createMockRepository({
                    addParticipant: vi.fn().mockResolvedValue(adminParticipant),
                });

                const useCase = new AddChatParticipantUseCase(mockRepository);

                const result = await useCase.execute(input);

                expect(result).toEqual(adminParticipant);
                expect(result.userId).toBe("user-1");
                expect(result.role).toBe("AGENT");
            });
        });
    });
});
