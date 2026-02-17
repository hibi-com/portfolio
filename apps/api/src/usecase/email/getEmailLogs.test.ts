import type { EmailLog, EmailRepository } from "~/domain/email";
import { GetEmailLogsUseCase } from "./getEmailLogs";

describe("GetEmailLogsUseCase", () => {
    const now = "2024-01-01T00:00:00.000Z";
    const mockEmailLogs: EmailLog[] = [
        {
            id: "log-1",
            fromEmail: "from@example.com",
            toEmail: "test1@example.com",
            subject: "Test Email 1",
            status: "SENT",
            resendId: "resend-123",
            sentAt: now,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: "log-2",
            fromEmail: "from@example.com",
            toEmail: "test2@example.com",
            subject: "Test Email 2",
            status: "FAILED",
            errorMessage: "SMTP error",
            createdAt: now,
            updatedAt: now,
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
                const mockRepository = createMockRepository({
                    findAllLogs: vi.fn().mockResolvedValue(mockEmailLogs),
                });

                const useCase = new GetEmailLogsUseCase(mockRepository);

                const result = await useCase.execute();

                expect(result).toEqual(mockEmailLogs);
                expect(result).toHaveLength(2);
                expect(result[0]?.status).toBe("SENT");
                expect(result[1]?.status).toBe("FAILED");
                expect(mockRepository.findAllLogs).toHaveBeenCalledTimes(1);
            });
        });

        describe("エッジケース", () => {
            test("メールログが存在しない場合は空配列を返す", async () => {
                const mockRepository = createMockRepository({
                    findAllLogs: vi.fn().mockResolvedValue([]),
                });

                const useCase = new GetEmailLogsUseCase(mockRepository);

                const result = await useCase.execute();

                expect(result).toEqual([]);
                expect(result).toHaveLength(0);
            });
        });
    });
});
