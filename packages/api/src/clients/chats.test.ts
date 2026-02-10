import type {
    AddParticipantInput,
    ChatMessage,
    ChatParticipant,
    ChatRoom,
    ChatRoomWithParticipants,
    ChatsListChatRooms200,
    ChatsListChatRoomsParams,
    ChatsMarkMessagesAsReadBody,
    CreateChatRoomInput,
    SendMessageInput,
} from "@generated/api.schemas";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@generated/chats/chats", () => ({
    getChats: vi.fn(() => ({
        chatsListChatRooms: vi.fn(),
        chatsGetChatRoomById: vi.fn(),
        chatsCreateChatRoom: vi.fn(),
        chatsCloseChatRoom: vi.fn(),
        chatsGetChatRoomParticipants: vi.fn(),
        chatsAddChatParticipant: vi.fn(),
        chatsRemoveChatParticipant: vi.fn(),
        chatsGetChatRoomMessages: vi.fn(),
        chatsSendChatMessage: vi.fn(),
        chatsMarkMessagesAsRead: vi.fn(),
    })),
}));

import { getChats } from "@generated/chats/chats";
import {
    addChatParticipant,
    chats,
    closeChatRoom,
    createChatRoom,
    getChatRoomById,
    getChatRoomMessages,
    getChatRoomParticipants,
    listChatRooms,
    markMessagesAsRead,
    removeChatParticipant,
    sendChatMessage,
} from "./chats";

