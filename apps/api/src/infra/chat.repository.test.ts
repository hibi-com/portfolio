import { beforeEach, describe, expect, test, vi } from "vitest";
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
				// Given: チャットルームが存在する場合
				mockPrismaClient.chatRoom.findMany.mockResolvedValue([mockRoomData]);

				// When: 全ルームを取得
				const result = await repository.findAllRooms();

				// Then: ルームが返却される
				expect(result).toHaveLength(1);
				expect(result[0]?.id).toBe("room-uuid-1");
				expect(result[0]?.metadata).toEqual({ key: "value" });
			});
		});
	});

	describe("findRoomById", () => {
		describe("正常系", () => {
			test("IDで参加者付きチャットルームを取得できる", async () => {
				// Given: チャットルームと参加者が存在する場合
				mockPrismaClient.chatRoom.findUnique.mockResolvedValue({
					...mockRoomData,
					participants: [mockParticipantData],
				});

				// When: IDでルームを取得
				const result = await repository.findRoomById("room-uuid-1");

				// Then: ルームと参加者が返却される
				expect(result).not.toBeNull();
				expect(result?.id).toBe("room-uuid-1");
				expect(result?.participants).toHaveLength(1);
				expect(result?.participants[0]?.name).toBe("John Doe");
			});
		});

		describe("異常系", () => {
			test("存在しないIDの場合はnullを返す", async () => {
				// Given: ルームが存在しない場合
				mockPrismaClient.chatRoom.findUnique.mockResolvedValue(null);

				// When: IDでルームを取得
				const result = await repository.findRoomById("non-existent");

				// Then: nullが返却される
				expect(result).toBeNull();
			});
		});
	});

	describe("findRoomsByCustomerId", () => {
		describe("正常系", () => {
			test("顧客IDでチャットルームを取得できる", async () => {
				// Given: 顧客に紐づくルームが存在する場合
				mockPrismaClient.chatRoom.findMany.mockResolvedValue([mockRoomData]);

				// When: 顧客IDでルームを取得
				const result = await repository.findRoomsByCustomerId("customer-uuid-1");

				// Then: ルームが返却される
				expect(result).toHaveLength(1);
				expect(result[0]?.customerId).toBe("customer-uuid-1");
			});
		});
	});

	describe("createRoom", () => {
		describe("正常系", () => {
			test("新しいチャットルームを作成できる", async () => {
				// Given: 作成用データ
				const createData = {
					customerId: "customer-uuid-1",
					name: "New Chat",
				};
				mockPrismaClient.chatRoom.create.mockResolvedValue({
					...mockRoomData,
					...createData,
					id: "new-room-uuid",
				});

				// When: ルームを作成
				const result = await repository.createRoom(createData);

				// Then: ルームが作成される
				expect(result.id).toBe("new-room-uuid");
				expect(result.name).toBe("New Chat");
			});
		});
	});

	describe("updateRoomStatus", () => {
		describe("正常系", () => {
			test("ルームのステータスを更新できる", async () => {
				// Given: ルームが存在する場合
				mockPrismaClient.chatRoom.update.mockResolvedValue({
					...mockRoomData,
					status: "CLOSED",
				});

				// When: ステータスを更新
				const result = await repository.updateRoomStatus("room-uuid-1", "CLOSED");

				// Then: ステータスが更新される
				expect(result.status).toBe("CLOSED");
			});
		});
	});

	describe("closeRoom", () => {
		describe("正常系", () => {
			test("ルームをクローズできる", async () => {
				// Given: ルームが存在する場合
				mockPrismaClient.chatRoom.update.mockResolvedValue({
					...mockRoomData,
					status: "CLOSED",
					closedAt: new Date("2025-01-02T00:00:00Z"),
				});

				// When: ルームをクローズ
				const result = await repository.closeRoom("room-uuid-1");

				// Then: クローズ済みステータスになる
				expect(result.status).toBe("CLOSED");
				expect(result.closedAt).toBeDefined();
			});
		});
	});

	describe("addParticipant", () => {
		describe("正常系", () => {
			test("参加者を追加できる", async () => {
				// Given: 参加者追加用データ
				const addData = {
					chatRoomId: "room-uuid-1",
					name: "Jane Doe",
				};
				mockPrismaClient.chatParticipant.create.mockResolvedValue({
					...mockParticipantData,
					...addData,
					id: "new-participant-uuid",
				});

				// When: 参加者を追加
				const result = await repository.addParticipant(addData);

				// Then: 参加者が追加される
				expect(result.id).toBe("new-participant-uuid");
				expect(result.name).toBe("Jane Doe");
			});
		});
	});

	describe("updateParticipantOnlineStatus", () => {
		describe("正常系", () => {
			test("参加者のオンラインステータスを更新できる", async () => {
				// Given: 参加者が存在する場合
				mockPrismaClient.chatParticipant.update.mockResolvedValue({
					...mockParticipantData,
					isOnline: false,
					lastSeenAt: new Date("2025-01-01T02:00:00Z"),
				});

				// When: オンラインステータスを更新
				const result = await repository.updateParticipantOnlineStatus("participant-uuid-1", false);

				// Then: ステータスが更新される
				expect(result.isOnline).toBe(false);
				expect(result.lastSeenAt).toBeDefined();
			});
		});
	});

	describe("removeParticipant", () => {
		describe("正常系", () => {
			test("参加者を退出させることができる", async () => {
				// Given: 参加者が存在する場合
				mockPrismaClient.chatParticipant.update.mockResolvedValue({
					...mockParticipantData,
					leftAt: new Date("2025-01-02T00:00:00Z"),
				});

				// When: 参加者を退出させる
				await repository.removeParticipant("participant-uuid-1");

				// Then: 退出処理が実行される
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
				// Given: メッセージ作成用データ
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

				// When: メッセージを作成
				const result = await repository.createMessage(createData);

				// Then: メッセージが作成される
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
				// Given: メッセージが存在する場合
				mockPrismaClient.chatMessage.findMany.mockResolvedValue([mockMessageData]);

				// When: メッセージ履歴を取得
				const result = await repository.findMessagesByRoomId("room-uuid-1");

				// Then: メッセージが返却される
				expect(result).toHaveLength(1);
				expect(result[0]?.content).toBe("Hello, how can I help you?");
				expect(result[0]?.readBy).toEqual(["participant-uuid-2"]);
			});
		});
	});

	describe("markMessagesAsRead", () => {
		describe("正常系", () => {
			test("メッセージを既読にできる", async () => {
				// Given: メッセージが存在する場合
				mockPrismaClient.chatMessage.findUnique.mockResolvedValue(mockMessageData);
				mockPrismaClient.chatMessage.update.mockResolvedValue({
					...mockMessageData,
					readBy: '["participant-uuid-2", "participant-uuid-3"]',
				});

				// When: メッセージを既読にする
				await repository.markMessagesAsRead("room-uuid-1", "participant-uuid-3", ["message-uuid-1"]);

				// Then: 既読処理が実行される
				expect(mockPrismaClient.chatMessage.update).toHaveBeenCalledWith({
					where: { id: "message-uuid-1" },
					data: { readBy: expect.any(String) },
				});
			});
		});
	});
});
