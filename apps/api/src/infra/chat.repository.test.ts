import type { ChatRoomStatus } from "~/domain/chat";
import { ChatRepositoryImpl } from "./chat.repository";

const mockPrismaClient = {
    chatRoom: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
    },
    chatParticipant: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
    },
    chatMessage: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
    },
};

vi.mock("@portfolio/db", () => ({
    createPrismaClient: () => mockPrismaClient,
}));

describe("ChatRepositoryImpl", () => {
    let repository: ChatRepositoryImpl;

    beforeEach(() => {
        vi.clearAllMocks();
        repository = new ChatRepositoryImpl();
    });

    const mockRoomData = {
        id: "room-uuid-1",
        customerId: "customer-uuid-1",
        inquiryId: "inquiry-uuid-1",
        name: "Support Chat",
        status: "ACTIVE" as ChatRoomStatus,
        metadata: '{"key": "value"}',
        closedAt: null,
        createdAt: new Date("2025-01-01T00:00:00Z"),
        updatedAt: new Date("2025-01-01T00:00:00Z"),
    };

    const mockParticipantData = {
        id: "participant-uuid-1",
        chatRoomId: "room-uuid-1",
        userId: "user-uuid-1",
        name: "John Doe",
        role: "CUSTOMER",
        isOnline: true,
        lastSeenAt: new Date("2025-01-01T01:00:00Z"),
        joinedAt: new Date("2025-01-01T00:00:00Z"),
        leftAt: null,
        createdAt: new Date("2025-01-01T00:00:00Z"),
        updatedAt: new Date("2025-01-01T00:00:00Z"),
    };

    const mockMessageData = {
        id: "message-uuid-1",
        chatRoomId: "room-uuid-1",
        participantId: "participant-uuid-1",
        type: "TEXT",
        content: "Hello, how can I help you?",
        metadata: null,
        readBy: '["participant-uuid-2"]',
        createdAt: new Date("2025-01-01T00:30:00Z"),
        updatedAt: new Date("2025-01-01T00:30:00Z"),
    };

    describe("findAllRooms", () => {
        describe("正常系", () => {
            test("全チャットルームを取得できる", async () => {
                mockPrismaClient.chatRoom.findMany.mockResolvedValue([mockRoomData]);

                const result = await repository.findAllRooms();

                expect(result).toHaveLength(1);
                expect(result[0]?.id).toBe("room-uuid-1");
                expect(result[0]?.metadata).toEqual({ key: "value" });
            });
        });
    });

    describe("findRoomById", () => {
        describe("正常系", () => {
            test("IDで参加者付きチャットルームを取得できる", async () => {
                mockPrismaClient.chatRoom.findUnique.mockResolvedValue({
                    ...mockRoomData,
                    participants: [mockParticipantData],
                });

                const result = await repository.findRoomById("room-uuid-1");

                expect(result).not.toBeNull();
                expect(result?.id).toBe("room-uuid-1");
                expect(result?.participants).toHaveLength(1);
                expect(result?.participants[0]?.name).toBe("John Doe");
            });
        });

        describe("異常系", () => {
            test("存在しないIDの場合はnullを返す", async () => {
                mockPrismaClient.chatRoom.findUnique.mockResolvedValue(null);

                const result = await repository.findRoomById("non-existent");

                expect(result).toBeNull();
            });
        });
    });

    describe("findRoomsByCustomerId", () => {
        describe("正常系", () => {
            test("顧客IDでチャットルームを取得できる", async () => {
                mockPrismaClient.chatRoom.findMany.mockResolvedValue([mockRoomData]);

                const result = await repository.findRoomsByCustomerId("customer-uuid-1");

                expect(result).toHaveLength(1);
                expect(result[0]?.customerId).toBe("customer-uuid-1");
            });
        });
    });

    describe("createRoom", () => {
        describe("正常系", () => {
            test("新しいチャットルームを作成できる", async () => {
                const createData = {
                    customerId: "customer-uuid-1",
                    name: "New Chat",
                };
                mockPrismaClient.chatRoom.create.mockResolvedValue({
                    ...mockRoomData,
                    ...createData,
                    id: "new-room-uuid",
                });

                const result = await repository.createRoom(createData);

                expect(result.id).toBe("new-room-uuid");
                expect(result.name).toBe("New Chat");
            });
        });
    });

    describe("updateRoomStatus", () => {
        describe("正常系", () => {
            test("ルームのステータスを更新できる", async () => {
                mockPrismaClient.chatRoom.update.mockResolvedValue({
                    ...mockRoomData,
                    status: "CLOSED",
                });

                const result = await repository.updateRoomStatus("room-uuid-1", "CLOSED");

                expect(result.status).toBe("CLOSED");
            });
        });
    });

    describe("closeRoom", () => {
        describe("正常系", () => {
            test("ルームをクローズできる", async () => {
                mockPrismaClient.chatRoom.update.mockResolvedValue({
                    ...mockRoomData,
                    status: "CLOSED",
                    closedAt: new Date("2025-01-02T00:00:00Z"),
                });

                const result = await repository.closeRoom("room-uuid-1");

                expect(result.status).toBe("CLOSED");
                expect(result.closedAt).toBeDefined();
            });
        });
    });

    describe("addParticipant", () => {
        describe("正常系", () => {
            test("参加者を追加できる", async () => {
                const addData = {
                    chatRoomId: "room-uuid-1",
                    name: "Jane Doe",
                };
                mockPrismaClient.chatParticipant.create.mockResolvedValue({
                    ...mockParticipantData,
                    ...addData,
                    id: "new-participant-uuid",
                });

                const result = await repository.addParticipant(addData);

                expect(result.id).toBe("new-participant-uuid");
                expect(result.name).toBe("Jane Doe");
            });
        });
    });

    describe("updateParticipantOnlineStatus", () => {
        describe("正常系", () => {
            test("参加者のオンラインステータスを更新できる", async () => {
                mockPrismaClient.chatParticipant.update.mockResolvedValue({
                    ...mockParticipantData,
                    isOnline: false,
                    lastSeenAt: new Date("2025-01-01T02:00:00Z"),
                });

                const result = await repository.updateParticipantOnlineStatus("participant-uuid-1", false);

                expect(result.isOnline).toBe(false);
                expect(result.lastSeenAt).toBeDefined();
            });
        });
    });

    describe("removeParticipant", () => {
        describe("正常系", () => {
            test("参加者を退出させることができる", async () => {
                mockPrismaClient.chatParticipant.update.mockResolvedValue({
                    ...mockParticipantData,
                    leftAt: new Date("2025-01-02T00:00:00Z"),
                });

                await repository.removeParticipant("participant-uuid-1");

                expect(mockPrismaClient.chatParticipant.update).toHaveBeenCalledWith({
                    where: { id: "participant-uuid-1" },
                    data: { leftAt: expect.any(Date) },
                });
            });
        });
    });

    describe("createMessage", () => {
        describe("正常系", () => {
            test("メッセージを作成できる", async () => {
                const createData = {
                    chatRoomId: "room-uuid-1",
                    participantId: "participant-uuid-1",
                    content: "Hello!",
                };
                mockPrismaClient.chatMessage.create.mockResolvedValue({
                    ...mockMessageData,
                    ...createData,
                    id: "new-message-uuid",
                });
                mockPrismaClient.chatRoom.update.mockResolvedValue(mockRoomData);

                const result = await repository.createMessage(createData);

                expect(result.id).toBe("new-message-uuid");
                expect(result.content).toBe("Hello!");
                expect(mockPrismaClient.chatRoom.update).toHaveBeenCalledWith({
                    where: { id: "room-uuid-1" },
                    data: { updatedAt: expect.any(Date) },
                });
            });
        });
    });

    describe("findMessagesByRoomId", () => {
        describe("正常系", () => {
            test("ルームのメッセージ履歴を取得できる", async () => {
                mockPrismaClient.chatMessage.findMany.mockResolvedValue([mockMessageData]);

                const result = await repository.findMessagesByRoomId("room-uuid-1");

                expect(result).toHaveLength(1);
                expect(result[0]?.content).toBe("Hello, how can I help you?");
                expect(result[0]?.readBy).toEqual(["participant-uuid-2"]);
            });
        });
    });

    describe("markMessagesAsRead", () => {
        describe("正常系", () => {
            test("メッセージを既読にできる", async () => {
                mockPrismaClient.chatMessage.findUnique.mockResolvedValue(mockMessageData);
                mockPrismaClient.chatMessage.update.mockResolvedValue({
                    ...mockMessageData,
                    readBy: '["participant-uuid-2", "participant-uuid-3"]',
                });

                await repository.markMessagesAsRead("room-uuid-1", "participant-uuid-3", ["message-uuid-1"]);

                expect(mockPrismaClient.chatMessage.update).toHaveBeenCalledWith({
                    where: { id: "message-uuid-1" },
                    data: { readBy: expect.any(String) },
                });
            });
        });
    });
});
