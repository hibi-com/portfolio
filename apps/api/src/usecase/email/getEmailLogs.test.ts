import { describe, expect, test, vi } from "vitest";
import type { EmailLog, EmailRepository } from "~/domain/email";
import { GetEmailLogsUseCase } from "./getEmailLogs";

describe("GetEmailLogsUseCase", () => {
    const mockEmailLogs: EmailLog[] = [
        {
            id: "log-1",
            templateId: "template-1",
            customerId: "customer-1",
            toEmail: "test1@example.com",
            subject: "Test Email 1",
            htmlBody: "<p>Test 1</p>",
            textBody: "Test 1",
            status: "SENT",
            resendId: "resend-123",
            errorMessage: null,
            sentAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "log-2",
            templateId: "template-2",
            customerId: "customer-2",
            toEmail: "test2@example.com",
            subject: "Test Email 2",
            htmlBody: "<p>Test 2</p>",
            textBody: "Test 2",
            status: "FAILED",
            resendId: null,
            errorMessage: "SMTP error",
            sentAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const createMockRepository = (overrides: Partial<EmailRepository> = {}): EmailRepository => ({
        findAllLogs: vi.fn().mockResolvedValue(mockEmailLogs),
        findLogById: vi.fn().mockResolvedValue(null),
        findLogsByCustomerId: vi.fn().mockResolvedValue([]),
        createLog: vi.fn().mockResolvedValue({} as any),
        updateLogStatus: vi.fn().mockResolvedValue({} as any),
        findAllTemplates: vi.fn().mockResolvedValue([]),
        findTemplateById: vi.fn().mockResolvedValue(null),
        findTemplateBySlug: vi.fn().mockResolvedValue(null),
        createTemplate: vi.fn().mockResolvedValue({} as any),
        updateTemplate: vi.fn().mockResolvedValue({} as any),
        deleteTemplate: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("全メールログを取得できる", async () => {
                // Given: モックリポジトリ
                const mockRepository = createMockRepository({
                    findAllLogs: vi.fn().mockResolvedValue(mockEmailLogs),
                });

                const useCase = new GetEmailLogsUseCase(mockRepository);

                // When: メールログ一覧を取得
                const result = await useCase.execute();

                // Then: メールログ一覧が返される
                expect(result).toEqual(mockEmailLogs);
                expect(result).toHaveLength(2);
                expect(result[0].status).toBe("SENT");
                expect(result[1].status).toBe("FAILED");
                expect(mockRepository.findAllLogs).toHaveBeenCalledTimes(1);
            });
        });

        describe("エッジケース", () => {
            test("メールログが存在しない場合は空配列を返す", async () => {
                // Given: メールログなし
                const mockRepository = createMockRepository({
                    findAllLogs: vi.fn().mockResolvedValue([]),
                });

                const useCase = new GetEmailLogsUseCase(mockRepository);

                // When: メールログ一覧を取得
                const result = await useCase.execute();

                // Then: 空配列が返される
                expect(result).toEqual([]);
                expect(result).toHaveLength(0);
            });
        });
    });
});
