import { describe, expect, test, vi } from "vitest";
import type { ChatRepository, ChatRoom, CreateChatRoomInput } from "~/domain/chat";
import { CreateChatRoomUseCase } from "./createChatRoom";

describe("CreateChatRoomUseCase", () => {
    const mockChatRoom: ChatRoom = {
        id: "room-1",
        customerId: "customer-1",
        inquiryId: "inquiry-1",
        status: "ACTIVE",
        closedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const createMockRepository = (overrides: Partial<ChatRepository> = {}): ChatRepository => ({
        findAllRooms: vi.fn().mockResolvedValue([]),
        findRoomById: vi.fn().mockResolvedValue(null),
        findRoomsByCustomerId: vi.fn().mockResolvedValue([]),
        findRoomByInquiryId: vi.fn().mockResolvedValue(null),
        createRoom: vi.fn().mockResolvedValue(mockChatRoom),
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
            test("問い合わせに紐づくチャットルームを作成できる", async () => {
                // Given: チャットルーム作成入力
                const input: CreateChatRoomInput = {
                    customerId: "customer-1",
                    inquiryId: "inquiry-1",
                };

                const mockRepository = createMockRepository({
                    createRoom: vi.fn().mockResolvedValue(mockChatRoom),
                });

                const useCase = new CreateChatRoomUseCase(mockRepository);

                // When: チャットルームを作成
                const result = await useCase.execute(input);

                // Then: チャットルームが作成される
                expect(result).toEqual(mockChatRoom);
                expect(result.customerId).toBe("customer-1");
                expect(result.inquiryId).toBe("inquiry-1");
                expect(result.status).toBe("ACTIVE");
                expect(mockRepository.createRoom).toHaveBeenCalledWith(input);
                expect(mockRepository.createRoom).toHaveBeenCalledTimes(1);
            });

            test("問い合わせIDなしでチャットルームを作成できる", async () => {
                // Given: 問い合わせIDなしの入力
                const input: CreateChatRoomInput = {
                    customerId: "customer-1",
                };

                const roomWithoutInquiry: ChatRoom = {
                    ...mockChatRoom,
                    inquiryId: null,
                };

                const mockRepository = createMockRepository({
                    createRoom: vi.fn().mockResolvedValue(roomWithoutInquiry),
                });

                const useCase = new CreateChatRoomUseCase(mockRepository);

                // When: チャットルームを作成
                const result = await useCase.execute(input);

                // Then: 問い合わせIDなしでチャットルームが作成される
                expect(result.inquiryId).toBeNull();
                expect(result.customerId).toBe("customer-1");
            });
        });
    });
});
