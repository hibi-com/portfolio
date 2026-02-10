import { describe, expect, test, vi } from "vitest";
import type { EmailLog, EmailRepository } from "~/domain/email";
import { GetEmailLogByIdUseCase } from "./getEmailLogById";

describe("GetEmailLogByIdUseCase", () => {
    const mockEmailLog: EmailLog = {
        id: "log-1",
        templateId: "template-1",
        customerId: "customer-1",
        toEmail: "test@example.com",
        subject: "Test Email",
        htmlBody: "<p>Test</p>",
        textBody: "Test",
        status: "SENT",
        resendId: "resend-123",
        errorMessage: null,
        sentAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const createMockRepository = (overrides: Partial<EmailRepository> = {}): EmailRepository => ({
        findAllLogs: vi.fn().mockResolvedValue([]),
        findLogById: vi.fn().mockResolvedValue(mockEmailLog),
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
            test("IDでメールログを取得できる", async () => {
                // Given: メールログID
                const logId = "log-1";

                const mockRepository = createMockRepository({
                    findLogById: vi.fn().mockResolvedValue(mockEmailLog),
                });

                const useCase = new GetEmailLogByIdUseCase(mockRepository);

                // When: メールログを取得
                const result = await useCase.execute(logId);

                // Then: メールログが返される
                expect(result).toEqual(mockEmailLog);
                expect(result?.status).toBe("SENT");
                expect(result?.toEmail).toBe("test@example.com");
                expect(mockRepository.findLogById).toHaveBeenCalledWith(logId);
                expect(mockRepository.findLogById).toHaveBeenCalledTimes(1);
            });
        });

        describe("異常系", () => {
            test("存在しないIDの場合はnullを返す", async () => {
                // Given: 存在しないメールログID
                const logId = "non-existent";

                const mockRepository = createMockRepository({
                    findLogById: vi.fn().mockResolvedValue(null),
                });

                const useCase = new GetEmailLogByIdUseCase(mockRepository);

                // When: メールログを取得
                const result = await useCase.execute(logId);

                // Then: nullが返される
                expect(result).toBeNull();
                expect(mockRepository.findLogById).toHaveBeenCalledWith(logId);
            });
        });
    });
});
