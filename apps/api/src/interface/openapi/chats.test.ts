import { chatsRouter } from "./chats";

vi.mock("~/di/container", () => ({
    DIContainer: vi.fn().mockImplementation(() => ({
        getGetChatRoomsUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue([
                {
                    id: "123e4567-e89b-12d3-a456-426614174000",
                    status: "ACTIVE",
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            ]),
        })),
        getGetChatRoomByIdUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                status: "ACTIVE",
                participants: [],
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getCreateChatRoomUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                status: "ACTIVE",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getCloseChatRoomUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                status: "CLOSED",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getAddChatParticipantUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "participant-123",
                chatRoomId: "123e4567-e89b-12d3-a456-426614174000",
                name: "Test User",
                role: "MEMBER",
                joinedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getGetChatMessagesUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue([
                {
                    id: "message-123",
                    chatRoomId: "123e4567-e89b-12d3-a456-426614174000",
                    participantId: "participant-123",
                    type: "TEXT",
                    content: "Test message",
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            ]),
        })),
        getSendChatMessageUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "message-123",
                chatRoomId: "123e4567-e89b-12d3-a456-426614174000",
                participantId: "participant-123",
                type: "TEXT",
                content: "New message",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
    })),
}));

vi.mock("~/lib/logger", () => ({
    getLogger: vi.fn(() => ({
        logError: vi.fn(),
    })),
    getMetrics: vi.fn(() => ({
        httpRequestDuration: {
            observe: vi.fn(),
        },
        httpRequestTotal: {
            inc: vi.fn(),
        },
    })),
}));

vi.mock("~/lib/validation", () => ({
    isValidUuid: vi.fn((str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)),
}));

describe("chatsRouter", () => {
    const mockEnv = {
        DATABASE_URL: "test-db-url",
        CACHE_URL: "test-cache-url",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /rooms", () => {
        describe("正常系", () => {
            test("チャットルーム一覧を200で返す", async () => {
                const req = new Request("http://localhost/rooms", {
                    method: "GET",
                });

                const res = await chatsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(Array.isArray(json)).toBe(true);
            });
        });
    });

    describe("GET /rooms/:id", () => {
        describe("正常系", () => {
            test("指定されたIDのチャットルームを200で返す", async () => {
                const req = new Request("http://localhost/rooms/123e4567-e89b-12d3-a456-426614174000", {
                    method: "GET",
                });

                const res = await chatsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("id");
            });
        });

        describe("異常系", () => {
            test("無効なUUID形式の場合は400を返す", async () => {
                const req = new Request("http://localhost/rooms/invalid-uuid", {
                    method: "GET",
                });

                const res = await chatsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(400);
            });
        });
    });

    describe("POST /rooms", () => {
        describe("正常系", () => {
            test("新しいチャットルームを201で作成する", async () => {
                const req = new Request("http://localhost/rooms", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "New Room",
                    }),
                });

                const res = await chatsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(201);
            });
        });
    });

    describe("POST /rooms/:id/close", () => {
        describe("正常系", () => {
            test("チャットルームを200で終了する", async () => {
                const req = new Request("http://localhost/rooms/123e4567-e89b-12d3-a456-426614174000/close", {
                    method: "POST",
                });

                const res = await chatsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("status", "CLOSED");
            });
        });
    });

    describe("POST /rooms/:id/participants", () => {
        describe("正常系", () => {
            test("参加者を201で追加する", async () => {
                const req = new Request("http://localhost/rooms/123e4567-e89b-12d3-a456-426614174000/participants", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "Test User",
                        role: "MEMBER",
                    }),
                });

                const res = await chatsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(201);
            });
        });
    });

    describe("GET /rooms/:id/messages", () => {
        describe("正常系", () => {
            test("メッセージ一覧を200で返す", async () => {
                const req = new Request("http://localhost/rooms/123e4567-e89b-12d3-a456-426614174000/messages", {
                    method: "GET",
                });

                const res = await chatsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(Array.isArray(json)).toBe(true);
            });
        });
    });

    describe("POST /rooms/:id/messages", () => {
        describe("正常系", () => {
            test("メッセージを201で送信する", async () => {
                const req = new Request("http://localhost/rooms/123e4567-e89b-12d3-a456-426614174000/messages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        participantId: "participant-123",
                        content: "New message",
                    }),
                });

                const res = await chatsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(201);
            });
        });
    });
});
