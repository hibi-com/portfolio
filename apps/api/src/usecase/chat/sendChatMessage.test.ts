import type { ChatMessage, ChatRepository, SendMessageInput } from "~/domain/chat";
import { SendChatMessageUseCase } from "./sendChatMessage";

describe("SendChatMessageUseCase", () => {
    const now = "2024-01-01T00:00:00.000Z";
    const mockMessage: ChatMessage = {
        id: "message-1",
        chatRoomId: "room-1",
        participantId: "participant-1",
        type: "TEXT",
        content: "Hello, this is a test message",
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
        addParticipant: vi.fn().mockResolvedValue({} as any),
        updateParticipantOnlineStatus: vi.fn().mockResolvedValue({} as any),
        removeParticipant: vi.fn().mockResolvedValue(undefined),
        findMessagesByRoomId: vi.fn().mockResolvedValue([]),
        findMessageById: vi.fn().mockResolvedValue(null),
        createMessage: vi.fn().mockResolvedValue(mockMessage),
        markMessagesAsRead: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("テキストメッセージを送信できる", async () => {
                const input: SendMessageInput = {
                    chatRoomId: "room-1",
                    participantId: "participant-1",
                    type: "TEXT",
                    content: "Hello, this is a test message",
                };

                const mockRepository = createMockRepository({
                    createMessage: vi.fn().mockResolvedValue(mockMessage),
                });

                const useCase = new SendChatMessageUseCase(mockRepository);

                const result = await useCase.execute(input);

                expect(result).toEqual(mockMessage);
                expect(result.content).toBe("Hello, this is a test message");
                expect(result.type).toBe("TEXT");
                expect(mockRepository.createMessage).toHaveBeenCalledWith(input);
                expect(mockRepository.createMessage).toHaveBeenCalledTimes(1);
            });

            test("ファイルメッセージを送信できる", async () => {
                const input: SendMessageInput = {
                    chatRoomId: "room-1",
                    participantId: "participant-1",
                    type: "FILE",
                    content: "https://example.com/file.pdf",
                };

                const fileMessage: ChatMessage = {
                    ...mockMessage,
                    type: "FILE",
                    content: "https://example.com/file.pdf",
                };

                const mockRepository = createMockRepository({
                    createMessage: vi.fn().mockResolvedValue(fileMessage),
                });

                const useCase = new SendChatMessageUseCase(mockRepository);

                const result = await useCase.execute(input);

                expect(result.type).toBe("FILE");
                expect(result.content).toBe("https://example.com/file.pdf");
            });

            test("システムメッセージを送信できる", async () => {
                const input: SendMessageInput = {
                    chatRoomId: "room-1",
                    participantId: "participant-1",
                    type: "SYSTEM",
                    content: "User has joined the chat",
                };

                const systemMessage: ChatMessage = {
                    ...mockMessage,
                    type: "SYSTEM",
                    content: "User has joined the chat",
                };

                const mockRepository = createMockRepository({
                    createMessage: vi.fn().mockResolvedValue(systemMessage),
                });

                const useCase = new SendChatMessageUseCase(mockRepository);

                const result = await useCase.execute(input);

                expect(result.type).toBe("SYSTEM");
                expect(result.content).toBe("User has joined the chat");
            });
        });
    });
});