describe("chats client", () => {
    const mockChatsListChatRooms = vi.fn();
    const mockChatsGetChatRoomById = vi.fn();
    const mockChatsCreateChatRoom = vi.fn();
    const mockChatsCloseChatRoom = vi.fn();
    const mockChatsGetChatRoomParticipants = vi.fn();
    const mockChatsAddChatParticipant = vi.fn();
    const mockChatsRemoveChatParticipant = vi.fn();
    const mockChatsGetChatRoomMessages = vi.fn();
    const mockChatsSendChatMessage = vi.fn();
    const mockChatsMarkMessagesAsRead = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getChats).mockReturnValue({
            chatsListChatRooms: mockChatsListChatRooms,
            chatsGetChatRoomById: mockChatsGetChatRoomById,
            chatsCreateChatRoom: mockChatsCreateChatRoom,
            chatsCloseChatRoom: mockChatsCloseChatRoom,
            chatsGetChatRoomParticipants: mockChatsGetChatRoomParticipants,
            chatsAddChatParticipant: mockChatsAddChatParticipant,
            chatsRemoveChatParticipant: mockChatsRemoveChatParticipant,
            chatsGetChatRoomMessages: mockChatsGetChatRoomMessages,
            chatsSendChatMessage: mockChatsSendChatMessage,
            chatsMarkMessagesAsRead: mockChatsMarkMessagesAsRead,
        });
    });

    const mockChatRoom: ChatRoom = {
        id: "room-123",
        status: "ACTIVE",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    };

    const mockParticipant: ChatParticipant = {
        id: "part-123",
        chatRoomId: "room-123",
        name: "John Doe",
        role: "CUSTOMER",
        isOnline: true,
        joinedAt: "2024-01-01T00:00:00Z",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    };

    const mockMessage: ChatMessage = {
        id: "msg-123",
        chatRoomId: "room-123",
        participantId: "part-123",
        type: "TEXT",
        content: "Hello!",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    };

    const mockChatRoomWithParticipants: ChatRoomWithParticipants = {
        ...mockChatRoom,
        participants: [mockParticipant],
    };

    describe("listChatRooms", () => {
        describe("正常系", () => {
            test("パラメータなしで全チャットルームを取得する", async () => {
                const mockResponse: ChatsListChatRooms200 = {
                    data: [mockChatRoom],
                    meta: { total: 1, page: 1, perPage: 10, totalPages: 1 },
                };
                mockChatsListChatRooms.mockResolvedValue(mockResponse);

                const result = await listChatRooms();

                expect(result).toEqual(mockResponse);
                expect(mockChatsListChatRooms).toHaveBeenCalledWith(undefined);
            });

            test("ステータスフィルターを渡してチャットルームを取得する", async () => {
                const params: ChatsListChatRoomsParams = { status: "ACTIVE" };
                const mockResponse: ChatsListChatRooms200 = {
                    data: [mockChatRoom],
                    meta: { total: 1, page: 1, perPage: 10, totalPages: 1 },
                };
                mockChatsListChatRooms.mockResolvedValue(mockResponse);

                await listChatRooms(params);

                expect(mockChatsListChatRooms).toHaveBeenCalledWith(params);
            });
        });
    });

    describe("getChatRoomById", () => {
        describe("正常系", () => {
            test("IDでチャットルームを取得する", async () => {
                mockChatsGetChatRoomById.mockResolvedValue(mockChatRoomWithParticipants);

                const result = await getChatRoomById("room-123");

                expect(result).toEqual(mockChatRoomWithParticipants);
                expect(result.participants).toHaveLength(1);
                expect(mockChatsGetChatRoomById).toHaveBeenCalledWith("room-123");
            });
        });
    });

    describe("createChatRoom", () => {
        describe("正常系", () => {
            test("チャットルームを作成する", async () => {
                const input: CreateChatRoomInput = {
                    name: "Support Chat",
                    customerId: "cust-123",
                };
                mockChatsCreateChatRoom.mockResolvedValue({ ...mockChatRoom, name: "Support Chat" });

                const result = await createChatRoom(input);

                expect(result).toBeDefined();
                expect(mockChatsCreateChatRoom).toHaveBeenCalledWith(input);
            });

            test("問い合わせに紐づけてチャットルームを作成する", async () => {
                const input: CreateChatRoomInput = {
                    inquiryId: "inq-123",
                };
                mockChatsCreateChatRoom.mockResolvedValue({ ...mockChatRoom, inquiryId: "inq-123" });

                const result = await createChatRoom(input);

                expect(result.inquiryId).toBe("inq-123");
            });
        });
    });

    describe("closeChatRoom", () => {
        describe("正常系", () => {
            test("チャットルームをクローズする", async () => {
                const closedRoom: ChatRoom = {
                    ...mockChatRoom,
                    status: "CLOSED",
                    closedAt: "2024-06-01T00:00:00Z",
                };
                mockChatsCloseChatRoom.mockResolvedValue(closedRoom);

                const result = await closeChatRoom("room-123");

                expect(result.status).toBe("CLOSED");
                expect(result.closedAt).toBeDefined();
                expect(mockChatsCloseChatRoom).toHaveBeenCalledWith("room-123");
            });
        });
    });

    describe("getChatRoomParticipants", () => {
        describe("正常系", () => {
            test("チャットルームの参加者一覧を取得する", async () => {
                mockChatsGetChatRoomParticipants.mockResolvedValue([mockParticipant]);

                const result = await getChatRoomParticipants("room-123");

                expect(result).toEqual([mockParticipant]);
                expect(mockChatsGetChatRoomParticipants).toHaveBeenCalledWith("room-123");
            });
        });
    });

    describe("addChatParticipant", () => {
        describe("正常系", () => {
            test("チャットルームに参加者を追加する", async () => {
                const input: AddParticipantInput = {
                    chatRoomId: "room-123",
                    name: "Jane Doe",
                    role: "AGENT",
                };
                const newParticipant = { ...mockParticipant, name: "Jane Doe", role: "AGENT" };
                mockChatsAddChatParticipant.mockResolvedValue(newParticipant);

                const result = await addChatParticipant("room-123", input);

                expect(result.name).toBe("Jane Doe");
                expect(result.role).toBe("AGENT");
                expect(mockChatsAddChatParticipant).toHaveBeenCalledWith("room-123", input);
            });
        });
    });

    describe("removeChatParticipant", () => {
        describe("正常系", () => {
            test("チャットルームから参加者を削除する", async () => {
                mockChatsRemoveChatParticipant.mockResolvedValue(undefined);

                await removeChatParticipant("room-123", "part-123");

                expect(mockChatsRemoveChatParticipant).toHaveBeenCalledWith("room-123", "part-123");
            });
        });
    });

    describe("getChatRoomMessages", () => {
        describe("正常系", () => {
            test("チャットルームのメッセージ一覧を取得する", async () => {
                mockChatsGetChatRoomMessages.mockResolvedValue([mockMessage]);

                const result = await getChatRoomMessages("room-123");

                expect(result).toEqual([mockMessage]);
                expect(mockChatsGetChatRoomMessages).toHaveBeenCalledWith("room-123", undefined);
            });

            test("件数制限付きでメッセージを取得する", async () => {
                mockChatsGetChatRoomMessages.mockResolvedValue([mockMessage]);

                await getChatRoomMessages("room-123", { limit: 50 });

                expect(mockChatsGetChatRoomMessages).toHaveBeenCalledWith("room-123", { limit: 50 });
            });
        });
    });

    describe("sendChatMessage", () => {
        describe("正常系", () => {
            test("チャットメッセージを送信する", async () => {
                const input: SendMessageInput = {
                    chatRoomId: "room-123",
                    content: "Hello!",
                    participantId: "part-123",
                };
                mockChatsSendChatMessage.mockResolvedValue(mockMessage);

                const result = await sendChatMessage("room-123", input);

                expect(result).toEqual(mockMessage);
                expect(mockChatsSendChatMessage).toHaveBeenCalledWith("room-123", input);
            });

            test("画像メッセージを送信する", async () => {
                const input: SendMessageInput = {
                    chatRoomId: "room-123",
                    content: "https://example.com/image.png",
                    type: "IMAGE",
                    participantId: "part-123",
                };
                const imageMessage = { ...mockMessage, type: "IMAGE", content: "https://example.com/image.png" };
                mockChatsSendChatMessage.mockResolvedValue(imageMessage);

                const result = await sendChatMessage("room-123", input);

                expect(result.type).toBe("IMAGE");
            });
        });
    });

    describe("markMessagesAsRead", () => {
        describe("正常系", () => {
            test("メッセージを既読にする", async () => {
                const body: ChatsMarkMessagesAsReadBody = {
                    messageIds: ["msg-123", "msg-456"],
                };
                mockChatsMarkMessagesAsRead.mockResolvedValue(undefined);

                await markMessagesAsRead("room-123", "part-123", body);

                expect(mockChatsMarkMessagesAsRead).toHaveBeenCalledWith("room-123", body, {
                    participantId: "part-123",
                });
            });
        });
    });

    describe("chats オブジェクト", () => {
        test("listRoomsメソッドが正しく動作する", async () => {
            const mockResponse: ChatsListChatRooms200 = {
                data: [],
                meta: { total: 0, page: 1, perPage: 10, totalPages: 0 },
            };
            mockChatsListChatRooms.mockResolvedValue(mockResponse);

            const result = await chats.listRooms();

            expect(result).toEqual(mockResponse);
        });

        test("getRoomByIdメソッドが正しく動作する", async () => {
            mockChatsGetChatRoomById.mockResolvedValue(mockChatRoomWithParticipants);

            const result = await chats.getRoomById("room-123");

            expect(result).toEqual(mockChatRoomWithParticipants);
        });

        test("createRoomメソッドが正しく動作する", async () => {
            mockChatsCreateChatRoom.mockResolvedValue(mockChatRoom);

            const result = await chats.createRoom({});

            expect(result).toEqual(mockChatRoom);
        });

        test("closeRoomメソッドが正しく動作する", async () => {
            mockChatsCloseChatRoom.mockResolvedValue({ ...mockChatRoom, status: "CLOSED" });

            const result = await chats.closeRoom("room-123");

            expect(result.status).toBe("CLOSED");
        });

        test("getParticipantsメソッドが正しく動作する", async () => {
            mockChatsGetChatRoomParticipants.mockResolvedValue([mockParticipant]);

            const result = await chats.getParticipants("room-123");

            expect(result).toEqual([mockParticipant]);
        });

        test("sendMessageメソッドが正しく動作する", async () => {
            mockChatsSendChatMessage.mockResolvedValue(mockMessage);

            const result = await chats.sendMessage("room-123", {
                chatRoomId: "room-123",
                content: "Hi",
                participantId: "part-123",
            });

            expect(result).toEqual(mockMessage);
        });

        test("markAsReadメソッドが正しく動作する", async () => {
            mockChatsMarkMessagesAsRead.mockResolvedValue(undefined);

            await chats.markAsRead("room-123", "part-123", { messageIds: ["msg-123"] });

            expect(mockChatsMarkMessagesAsRead).toHaveBeenCalled();
        });
    });
});
