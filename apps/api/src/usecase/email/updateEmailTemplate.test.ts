import { describe, expect, test, vi } from "vitest";
import type { EmailRepository, EmailTemplate, UpdateEmailTemplateInput } from "~/domain/email";
import { UpdateEmailTemplateUseCase } from "./updateEmailTemplate";

describe("UpdateEmailTemplateUseCase", () => {
    const mockTemplate: EmailTemplate = {
        id: "template-1",
        name: "Updated Email",
        slug: "welcome-email",
        subject: "Updated subject",
        htmlBody: "<h1>Updated!</h1>",
        textBody: "Updated!",
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
        findTemplateById: vi.fn().mockResolvedValue(null),
        findTemplateBySlug: vi.fn().mockResolvedValue(null),
        createTemplate: vi.fn().mockResolvedValue({} as any),
        updateTemplate: vi.fn().mockResolvedValue(mockTemplate),
        deleteTemplate: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("メールテンプレートを更新できる", async () => {
                // Given: テンプレートIDと更新データ
                const templateId = "template-1";
                const input: UpdateEmailTemplateInput = {
                    name: "Updated Email",
                    subject: "Updated subject",
                    htmlBody: "<h1>Updated!</h1>",
                };

                const mockRepository = createMockRepository({
                    updateTemplate: vi.fn().mockResolvedValue(mockTemplate),
                });

                const useCase = new UpdateEmailTemplateUseCase(mockRepository);

                // When: テンプレートを更新
                const result = await useCase.execute(templateId, input);

                // Then: テンプレートが更新される
                expect(result).toEqual(mockTemplate);
                expect(result.name).toBe("Updated Email");
                expect(result.subject).toBe("Updated subject");
                expect(mockRepository.updateTemplate).toHaveBeenCalledWith(templateId, input);
                expect(mockRepository.updateTemplate).toHaveBeenCalledTimes(1);
            });

            test("一部のフィールドのみ更新できる", async () => {
                // Given: 一部のフィールドのみの更新データ
                const templateId = "template-1";
                const input: UpdateEmailTemplateInput = {
                    subject: "New subject only",
                };

                const partiallyUpdated: EmailTemplate = {
                    ...mockTemplate,
                    subject: "New subject only",
                };

                const mockRepository = createMockRepository({
                    updateTemplate: vi.fn().mockResolvedValue(partiallyUpdated),
                });

                const useCase = new UpdateEmailTemplateUseCase(mockRepository);

                // When: 一部のフィールドを更新
                const result = await useCase.execute(templateId, input);

                // Then: 指定したフィールドのみが更新される
                expect(result.subject).toBe("New subject only");
                expect(result.name).toBe(mockTemplate.name);
            });

            test("テンプレートを非アクティブにできる", async () => {
                // Given: 非アクティブ化の更新データ
                const templateId = "template-1";
                const input: UpdateEmailTemplateInput = {
                    isActive: false,
                };

                const inactiveTemplate: EmailTemplate = {
                    ...mockTemplate,
                    isActive: false,
                };

                const mockRepository = createMockRepository({
                    updateTemplate: vi.fn().mockResolvedValue(inactiveTemplate),
                });

                const useCase = new UpdateEmailTemplateUseCase(mockRepository);

                // When: テンプレートを非アクティブ化
                const result = await useCase.execute(templateId, input);

                // Then: テンプレートが非アクティブになる
                expect(result.isActive).toBe(false);
            });
        });
    });
});
