import type { EmailRepository, EmailTemplate } from "~/domain/email";
import { GetEmailTemplateByIdUseCase } from "./getEmailTemplateById";

describe("GetEmailTemplateByIdUseCase", () => {
    const now = "2024-01-01T00:00:00.000Z";
    const mockTemplate: EmailTemplate = {
        id: "template-1",
        name: "Welcome Email",
        slug: "welcome-email",
        subject: "Welcome to our service",
        htmlContent: "<h1>Welcome!</h1>",
        category: "MARKETING",
        variables: ["name", "email"],
        isActive: true,
        createdAt: now,
        updatedAt: now,
    };

    const createMockRepository = (overrides: Partial<EmailRepository> = {}): EmailRepository => ({
        findAllLogs: vi.fn().mockResolvedValue([]),
        findLogById: vi.fn().mockResolvedValue(null),
        findLogsByCustomerId: vi.fn().mockResolvedValue([]),
        createLog: vi.fn().mockResolvedValue({} as any),
        updateLogStatus: vi.fn().mockResolvedValue({} as any),
        findAllTemplates: vi.fn().mockResolvedValue([]),
        findTemplateById: vi.fn().mockResolvedValue(mockTemplate),
        findTemplateBySlug: vi.fn().mockResolvedValue(null),
        createTemplate: vi.fn().mockResolvedValue({} as any),
        updateTemplate: vi.fn().mockResolvedValue({} as any),
        deleteTemplate: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("IDでメールテンプレートを取得できる", async () => {
                const templateId = "template-1";

                const mockRepository = createMockRepository({
                    findTemplateById: vi.fn().mockResolvedValue(mockTemplate),
                });

                const useCase = new GetEmailTemplateByIdUseCase(mockRepository);

                const result = await useCase.execute(templateId);

                expect(result).toEqual(mockTemplate);
                expect(result?.name).toBe("Welcome Email");
                expect(result?.slug).toBe("welcome-email");
                expect(result?.category).toBe("MARKETING");
                expect(mockRepository.findTemplateById).toHaveBeenCalledWith(templateId);
                expect(mockRepository.findTemplateById).toHaveBeenCalledTimes(1);
            });
        });

        describe("異常系", () => {
            test("存在しないIDの場合はnullを返す", async () => {
                const templateId = "non-existent";

                const mockRepository = createMockRepository({
                    findTemplateById: vi.fn().mockResolvedValue(null),
                });

                const useCase = new GetEmailTemplateByIdUseCase(mockRepository);

                const result = await useCase.execute(templateId);

                expect(result).toBeNull();
                expect(mockRepository.findTemplateById).toHaveBeenCalledWith(templateId);
            });
        });
    });
});
