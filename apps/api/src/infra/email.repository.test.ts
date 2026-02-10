import { beforeEach, describe, expect, test, vi } from "vitest";
import type { EmailStatus, EmailTemplateCategory } from "~/domain/email";
import { EmailRepositoryImpl } from "./email.repository";

const mockPrismaClient = {
	emailLog: {
		findMany: vi.fn(),
		findUnique: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
	},
	emailTemplate: {
		findMany: vi.fn(),
		findUnique: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
};

vi.mock("@portfolio/db", () => ({
	createPrismaClient: () => mockPrismaClient,
}));

describe("EmailRepositoryImpl", () => {
	let repository: EmailRepositoryImpl;

	beforeEach(() => {
		vi.clearAllMocks();
		repository = new EmailRepositoryImpl();
	});

	const mockEmailLogData = {
		id: "log-uuid-1",
		customerId: "customer-uuid-1",
		templateId: "template-uuid-1",
		resendId: "resend-id-1",
		fromEmail: "from@example.com",
		toEmail: "to@example.com",
		ccEmail: "cc@example.com",
		bccEmail: "bcc@example.com",
		subject: "Test Subject",
		htmlContent: "<p>Test HTML</p>",
		textContent: "Test Text",
		status: "SENT" as EmailStatus,
		errorMessage: null,
		sentAt: new Date("2025-01-01T10:00:00Z"),
		deliveredAt: null,
		openedAt: null,
		clickedAt: null,
		bouncedAt: null,
		metadata: '{"key": "value"}',
		createdAt: new Date("2025-01-01T00:00:00Z"),
		updatedAt: new Date("2025-01-01T00:00:00Z"),
	};

	const mockEmailTemplateData = {
		id: "template-uuid-1",
		name: "Welcome Email",
		slug: "welcome-email",
		description: "Welcome email template",
		category: "TRANSACTIONAL" as EmailTemplateCategory,
		subject: "Welcome {{name}}",
		htmlContent: "<p>Welcome {{name}}</p>",
		textContent: "Welcome {{name}}",
		variables: '["name"]',
		isActive: true,
		createdAt: new Date("2025-01-01T00:00:00Z"),
		updatedAt: new Date("2025-01-01T00:00:00Z"),
	};

	describe("findAllLogs", () => {
		describe("正常系", () => {
			test("全メールログを取得できる", async () => {
				// Given: メールログがデータベースに存在する場合
				mockPrismaClient.emailLog.findMany.mockResolvedValue([mockEmailLogData]);

				// When: 全ログを取得
				const result = await repository.findAllLogs();

				// Then: ログが返却される
				expect(result).toHaveLength(1);
				expect(result[0]?.id).toBe("log-uuid-1");
				expect(result[0]?.status).toBe("SENT");
				expect(result[0]?.metadata).toEqual({ key: "value" });
				expect(mockPrismaClient.emailLog.findMany).toHaveBeenCalledWith({
					orderBy: { createdAt: "desc" },
				});
			});
		});

		describe("エッジケース", () => {
			test("ログが存在しない場合は空配列を返す", async () => {
				// Given: ログが存在しない場合
				mockPrismaClient.emailLog.findMany.mockResolvedValue([]);

				// When: 全ログを取得
				const result = await repository.findAllLogs();

				// Then: 空配列が返却される
				expect(result).toHaveLength(0);
			});
		});
	});

	describe("findLogById", () => {
		describe("正常系", () => {
			test("IDで特定のログを取得できる", async () => {
				// Given: 指定IDのログが存在する場合
				mockPrismaClient.emailLog.findUnique.mockResolvedValue(mockEmailLogData);

				// When: IDでログを取得
				const result = await repository.findLogById("log-uuid-1");

				// Then: ログが返却される
				expect(result).not.toBeNull();
				expect(result?.id).toBe("log-uuid-1");
				expect(mockPrismaClient.emailLog.findUnique).toHaveBeenCalledWith({
					where: { id: "log-uuid-1" },
				});
			});
		});

		describe("異常系", () => {
			test("存在しないIDの場合はnullを返す", async () => {
				// Given: ログが存在しない場合
				mockPrismaClient.emailLog.findUnique.mockResolvedValue(null);

				// When: IDでログを取得
				const result = await repository.findLogById("non-existent");

				// Then: nullが返却される
				expect(result).toBeNull();
			});
		});
	});

	describe("findLogsByCustomerId", () => {
		describe("正常系", () => {
			test("顧客IDで関連ログを取得できる", async () => {
				// Given: 顧客IDに紐づくログが存在する場合
				mockPrismaClient.emailLog.findMany.mockResolvedValue([mockEmailLogData]);

				// When: 顧客IDでログを取得
				const result = await repository.findLogsByCustomerId("customer-uuid-1");

				// Then: ログが返却される
				expect(result).toHaveLength(1);
				expect(result[0]?.customerId).toBe("customer-uuid-1");
				expect(mockPrismaClient.emailLog.findMany).toHaveBeenCalledWith({
					where: { customerId: "customer-uuid-1" },
					orderBy: { createdAt: "desc" },
				});
			});
		});
	});

	describe("createLog", () => {
		describe("正常系", () => {
			test("新しいメールログを作成できる", async () => {
				// Given: 作成用データ
				const createData = {
					customerId: "customer-uuid-1",
					templateId: "template-uuid-1",
					fromEmail: "from@example.com",
					toEmail: "to@example.com",
					subject: "Test",
					status: "PENDING" as EmailStatus,
				};
				mockPrismaClient.emailLog.create.mockResolvedValue({
					...mockEmailLogData,
					...createData,
					id: "new-log-uuid",
					htmlContent: null,
					textContent: null,
					metadata: null,
				});

				// When: ログを作成
				const result = await repository.createLog(createData);

				// Then: ログが作成される
				expect(result.id).toBe("new-log-uuid");
				expect(result.status).toBe("PENDING");
				expect(mockPrismaClient.emailLog.create).toHaveBeenCalledWith({
					data: expect.objectContaining({
						fromEmail: "from@example.com",
						toEmail: "to@example.com",
						status: "PENDING",
					}),
				});
			});
		});
	});

	describe("updateLogStatus", () => {
		describe("正常系", () => {
			test("ログのステータスを更新できる", async () => {
				// Given: ログが存在し、更新するステータス
				mockPrismaClient.emailLog.update.mockResolvedValue({
					...mockEmailLogData,
					status: "SENT",
					resendId: "resend-id-2",
				});

				// When: ステータスを更新
				const result = await repository.updateLogStatus("log-uuid-1", "SENT", {
					resendId: "resend-id-2",
					sentAt: new Date("2025-01-01T12:00:00Z"),
				});

				// Then: ステータスが更新される
				expect(result.status).toBe("SENT");
				expect(mockPrismaClient.emailLog.update).toHaveBeenCalledWith({
					where: { id: "log-uuid-1" },
					data: {
						status: "SENT",
						resendId: "resend-id-2",
						sentAt: expect.any(Date),
						errorMessage: undefined,
					},
				});
			});
		});
	});

	describe("findAllTemplates", () => {
		describe("正常系", () => {
			test("全テンプレートを取得できる", async () => {
				// Given: テンプレートが存在する場合
				mockPrismaClient.emailTemplate.findMany.mockResolvedValue([mockEmailTemplateData]);

				// When: 全テンプレートを取得
				const result = await repository.findAllTemplates();

				// Then: テンプレートが返却される
				expect(result).toHaveLength(1);
				expect(result[0]?.slug).toBe("welcome-email");
				expect(result[0]?.variables).toEqual(["name"]);
				expect(mockPrismaClient.emailTemplate.findMany).toHaveBeenCalledWith({
					orderBy: { createdAt: "desc" },
				});
			});
		});
	});

	describe("findTemplateById", () => {
		describe("正常系", () => {
			test("IDでテンプレートを取得できる", async () => {
				// Given: テンプレートが存在する場合
				mockPrismaClient.emailTemplate.findUnique.mockResolvedValue(mockEmailTemplateData);

				// When: IDでテンプレートを取得
				const result = await repository.findTemplateById("template-uuid-1");

				// Then: テンプレートが返却される
				expect(result).not.toBeNull();
				expect(result?.id).toBe("template-uuid-1");
			});
		});

		describe("異常系", () => {
			test("存在しないIDの場合はnullを返す", async () => {
				// Given: テンプレートが存在しない場合
				mockPrismaClient.emailTemplate.findUnique.mockResolvedValue(null);

				// When: IDでテンプレートを取得
				const result = await repository.findTemplateById("non-existent");

				// Then: nullが返却される
				expect(result).toBeNull();
			});
		});
	});

	describe("findTemplateBySlug", () => {
		describe("正常系", () => {
			test("slugでテンプレートを取得できる", async () => {
				// Given: テンプレートが存在する場合
				mockPrismaClient.emailTemplate.findUnique.mockResolvedValue(mockEmailTemplateData);

				// When: slugでテンプレートを取得
				const result = await repository.findTemplateBySlug("welcome-email");

				// Then: テンプレートが返却される
				expect(result).not.toBeNull();
				expect(result?.slug).toBe("welcome-email");
				expect(mockPrismaClient.emailTemplate.findUnique).toHaveBeenCalledWith({
					where: { slug: "welcome-email" },
				});
			});
		});
	});

	describe("createTemplate", () => {
		describe("正常系", () => {
			test("新しいテンプレートを作成できる", async () => {
				// Given: 作成用データ
				const createData = {
					name: "New Template",
					slug: "new-template",
					subject: "Test Subject",
					htmlContent: "<p>Test</p>",
				};
				mockPrismaClient.emailTemplate.create.mockResolvedValue({
					...mockEmailTemplateData,
					...createData,
					id: "new-template-uuid",
				});

				// When: テンプレートを作成
				const result = await repository.createTemplate(createData);

				// Then: テンプレートが作成される
				expect(result.id).toBe("new-template-uuid");
				expect(result.slug).toBe("new-template");
				expect(mockPrismaClient.emailTemplate.create).toHaveBeenCalledWith({
					data: expect.objectContaining({
						name: "New Template",
						slug: "new-template",
					}),
				});
			});
		});
	});

	describe("updateTemplate", () => {
		describe("正常系", () => {
			test("テンプレートを更新できる", async () => {
				// Given: 更新用データ
				const updateData = { name: "Updated Template" };
				mockPrismaClient.emailTemplate.update.mockResolvedValue({
					...mockEmailTemplateData,
					...updateData,
				});

				// When: テンプレートを更新
				const result = await repository.updateTemplate("template-uuid-1", updateData);

				// Then: テンプレートが更新される
				expect(result.name).toBe("Updated Template");
				expect(mockPrismaClient.emailTemplate.update).toHaveBeenCalledWith({
					where: { id: "template-uuid-1" },
					data: expect.objectContaining({
						name: "Updated Template",
					}),
				});
			});
		});
	});

	describe("deleteTemplate", () => {
		describe("正常系", () => {
			test("テンプレートを削除できる", async () => {
				// Given: テンプレートが存在する場合
				mockPrismaClient.emailTemplate.delete.mockResolvedValue(mockEmailTemplateData);

				// When: テンプレートを削除
				await repository.deleteTemplate("template-uuid-1");

				// Then: 削除が実行される
				expect(mockPrismaClient.emailTemplate.delete).toHaveBeenCalledWith({
					where: { id: "template-uuid-1" },
				});
			});
		});
	});
});
