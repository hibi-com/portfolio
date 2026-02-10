import { describe, expect, test, vi } from "vitest";
import type { AddParticipantInput, ChatParticipant, ChatRepository } from "~/domain/chat";
import { AddChatParticipantUseCase } from "./addChatParticipant";

describe("AddChatParticipantUseCase", () => {
    const mockParticipant: ChatParticipant = {
        id: "participant-1",
        chatRoomId: "room-1",
        customerId: "customer-1",
        userId: null,
        role: "CUSTOMER",
        joinedAt: new Date(),
        isOnline: true,
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
                // Given: 顧客参加者の入力データ
                const input: AddParticipantInput = {
                    chatRoomId: "room-1",
                    customerId: "customer-1",
                    role: "CUSTOMER",
                };

                const mockRepository = createMockRepository({
                    addParticipant: vi.fn().mockResolvedValue(mockParticipant),
                });

                const useCase = new AddChatParticipantUseCase(mockRepository);

                // When: 参加者を追加
                const result = await useCase.execute(input);

                // Then: 参加者が追加される
                expect(result).toEqual(mockParticipant);
                expect(mockRepository.addParticipant).toHaveBeenCalledWith(input);
                expect(mockRepository.addParticipant).toHaveBeenCalledTimes(1);
            });

            test("管理者をチャットルームに追加できる", async () => {
                // Given: 管理者参加者の入力データ
                const input: AddParticipantInput = {
                    chatRoomId: "room-1",
                    userId: "user-1",
                    role: "ADMIN",
                };

                const adminParticipant: ChatParticipant = {
                    id: "participant-2",
                    chatRoomId: "room-1",
                    customerId: null,
                    userId: "user-1",
                    role: "ADMIN",
                    joinedAt: new Date(),
                    isOnline: true,
                };

                const mockRepository = createMockRepository({
                    addParticipant: vi.fn().mockResolvedValue(adminParticipant),
                });

                const useCase = new AddChatParticipantUseCase(mockRepository);

                // When: 参加者を追加
                const result = await useCase.execute(input);

                // Then: 管理者が追加される
                expect(result).toEqual(adminParticipant);
                expect(result.userId).toBe("user-1");
                expect(result.role).toBe("ADMIN");
            });
        });
    });
});
