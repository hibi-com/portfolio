import type { WebSocket as CFWebSocket, DurableObjectState } from "@cloudflare/workers-types";

class MockWebSocket {
    accept = vi.fn();
    send = vi.fn();
    close = vi.fn();
    addEventListener = vi.fn();
    removeEventListener = vi.fn();
    dispatchEvent = vi.fn();
    serializeAttachment = vi.fn();
    deserializeAttachment = vi.fn();
    READY_STATE_CONNECTING = 0;
    READY_STATE_OPEN = 1;
    READY_STATE_CLOSING = 2;
    READY_STATE_CLOSED = 3;
    readyState = 1;
}

const MockWebSocketPair = class {
    "0": MockWebSocket;
    "1": MockWebSocket;

    constructor() {
        this[0] = new MockWebSocket() as MockWebSocket & Record<string, unknown>;
        this[1] = new MockWebSocket() as MockWebSocket & Record<string, unknown>;
    }
};

(globalThis as unknown as { WebSocketPair: typeof MockWebSocketPair }).WebSocketPair = MockWebSocketPair;

import { ChatRoomDO } from "./ChatRoomDO";

/** Test-only: cast to access private sessions for assertions */
type SessionsMap = Map<unknown, { webSocket: unknown; participantId: string; participantName: string; joinedAt: Date }>;
function getSessions(room: ChatRoomDO): SessionsMap {
    return (room as unknown as { sessions: SessionsMap }).sessions;
}

