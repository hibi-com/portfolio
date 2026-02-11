import { describe, expect, test, vi } from "vitest";
import type { CreateEmailTemplateInput, EmailRepository, EmailTemplate } from "~/domain/email";
import { CreateEmailTemplateUseCase } from "./createEmailTemplate";

describe("CreateEmailTemplateUseCase", () => {
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
        findTemplateById: vi.fn().mockResolvedValue(null),
        findTemplateBySlug: vi.fn().mockResolvedValue(null),
        createTemplate: vi.fn().mockResolvedValue(mockTemplate),
        updateTemplate: vi.fn().mockResolvedValue(mockTemplate),
        deleteTemplate: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("メールテンプレートを作成できる", async () => {
                const input: CreateEmailTemplateInput = {
                    name: "Welcome Email",
                    slug: "welcome-email",
                    subject: "Welcome to our service",
                    htmlContent: "<h1>Welcome!</h1>",
                    category: "MARKETING",
                    variables: ["name", "email"],
                };

                const mockRepository = createMockRepository({
                    createTemplate: vi.fn().mockResolvedValue(mockTemplate),
                });

                const useCase = new CreateEmailTemplateUseCase(mockRepository);

                const result = await useCase.execute(input);

                expect(result).toEqual(mockTemplate);
                expect(result.name).toBe("Welcome Email");
                expect(result.slug).toBe("welcome-email");
                expect(result.category).toBe("MARKETING");
                expect(mockRepository.createTemplate).toHaveBeenCalledWith(input);
                expect(mockRepository.createTemplate).toHaveBeenCalledTimes(1);
            });

            test("変数なしでテンプレートを作成できる", async () => {
                const input: CreateEmailTemplateInput = {
                    name: "Simple Email",
                    slug: "simple-email",
                    subject: "Simple subject",
                    htmlContent: "<p>Simple content</p>",
                    category: "TRANSACTIONAL",
                };

                const simpleTemplate: EmailTemplate = {
                    ...mockTemplate,
                    name: "Simple Email",
                    slug: "simple-email",
                    variables: [],
                    category: "TRANSACTIONAL",
                };

                const mockRepository = createMockRepository({
                    createTemplate: vi.fn().mockResolvedValue(simpleTemplate),
                });

                const useCase = new CreateEmailTemplateUseCase(mockRepository);

                const result = await useCase.execute(input);

                expect(result.variables).toEqual([]);
                expect(result.category).toBe("TRANSACTIONAL");
            });
        });
    });
});
