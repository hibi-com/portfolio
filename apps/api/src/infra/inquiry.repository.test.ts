import { beforeEach, describe, expect, test, vi } from "vitest";
import type { InquiryCategory, InquiryPriority, InquiryStatus } from "~/domain/inquiry";
import { InquiryRepositoryImpl } from "./inquiry.repository";

const mockPrismaClient = {
	inquiry: {
		findMany: vi.fn(),
		findUnique: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
	inquiryResponse: {
		findMany: vi.fn(),
		create: vi.fn(),
	},
};

vi.mock("@portfolio/db", () => ({
	createPrismaClient: () => mockPrismaClient,
}));

describe("InquiryRepositoryImpl", () => {
	let repository: InquiryRepositoryImpl;

	beforeEach(() => {
		vi.clearAllMocks();
		repository = new InquiryRepositoryImpl();
	});

	const mockInquiryData = {
		id: "inquiry-uuid-1",
		customerId: "customer-uuid-1",
		assigneeId: "user-uuid-1",
		subject: "Test Inquiry",
		content: "Test Content",
		status: "OPEN" as InquiryStatus,
		priority: "HIGH" as InquiryPriority,
		category: "TECHNICAL" as InquiryCategory,
		tags: '["bug", "urgent"]',
		source: "email",
		metadata: '{"key": "value"}',
		resolvedAt: null,
		closedAt: null,
		createdAt: new Date("2025-01-01T00:00:00Z"),
		updatedAt: new Date("2025-01-01T00:00:00Z"),
	};

	const mockResponseData = {
		id: "response-uuid-1",
		inquiryId: "inquiry-uuid-1",
		userId: "user-uuid-1",
		content: "Response Content",
		isInternal: false,
		attachments: '["file1.pdf"]',
		createdAt: new Date("2025-01-01T01:00:00Z"),
		updatedAt: new Date("2025-01-01T01:00:00Z"),
	};

	describe("findAll", () => {
		describe("正常系", () => {
			test("全問い合わせを取得できる", async () => {
				// Given: 問い合わせが存在する場合
				mockPrismaClient.inquiry.findMany.mockResolvedValue([mockInquiryData]);

				// When: 全問い合わせを取得
				const result = await repository.findAll();

				// Then: 問い合わせが返却される
				expect(result).toHaveLength(1);
				expect(result[0]?.id).toBe("inquiry-uuid-1");
				expect(result[0]?.tags).toEqual(["bug", "urgent"]);
				expect(mockPrismaClient.inquiry.findMany).toHaveBeenCalledWith({
					orderBy: { createdAt: "desc" },
				});
			});
		});

		describe("エッジケース", () => {
			test("問い合わせが存在しない場合は空配列を返す", async () => {
				// Given: 問い合わせが存在しない場合
				mockPrismaClient.inquiry.findMany.mockResolvedValue([]);

				// When: 全問い合わせを取得
				const result = await repository.findAll();

				// Then: 空配列が返却される
				expect(result).toHaveLength(0);
			});
		});
	});

	describe("findById", () => {
		describe("正常系", () => {
			test("IDで問い合わせを取得できる", async () => {
				// Given: 問い合わせが存在する場合
				mockPrismaClient.inquiry.findUnique.mockResolvedValue(mockInquiryData);

				// When: IDで問い合わせを取得
				const result = await repository.findById("inquiry-uuid-1");

				// Then: 問い合わせが返却される
				expect(result).not.toBeNull();
				expect(result?.id).toBe("inquiry-uuid-1");
				expect(mockPrismaClient.inquiry.findUnique).toHaveBeenCalledWith({
					where: { id: "inquiry-uuid-1" },
				});
			});
		});

		describe("異常系", () => {
			test("存在しないIDの場合はnullを返す", async () => {
				// Given: 問い合わせが存在しない場合
				mockPrismaClient.inquiry.findUnique.mockResolvedValue(null);

				// When: IDで問い合わせを取得
				const result = await repository.findById("non-existent");

				// Then: nullが返却される
				expect(result).toBeNull();
			});
		});
	});

	describe("findByCustomerId", () => {
		describe("正常系", () => {
			test("顧客IDで問い合わせを取得できる", async () => {
				// Given: 顧客に紐づく問い合わせが存在する場合
				mockPrismaClient.inquiry.findMany.mockResolvedValue([mockInquiryData]);

				// When: 顧客IDで問い合わせを取得
				const result = await repository.findByCustomerId("customer-uuid-1");

				// Then: 問い合わせが返却される
				expect(result).toHaveLength(1);
				expect(result[0]?.customerId).toBe("customer-uuid-1");
				expect(mockPrismaClient.inquiry.findMany).toHaveBeenCalledWith({
					where: { customerId: "customer-uuid-1" },
					orderBy: { createdAt: "desc" },
				});
			});
		});
	});

	describe("findByAssigneeId", () => {
		describe("正常系", () => {
			test("担当者IDで問い合わせを取得できる", async () => {
				// Given: 担当者に紐づく問い合わせが存在する場合
				mockPrismaClient.inquiry.findMany.mockResolvedValue([mockInquiryData]);

				// When: 担当者IDで問い合わせを取得
				const result = await repository.findByAssigneeId("user-uuid-1");

				// Then: 問い合わせが返却される
				expect(result).toHaveLength(1);
				expect(result[0]?.assigneeId).toBe("user-uuid-1");
				expect(mockPrismaClient.inquiry.findMany).toHaveBeenCalledWith({
					where: { assigneeId: "user-uuid-1" },
					orderBy: { createdAt: "desc" },
				});
			});
		});
	});

	describe("findByStatus", () => {
		describe("正常系", () => {
			test("ステータスで問い合わせを取得できる", async () => {
				// Given: 指定ステータスの問い合わせが存在する場合
				mockPrismaClient.inquiry.findMany.mockResolvedValue([mockInquiryData]);

				// When: ステータスで問い合わせを取得
				const result = await repository.findByStatus("OPEN");

				// Then: 問い合わせが返却される
				expect(result).toHaveLength(1);
				expect(result[0]?.status).toBe("OPEN");
				expect(mockPrismaClient.inquiry.findMany).toHaveBeenCalledWith({
					where: { status: "OPEN" },
					orderBy: { createdAt: "desc" },
				});
			});
		});
	});

	describe("create", () => {
		describe("正常系", () => {
			test("新しい問い合わせを作成できる", async () => {
				// Given: 作成用データ
				const createData = {
					subject: "New Inquiry",
					content: "New Content",
				};
				mockPrismaClient.inquiry.create.mockResolvedValue({
					...mockInquiryData,
					...createData,
					id: "new-inquiry-uuid",
				});

				// When: 問い合わせを作成
				const result = await repository.create(createData);

				// Then: 問い合わせが作成される
				expect(result.id).toBe("new-inquiry-uuid");
				expect(result.subject).toBe("New Inquiry");
				expect(mockPrismaClient.inquiry.create).toHaveBeenCalledWith({
					data: expect.objectContaining({
						subject: "New Inquiry",
						content: "New Content",
						status: "OPEN",
						priority: "MEDIUM",
						category: "GENERAL",
					}),
				});
			});
		});
	});

	describe("update", () => {
		describe("正常系", () => {
			test("問い合わせを更新できる", async () => {
				// Given: 更新用データ
				const updateData = { status: "IN_PROGRESS" as InquiryStatus };
				mockPrismaClient.inquiry.update.mockResolvedValue({
					...mockInquiryData,
					...updateData,
				});

				// When: 問い合わせを更新
				const result = await repository.update("inquiry-uuid-1", updateData);

				// Then: 問い合わせが更新される
				expect(result.status).toBe("IN_PROGRESS");
				expect(mockPrismaClient.inquiry.update).toHaveBeenCalledWith({
					where: { id: "inquiry-uuid-1" },
					data: expect.objectContaining({
						status: "IN_PROGRESS",
					}),
				});
			});
		});
	});

	describe("delete", () => {
		describe("正常系", () => {
			test("問い合わせを削除できる", async () => {
				// Given: 問い合わせが存在する場合
				mockPrismaClient.inquiry.delete.mockResolvedValue(mockInquiryData);

				// When: 問い合わせを削除
				await repository.delete("inquiry-uuid-1");

				// Then: 削除が実行される
				expect(mockPrismaClient.inquiry.delete).toHaveBeenCalledWith({
					where: { id: "inquiry-uuid-1" },
				});
			});
		});
	});

	describe("resolve", () => {
		describe("正常系", () => {
			test("問い合わせを解決済みにできる", async () => {
				// Given: 問い合わせが存在する場合
				mockPrismaClient.inquiry.update.mockResolvedValue({
					...mockInquiryData,
					status: "RESOLVED",
					resolvedAt: new Date("2025-01-02T00:00:00Z"),
				});

				// When: 問い合わせを解決
				const result = await repository.resolve("inquiry-uuid-1");

				// Then: 解決済みステータスになる
				expect(result.status).toBe("RESOLVED");
				expect(result.resolvedAt).toBeDefined();
				expect(mockPrismaClient.inquiry.update).toHaveBeenCalledWith({
					where: { id: "inquiry-uuid-1" },
					data: {
						status: "RESOLVED",
						resolvedAt: expect.any(Date),
					},
				});
			});
		});
	});

	describe("close", () => {
		describe("正常系", () => {
			test("問い合わせをクローズできる", async () => {
				// Given: 問い合わせが存在する場合
				mockPrismaClient.inquiry.update.mockResolvedValue({
					...mockInquiryData,
					status: "CLOSED",
					closedAt: new Date("2025-01-02T00:00:00Z"),
				});

				// When: 問い合わせをクローズ
				const result = await repository.close("inquiry-uuid-1");

				// Then: クローズ済みステータスになる
				expect(result.status).toBe("CLOSED");
				expect(result.closedAt).toBeDefined();
				expect(mockPrismaClient.inquiry.update).toHaveBeenCalledWith({
					where: { id: "inquiry-uuid-1" },
					data: {
						status: "CLOSED",
						closedAt: expect.any(Date),
					},
				});
			});
		});
	});

	describe("addResponse", () => {
		describe("正常系", () => {
			test("問い合わせへの返信を追加できる", async () => {
				// Given: 返信用データ
				const responseData = {
					inquiryId: "inquiry-uuid-1",
					content: "Thank you for your inquiry",
				};
				mockPrismaClient.inquiryResponse.create.mockResolvedValue(mockResponseData);

				// When: 返信を追加
				const result = await repository.addResponse(responseData);

				// Then: 返信が作成される
				expect(result.id).toBe("response-uuid-1");
				expect(result.content).toBe("Response Content");
				expect(mockPrismaClient.inquiryResponse.create).toHaveBeenCalledWith({
					data: expect.objectContaining({
						inquiryId: "inquiry-uuid-1",
						content: "Thank you for your inquiry",
						isInternal: false,
					}),
				});
			});
		});
	});

	describe("getResponses", () => {
		describe("正常系", () => {
			test("問い合わせへの返信一覧を取得できる", async () => {
				// Given: 返信が存在する場合
				mockPrismaClient.inquiryResponse.findMany.mockResolvedValue([mockResponseData]);

				// When: 返信一覧を取得
				const result = await repository.getResponses("inquiry-uuid-1");

				// Then: 返信一覧が返却される
				expect(result).toHaveLength(1);
				expect(result[0]?.id).toBe("response-uuid-1");
				expect(result[0]?.attachments).toEqual(["file1.pdf"]);
				expect(mockPrismaClient.inquiryResponse.findMany).toHaveBeenCalledWith({
					where: { inquiryId: "inquiry-uuid-1" },
					orderBy: { createdAt: "asc" },
				});
			});
		});
	});
});