describe("ChatRoomDO", () => {
    let chatRoom: ChatRoomDO;
    let mockState: DurableObjectState;
    let mockWebSocket: CFWebSocket;
    let mockStorage: Map<string, unknown>;

    beforeEach(() => {
        vi.clearAllMocks();

        mockStorage = new Map();

        mockState = {
            id: {
                toString: () => "test-room-id",
                equals: vi.fn(),
                name: "test-room",
            },
            storage: {
                get: vi.fn((key: string) => Promise.resolve(mockStorage.get(key))),
                put: vi.fn((key: string, value: unknown) => {
                    mockStorage.set(key, value);
                    return Promise.resolve();
                }),
                delete: vi.fn((key: string) => {
                    mockStorage.delete(key);
                    return Promise.resolve(true);
                }),
                list: vi.fn(),
                getAlarm: vi.fn(),
                setAlarm: vi.fn(),
                deleteAlarm: vi.fn(),
                sync: vi.fn(),
                transaction: vi.fn(),
                transactionSync: vi.fn(),
                deleteAll: vi.fn(),
                getMultiple: vi.fn(),
                putMultiple: vi.fn(),
                deleteMultiple: vi.fn(),
                sql: {} as any,
            },
            getWebSockets: vi.fn(() => []),
            acceptWebSocket: vi.fn(),
            getTags: vi.fn(),
            setWebSocketAutoResponse: vi.fn(),
            getWebSocketAutoResponse: vi.fn(),
            getWebSocketAutoResponseTimestamp: vi.fn(),
            blockConcurrencyWhile: vi.fn(),
            waitUntil: vi.fn(),
            abort: vi.fn(),
        } as unknown as DurableObjectState;

        mockWebSocket = new MockWebSocket() as unknown as CFWebSocket;

        chatRoom = new ChatRoomDO(mockState);
    });

    describe("fetch /websocket", () => {
        describe("正常系", () => {
            test("正常なリクエストで101を返しjoinをブロードキャストする", async () => {
                const url = "http://localhost/websocket?participantId=user1&participantName=Alice&roomId=room1";
                const request = new Request(url, {
                    headers: {
                        Upgrade: "websocket",
                    },
                });

                const response = await chatRoom.fetch(request);

                expect(response.status).toBe(101);
                expect(mockState.acceptWebSocket).toHaveBeenCalledTimes(1);
            });
        });

        describe("異常系", () => {
            test("Upgradeヘッダーがない場合は426を返す", async () => {
                const url = "http://localhost/websocket?participantId=user1&roomId=room1";
                const request = new Request(url);

                const response = await chatRoom.fetch(request);

                expect(response.status).toBe(426);
                expect(await response.text()).toBe("Expected WebSocket upgrade");
            });

            test("participantIdがない場合は400を返す", async () => {
                const url = "http://localhost/websocket?roomId=room1";
                const request = new Request(url, {
                    headers: {
                        Upgrade: "websocket",
                    },
                });

                const response = await chatRoom.fetch(request);

                expect(response.status).toBe(400);
                expect(await response.text()).toBe("participantId is required");
            });

            test("roomIdがない場合は400を返す", async () => {
                const url = "http://localhost/websocket?participantId=user1";
                const request = new Request(url, {
                    headers: {
                        Upgrade: "websocket",
                    },
                });

                const response = await chatRoom.fetch(request);

                expect(response.status).toBe(400);
                expect(await response.text()).toBe("roomId is required");
            });
        });

        describe("境界値", () => {
            test("participantNameが空文字の場合はAnonymousになる", async () => {
                const url = "http://localhost/websocket?participantId=user1&participantName=&roomId=room1";
                const request = new Request(url, {
                    headers: {
                        Upgrade: "websocket",
                    },
                });

                const response = await chatRoom.fetch(request);

                expect(response.status).toBe(101);
                expect(mockState.acceptWebSocket).toHaveBeenCalledTimes(1);
            });

            test("participantNameが指定されていない場合はAnonymousになる", async () => {
                const url = "http://localhost/websocket?participantId=user1&roomId=room1";
                const request = new Request(url, {
                    headers: {
                        Upgrade: "websocket",
                    },
                });

                const response = await chatRoom.fetch(request);

                expect(response.status).toBe(101);
                expect(mockState.acceptWebSocket).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("fetch /history", () => {
        describe("正常系", () => {
            test("メッセージ履歴を返す", async () => {
                const messages = [
                    {
                        id: "msg1",
                        participantId: "user1",
                        participantName: "Alice",
                        content: "Hello",
                        timestamp: "2024-01-01T00:00:00Z",
                    },
                    {
                        id: "msg2",
                        participantId: "user2",
                        participantName: "Bob",
                        content: "Hi",
                        timestamp: "2024-01-01T00:01:00Z",
                    },
                ];
                mockStorage.set("messages", messages);

                const request = new Request("http://localhost/history");
                const response = await chatRoom.fetch(request);

                expect(response.status).toBe(200);
                expect(response.headers.get("Content-Type")).toBe("application/json");
                expect(await response.json()).toEqual(messages);
            });

            test("メッセージがない場合は空配列を返す", async () => {
                const request = new Request("http://localhost/history");
                const response = await chatRoom.fetch(request);

                expect(response.status).toBe(200);
                expect(await response.json()).toEqual([]);
            });
        });
    });

    describe("fetch /participants", () => {
        describe("正常系", () => {
            test("参加者リストを返す", async () => {
                const mockWs1 = new MockWebSocket();
                const mockWs2 = new MockWebSocket();
                getSessions(chatRoom).set(mockWs1, {
                    webSocket: mockWs1,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date("2024-01-01T00:00:00Z"),
                });
                getSessions(chatRoom).set(mockWs2, {
                    webSocket: mockWs2,
                    participantId: "user2",
                    participantName: "Bob",
                    joinedAt: new Date("2024-01-01T00:01:00Z"),
                });

                const request = new Request("http://localhost/participants");
                const response = await chatRoom.fetch(request);

                expect(response.status).toBe(200);
                expect(response.headers.get("Content-Type")).toBe("application/json");
                const participants = await response.json();
                expect(participants).toHaveLength(2);
                expect(participants).toEqual(
                    expect.arrayContaining([
                        {
                            participantId: "user1",
                            participantName: "Alice",
                            joinedAt: "2024-01-01T00:00:00.000Z",
                        },
                        {
                            participantId: "user2",
                            participantName: "Bob",
                            joinedAt: "2024-01-01T00:01:00.000Z",
                        },
                    ]),
                );
            });

            test("参加者がいない場合は空配列を返す", async () => {
                const request = new Request("http://localhost/participants");
                const response = await chatRoom.fetch(request);

                expect(response.status).toBe(200);
                expect(await response.json()).toEqual([]);
            });
        });
    });

    describe("fetch その他のパス", () => {
        describe("異常系", () => {
            test("存在しないパスは404を返す", async () => {
                const request = new Request("http://localhost/unknown");

                const response = await chatRoom.fetch(request);

                expect(response.status).toBe(404);
                expect(await response.text()).toBe("Not found");
            });
        });
    });

    describe("webSocketMessage", () => {
        describe("正常系", () => {
            test("type: message - メッセージを保存してブロードキャストする", async () => {
                const session = {
                    webSocket: mockWebSocket,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                };
                getSessions(chatRoom).set(mockWebSocket, session);

                const message = JSON.stringify({
                    type: "message",
                    content: "Hello, World!",
                });

                await chatRoom.webSocketMessage(mockWebSocket, message);

                expect(mockState.storage.put).toHaveBeenCalledWith(
                    "messages",
                    expect.arrayContaining([
                        expect.objectContaining({
                            participantId: "user1",
                            participantName: "Alice",
                            content: "Hello, World!",
                        }),
                    ]),
                );

                expect(mockWebSocket.send).toHaveBeenCalledWith(expect.stringContaining('"type":"message"'));
            });

            test("type: typing - 他の参加者にのみブロードキャストする", async () => {
                const sender = mockWebSocket;
                const receiver = new MockWebSocket() as unknown as CFWebSocket;

                getSessions(chatRoom).set(sender, {
                    webSocket: sender,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                });
                getSessions(chatRoom).set(receiver, {
                    webSocket: receiver,
                    participantId: "user2",
                    participantName: "Bob",
                    joinedAt: new Date(),
                });

                const message = JSON.stringify({
                    type: "typing",
                });

                await chatRoom.webSocketMessage(sender, message);

                expect((sender as any).send).not.toHaveBeenCalled();
                expect((receiver as any).send).toHaveBeenCalledWith(expect.stringContaining('"type":"typing"'));
            });

            test("type: read - 全参加者にブロードキャストする", async () => {
                const session = {
                    webSocket: mockWebSocket,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                };
                getSessions(chatRoom).set(mockWebSocket, session);

                const message = JSON.stringify({
                    type: "read",
                    messageId: "msg1",
                });

                await chatRoom.webSocketMessage(mockWebSocket, message);

                expect(mockWebSocket.send).toHaveBeenCalledWith(expect.stringContaining('"type":"read"'));
                expect(mockWebSocket.send).toHaveBeenCalledWith(expect.stringContaining('"messageId":"msg1"'));
            });

            test("ArrayBuffer形式のメッセージを処理できる", async () => {
                const session = {
                    webSocket: mockWebSocket,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                };
                getSessions(chatRoom).set(mockWebSocket, session);

                const messageObj = { type: "message", content: "Hello" };
                const messageBuffer = new TextEncoder().encode(JSON.stringify(messageObj));

                await chatRoom.webSocketMessage(
                    mockWebSocket,
                    messageBuffer.buffer.slice(
                        messageBuffer.byteOffset,
                        messageBuffer.byteOffset + messageBuffer.byteLength,
                    ) as ArrayBuffer,
                );

                expect(mockState.storage.put).toHaveBeenCalled();
                expect(mockWebSocket.send).toHaveBeenCalled();
            });
        });

        describe("異常系", () => {
            test("無効なJSONはエラーを返す", async () => {
                const session = {
                    webSocket: mockWebSocket,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                };
                getSessions(chatRoom).set(mockWebSocket, session);

                const invalidMessage = "{ invalid json";

                await chatRoom.webSocketMessage(mockWebSocket, invalidMessage);

                expect(mockWebSocket.send).toHaveBeenCalledWith(
                    JSON.stringify({ type: "error", message: "Invalid message format" }),
                );
            });

            test("セッションが存在しない場合は処理をスキップする", async () => {
                const message = JSON.stringify({ type: "message", content: "Hello" });

                await chatRoom.webSocketMessage(mockWebSocket, message);

                expect(mockWebSocket.send).not.toHaveBeenCalled();
                expect(mockState.storage.put).not.toHaveBeenCalled();
            });
        });

        describe("エッジケース", () => {
            test("contentが空のmessageは保存されない", async () => {
                const session = {
                    webSocket: mockWebSocket,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                };
                getSessions(chatRoom).set(mockWebSocket, session);

                const message = JSON.stringify({
                    type: "message",
                    content: "",
                });

                await chatRoom.webSocketMessage(mockWebSocket, message);

                expect(mockState.storage.put).not.toHaveBeenCalled();
            });

            test("messageIdがないreadメッセージは処理されない", async () => {
                const session = {
                    webSocket: mockWebSocket,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                };
                getSessions(chatRoom).set(mockWebSocket, session);

                const message = JSON.stringify({
                    type: "read",
                });

                await chatRoom.webSocketMessage(mockWebSocket, message);

                expect(mockWebSocket.send).not.toHaveBeenCalled();
            });
        });
    });

    describe("webSocketClose", () => {
        describe("正常系", () => {
            test("leaveをブロードキャストしてセッションを削除する", async () => {
                const closingWs = mockWebSocket;
                const remainingWs = new MockWebSocket() as unknown as CFWebSocket;

                getSessions(chatRoom).set(closingWs, {
                    webSocket: closingWs,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                });
                getSessions(chatRoom).set(remainingWs, {
                    webSocket: remainingWs,
                    participantId: "user2",
                    participantName: "Bob",
                    joinedAt: new Date(),
                });

                await chatRoom.webSocketClose(closingWs, 1000, "Normal closure");

                expect((remainingWs as any).send).toHaveBeenCalledWith(expect.stringContaining('"type":"leave"'));
                expect((remainingWs as any).send).toHaveBeenCalledWith(
                    expect.stringContaining('"participantId":"user1"'),
                );

                expect(getSessions(chatRoom).has(closingWs)).toBe(false);
                expect(getSessions(chatRoom).has(remainingWs)).toBe(true);
            });
        });

        describe("エッジケース", () => {
            test("セッションが存在しない場合は何もしない", async () => {
                await chatRoom.webSocketClose(mockWebSocket, 1000, "Normal closure");

                expect(mockWebSocket.send).not.toHaveBeenCalled();
            });
        });
    });

    describe("webSocketError", () => {
        describe("正常系", () => {
            test("セッションを削除する", async () => {
                const session = {
                    webSocket: mockWebSocket,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                };
                getSessions(chatRoom).set(mockWebSocket, session);

                const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

                await chatRoom.webSocketError(mockWebSocket, new Error("Connection error"));

                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    "WebSocket error for participant user1:",
                    expect.any(Error),
                );

                expect(getSessions(chatRoom).has(mockWebSocket)).toBe(false);

                consoleErrorSpy.mockRestore();
            });
        });

        describe("エッジケース", () => {
            test("セッションが存在しない場合は何もしない", async () => {
                const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

                await chatRoom.webSocketError(mockWebSocket, new Error("Connection error"));

                expect(consoleErrorSpy).not.toHaveBeenCalled();

                consoleErrorSpy.mockRestore();
            });
        });
    });

    describe("メッセージストレージ", () => {
        describe("境界値", () => {
            test("1000件を超えるメッセージは古いものから削除される", async () => {
                const existingMessages = Array.from({ length: 1000 }, (_, i) => ({
                    id: `msg${i}`,
                    participantId: "user1",
                    participantName: "Alice",
                    content: `Message ${i}`,
                    timestamp: new Date().toISOString(),
                }));
                mockStorage.set("messages", existingMessages);

                const session = {
                    webSocket: mockWebSocket,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                };
                getSessions(chatRoom).set(mockWebSocket, session);

                const message = JSON.stringify({
                    type: "message",
                    content: "New message",
                });
                await chatRoom.webSocketMessage(mockWebSocket, message);

                expect(mockState.storage.put).toHaveBeenCalledWith(
                    "messages",
                    expect.arrayContaining([
                        expect.objectContaining({
                            content: "New message",
                        }),
                    ]),
                );

                const savedMessages = mockStorage.get("messages") as any[];
                expect(savedMessages.length).toBe(1000);
                expect(savedMessages[0].id).toBe("msg1");
            });
        });
    });
});
