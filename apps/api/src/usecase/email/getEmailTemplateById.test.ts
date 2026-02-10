import { describe, expect, test, vi } from "vitest";
import type { EmailRepository, EmailTemplate } from "~/domain/email";
import { GetEmailTemplateByIdUseCase } from "./getEmailTemplateById";

describe("GetEmailTemplateByIdUseCase", () => {
    const mockTemplate: EmailTemplate = {
        id: "template-1",
        name: "Welcome Email",
        slug: "welcome-email",
        subject: "Welcome to our service",
        htmlBody: "<h1>Welcome!</h1>",
        textBody: "Welcome!",
        category: "MARKETING",
        variables: ["name", "email"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
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
                // Given: テンプレートID
                const templateId = "template-1";

                const mockRepository = createMockRepository({
                    findTemplateById: vi.fn().mockResolvedValue(mockTemplate),
                });

                const useCase = new GetEmailTemplateByIdUseCase(mockRepository);

                // When: テンプレートを取得
                const result = await useCase.execute(templateId);

                // Then: テンプレートが返される
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
                // Given: 存在しないテンプレートID
                const templateId = "non-existent";

                const mockRepository = createMockRepository({
                    findTemplateById: vi.fn().mockResolvedValue(null),
                });

                const useCase = new GetEmailTemplateByIdUseCase(mockRepository);

                // When: テンプレートを取得
                const result = await useCase.execute(templateId);

                // Then: nullが返される
                expect(result).toBeNull();
                expect(mockRepository.findTemplateById).toHaveBeenCalledWith(templateId);
            });
        });
    });
});
