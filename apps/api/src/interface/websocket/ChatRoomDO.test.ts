import { describe, expect, test, beforeEach, vi } from "vitest";
import type { WebSocket as CFWebSocket, DurableObjectState } from "@cloudflare/workers-types";

// Mock WebSocketPair globally before any imports
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

global.WebSocketPair = class WebSocketPair {
    "0": MockWebSocket;
    "1": MockWebSocket;

    constructor() {
        this[0] = new MockWebSocket() as any;
        this[1] = new MockWebSocket() as any;
    }
} as any;

// Import after setting up global mocks
import { ChatRoomDO } from "./ChatRoomDO";

describe("ChatRoomDO", () => {
    let chatRoom: ChatRoomDO;
    let mockState: DurableObjectState;
    let mockWebSocket: CFWebSocket;
    let mockStorage: Map<string, unknown>;

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock storage
        mockStorage = new Map();

        // Mock DurableObjectState
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

        // Mock WebSocket
        mockWebSocket = new MockWebSocket() as unknown as CFWebSocket;

        // Create ChatRoomDO instance
        chatRoom = new ChatRoomDO(mockState);
    });

    describe("fetch /websocket", () => {
        describe("正常系", () => {
            test("正常なリクエストで101を返しjoinをブロードキャストする", async () => {
                // Given: 正常なWebSocketアップグレードリクエスト
                const url = "http://localhost/websocket?participantId=user1&participantName=Alice&roomId=room1";
                const request = new Request(url, {
                    headers: {
                        Upgrade: "websocket",
                    },
                });

                // When: WebSocket接続リクエストを処理
                const response = await chatRoom.fetch(request);

                // Then: 101 Switching Protocolsを返す
                expect(response.status).toBe(101);
                expect(mockState.acceptWebSocket).toHaveBeenCalledTimes(1);
            });
        });

        describe("異常系", () => {
            test("Upgradeヘッダーがない場合は426を返す", async () => {
                // Given: Upgradeヘッダーがないリクエスト
                const url = "http://localhost/websocket?participantId=user1&roomId=room1";
                const request = new Request(url);

                // When: リクエストを処理
                const response = await chatRoom.fetch(request);

                // Then: 426 Upgrade Requiredを返す
                expect(response.status).toBe(426);
                expect(await response.text()).toBe("Expected WebSocket upgrade");
            });

            test("participantIdがない場合は400を返す", async () => {
                // Given: participantIdが欠けているリクエスト
                const url = "http://localhost/websocket?roomId=room1";
                const request = new Request(url, {
                    headers: {
                        Upgrade: "websocket",
                    },
                });

                // When: リクエストを処理
                const response = await chatRoom.fetch(request);

                // Then: 400 Bad Requestを返す
                expect(response.status).toBe(400);
                expect(await response.text()).toBe("participantId is required");
            });

            test("roomIdがない場合は400を返す", async () => {
                // Given: roomIdが欠けているリクエスト
                const url = "http://localhost/websocket?participantId=user1";
                const request = new Request(url, {
                    headers: {
                        Upgrade: "websocket",
                    },
                });

                // When: リクエストを処理
                const response = await chatRoom.fetch(request);

                // Then: 400 Bad Requestを返す
                expect(response.status).toBe(400);
                expect(await response.text()).toBe("roomId is required");
            });
        });

        describe("境界値", () => {
            test("participantNameが空文字の場合はAnonymousになる", async () => {
                // Given: participantNameが空文字のリクエスト
                const url = "http://localhost/websocket?participantId=user1&participantName=&roomId=room1";
                const request = new Request(url, {
                    headers: {
                        Upgrade: "websocket",
                    },
                });

                // When: リクエストを処理
                const response = await chatRoom.fetch(request);

                // Then: 101を返しAnonymousとしてセッションが作成される
                expect(response.status).toBe(101);
                expect(mockState.acceptWebSocket).toHaveBeenCalledTimes(1);
            });

            test("participantNameが指定されていない場合はAnonymousになる", async () => {
                // Given: participantNameが指定されていないリクエスト
                const url = "http://localhost/websocket?participantId=user1&roomId=room1";
                const request = new Request(url, {
                    headers: {
                        Upgrade: "websocket",
                    },
                });

                // When: リクエストを処理
                const response = await chatRoom.fetch(request);

                // Then: 101を返しAnonymousとしてセッションが作成される
                expect(response.status).toBe(101);
                expect(mockState.acceptWebSocket).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("fetch /history", () => {
        describe("正常系", () => {
            test("メッセージ履歴を返す", async () => {
                // Given: ストレージに保存されたメッセージ
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

                // When: 履歴取得リクエストを処理
                const request = new Request("http://localhost/history");
                const response = await chatRoom.fetch(request);

                // Then: メッセージ履歴をJSONで返す
                expect(response.status).toBe(200);
                expect(response.headers.get("Content-Type")).toBe("application/json");
                expect(await response.json()).toEqual(messages);
            });

            test("メッセージがない場合は空配列を返す", async () => {
                // Given: ストレージにメッセージがない
                // When: 履歴取得リクエストを処理
                const request = new Request("http://localhost/history");
                const response = await chatRoom.fetch(request);

                // Then: 空配列を返す
                expect(response.status).toBe(200);
                expect(await response.json()).toEqual([]);
            });
        });
    });

    describe("fetch /participants", () => {
        describe("正常系", () => {
            test("参加者リストを返す", async () => {
                // Given: 複数の参加者がいる状態
                const mockWs1 = new MockWebSocket();
                const mockWs2 = new MockWebSocket();
                chatRoom.sessions.set(mockWs1, {
                    webSocket: mockWs1,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date("2024-01-01T00:00:00Z"),
                });
                chatRoom.sessions.set(mockWs2, {
                    webSocket: mockWs2,
                    participantId: "user2",
                    participantName: "Bob",
                    joinedAt: new Date("2024-01-01T00:01:00Z"),
                });

                // When: 参加者リスト取得リクエストを処理
                const request = new Request("http://localhost/participants");
                const response = await chatRoom.fetch(request);

                // Then: 参加者リストをJSONで返す
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
                // Given: 参加者がいない状態
                // When: 参加者リスト取得リクエストを処理
                const request = new Request("http://localhost/participants");
                const response = await chatRoom.fetch(request);

                // Then: 空配列を返す
                expect(response.status).toBe(200);
                expect(await response.json()).toEqual([]);
            });
        });
    });

    describe("fetch その他のパス", () => {
        describe("異常系", () => {
            test("存在しないパスは404を返す", async () => {
                // Given: 存在しないパス
                const request = new Request("http://localhost/unknown");

                // When: リクエストを処理
                const response = await chatRoom.fetch(request);

                // Then: 404 Not Foundを返す
                expect(response.status).toBe(404);
                expect(await response.text()).toBe("Not found");
            });
        });
    });

    describe("webSocketMessage", () => {
        describe("正常系", () => {
            test("type: message - メッセージを保存してブロードキャストする", async () => {
                // Given: 参加者のセッションが存在する
                const session = {
                    webSocket: mockWebSocket,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                };
                chatRoom.sessions.set(mockWebSocket, session);

                const message = JSON.stringify({
                    type: "message",
                    content: "Hello, World!",
                });

                // When: メッセージを受信
                await chatRoom.webSocketMessage(mockWebSocket, message);

                // Then: メッセージがストレージに保存される
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

                // Then: WebSocketにブロードキャストされる
                expect(mockWebSocket.send).toHaveBeenCalledWith(expect.stringContaining('"type":"message"'));
            });

            test("type: typing - 他の参加者にのみブロードキャストする", async () => {
                // Given: 複数の参加者がいる
                const sender = mockWebSocket;
                const receiver = new MockWebSocket() as unknown as CFWebSocket;

                chatRoom.sessions.set(sender, {
                    webSocket: sender,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                });
                chatRoom.sessions.set(receiver, {
                    webSocket: receiver,
                    participantId: "user2",
                    participantName: "Bob",
                    joinedAt: new Date(),
                });

                const message = JSON.stringify({
                    type: "typing",
                });

                // When: typingメッセージを受信
                await chatRoom.webSocketMessage(sender, message);

                // Then: 送信者以外にブロードキャストされる
                expect((sender as any).send).not.toHaveBeenCalled();
                expect((receiver as any).send).toHaveBeenCalledWith(expect.stringContaining('"type":"typing"'));
            });

            test("type: read - 全参加者にブロードキャストする", async () => {
                // Given: 参加者のセッションが存在する
                const session = {
                    webSocket: mockWebSocket,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                };
                chatRoom.sessions.set(mockWebSocket, session);

                const message = JSON.stringify({
                    type: "read",
                    messageId: "msg1",
                });

                // When: readメッセージを受信
                await chatRoom.webSocketMessage(mockWebSocket, message);

                // Then: 全参加者にブロードキャストされる
                expect(mockWebSocket.send).toHaveBeenCalledWith(expect.stringContaining('"type":"read"'));
                expect(mockWebSocket.send).toHaveBeenCalledWith(expect.stringContaining('"messageId":"msg1"'));
            });

            test("ArrayBuffer形式のメッセージを処理できる", async () => {
                // Given: 参加者のセッションが存在する
                const session = {
                    webSocket: mockWebSocket,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                };
                chatRoom.sessions.set(mockWebSocket, session);

                const messageObj = { type: "message", content: "Hello" };
                const messageBuffer = new TextEncoder().encode(JSON.stringify(messageObj));

                // When: ArrayBuffer形式のメッセージを受信
                await chatRoom.webSocketMessage(mockWebSocket, messageBuffer);

                // Then: メッセージが正常に処理される
                expect(mockState.storage.put).toHaveBeenCalled();
                expect(mockWebSocket.send).toHaveBeenCalled();
            });
        });

        describe("異常系", () => {
            test("無効なJSONはエラーを返す", async () => {
                // Given: 参加者のセッションが存在する
                const session = {
                    webSocket: mockWebSocket,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                };
                chatRoom.sessions.set(mockWebSocket, session);

                const invalidMessage = "{ invalid json";

                // When: 無効なJSONメッセージを受信
                await chatRoom.webSocketMessage(mockWebSocket, invalidMessage);

                // Then: エラーメッセージが送信される
                expect(mockWebSocket.send).toHaveBeenCalledWith(
                    JSON.stringify({ type: "error", message: "Invalid message format" }),
                );
            });

            test("セッションが存在しない場合は処理をスキップする", async () => {
                // Given: セッションが存在しない
                const message = JSON.stringify({ type: "message", content: "Hello" });

                // When: メッセージを受信
                await chatRoom.webSocketMessage(mockWebSocket, message);

                // Then: 何も処理されない
                expect(mockWebSocket.send).not.toHaveBeenCalled();
                expect(mockState.storage.put).not.toHaveBeenCalled();
            });
        });

        describe("エッジケース", () => {
            test("contentが空のmessageは保存されない", async () => {
                // Given: 参加者のセッションが存在する
                const session = {
                    webSocket: mockWebSocket,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                };
                chatRoom.sessions.set(mockWebSocket, session);

                const message = JSON.stringify({
                    type: "message",
                    content: "",
                });

                // When: 空のcontentのメッセージを受信
                await chatRoom.webSocketMessage(mockWebSocket, message);

                // Then: メッセージは保存されない（contentがfalsyのため）
                expect(mockState.storage.put).not.toHaveBeenCalled();
            });

            test("messageIdがないreadメッセージは処理されない", async () => {
                // Given: 参加者のセッションが存在する
                const session = {
                    webSocket: mockWebSocket,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                };
                chatRoom.sessions.set(mockWebSocket, session);

                const message = JSON.stringify({
                    type: "read",
                });

                // When: messageIdがないreadメッセージを受信
                await chatRoom.webSocketMessage(mockWebSocket, message);

                // Then: ブロードキャストされない
                expect(mockWebSocket.send).not.toHaveBeenCalled();
            });
        });
    });

    describe("webSocketClose", () => {
        describe("正常系", () => {
            test("leaveをブロードキャストしてセッションを削除する", async () => {
                // Given: 複数の参加者がいる
                const closingWs = mockWebSocket;
                const remainingWs = new MockWebSocket() as unknown as CFWebSocket;

                chatRoom.sessions.set(closingWs, {
                    webSocket: closingWs,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                });
                chatRoom.sessions.set(remainingWs, {
                    webSocket: remainingWs,
                    participantId: "user2",
                    participantName: "Bob",
                    joinedAt: new Date(),
                });

                // When: WebSocket接続が閉じられる
                await chatRoom.webSocketClose(closingWs, 1000, "Normal closure");

                // Then: leaveがブロードキャストされる
                expect((remainingWs as any).send).toHaveBeenCalledWith(expect.stringContaining('"type":"leave"'));
                expect((remainingWs as any).send).toHaveBeenCalledWith(
                    expect.stringContaining('"participantId":"user1"'),
                );

                // Then: セッションが削除される
                expect(chatRoom.sessions.has(closingWs)).toBe(false);
                expect(chatRoom.sessions.has(remainingWs)).toBe(true);
            });
        });

        describe("エッジケース", () => {
            test("セッションが存在しない場合は何もしない", async () => {
                // Given: セッションが存在しない
                // When: WebSocket接続が閉じられる
                await chatRoom.webSocketClose(mockWebSocket, 1000, "Normal closure");

                // Then: 何も処理されない（エラーにならない）
                expect(mockWebSocket.send).not.toHaveBeenCalled();
            });
        });
    });

    describe("webSocketError", () => {
        describe("正常系", () => {
            test("セッションを削除する", async () => {
                // Given: 参加者のセッションが存在する
                const session = {
                    webSocket: mockWebSocket,
                    participantId: "user1",
                    participantName: "Alice",
                    joinedAt: new Date(),
                };
                chatRoom.sessions.set(mockWebSocket, session);

                const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

                // When: WebSocketエラーが発生
                await chatRoom.webSocketError(mockWebSocket, new Error("Connection error"));

                // Then: エラーログが出力される
                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    "WebSocket error for participant user1:",
                    expect.any(Error),
                );

                // Then: セッションが削除される
                expect(chatRoom.sessions.has(mockWebSocket)).toBe(false);

                consoleErrorSpy.mockRestore();
            });
        });

        describe("エッジケース", () => {
            test("セッションが存在しない場合は何もしない", async () => {
                // Given: セッションが存在しない
                const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

                // When: WebSocketエラーが発生
                await chatRoom.webSocketError(mockWebSocket, new Error("Connection error"));

                // Then: エラーログは出力されない
                expect(consoleErrorSpy).not.toHaveBeenCalled();

                consoleErrorSpy.mockRestore();
            });
        });
    });

    describe("メッセージストレージ", () => {
        describe("境界値", () => {
            test("1000件を超えるメッセージは古いものから削除される", async () => {
                // Given: 1000件のメッセージが既に存在する
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
                chatRoom.sessions.set(mockWebSocket, session);

                // When: 新しいメッセージを追加
                const message = JSON.stringify({
                    type: "message",
                    content: "New message",
                });
                await chatRoom.webSocketMessage(mockWebSocket, message);

                // Then: 最古のメッセージが削除され、最新1000件が保持される
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
                expect(savedMessages[0].id).toBe("msg1"); // msg0が削除されている
            });
        });
    });
});
