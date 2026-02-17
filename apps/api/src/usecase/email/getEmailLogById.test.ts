import type { EmailLog, EmailRepository } from "~/domain/email";
import { GetEmailLogByIdUseCase } from "./getEmailLogById";

describe("GetEmailLogByIdUseCase", () => {
    const now = "2024-01-01T00:00:00.000Z";
    const mockEmailLog: EmailLog = {
        id: "log-1",
        fromEmail: "from@example.com",
        toEmail: "test@example.com",
        subject: "Test Email",
        status: "SENT",
        resendId: "resend-123",
        sentAt: now,
        createdAt: now,
        updatedAt: now,
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
                const logId = "log-1";

                const mockRepository = createMockRepository({
                    findLogById: vi.fn().mockResolvedValue(mockEmailLog),
                });

                const useCase = new GetEmailLogByIdUseCase(mockRepository);

                const result = await useCase.execute(logId);

                expect(result).toEqual(mockEmailLog);
                expect(result?.status).toBe("SENT");
                expect(result?.toEmail).toBe("test@example.com");
                expect(mockRepository.findLogById).toHaveBeenCalledWith(logId);
                expect(mockRepository.findLogById).toHaveBeenCalledTimes(1);
            });
        });

        describe("異常系", () => {
            test("存在しないIDの場合はnullを返す", async () => {
                const logId = "non-existent";

                const mockRepository = createMockRepository({
                    findLogById: vi.fn().mockResolvedValue(null),
                });

                const useCase = new GetEmailLogByIdUseCase(mockRepository);

                const result = await useCase.execute(logId);

                expect(result).toBeNull();
                expect(mockRepository.findLogById).toHaveBeenCalledWith(logId);
            });
        });
    });
});
