import { describe, expect, test, vi } from "vitest";
import type { EmailRepository } from "~/domain/email";
import { DeleteEmailTemplateUseCase } from "./deleteEmailTemplate";

describe("DeleteEmailTemplateUseCase", () => {
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
        updateTemplate: vi.fn().mockResolvedValue({} as any),
        deleteTemplate: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("メールテンプレートを削除できる", async () => {
                // Given: テンプレートID
                const templateId = "template-1";

                const mockRepository = createMockRepository({
                    deleteTemplate: vi.fn().mockResolvedValue(undefined),
                });

                const useCase = new DeleteEmailTemplateUseCase(mockRepository);

                // When: テンプレートを削除
                await useCase.execute(templateId);

                // Then: 削除が実行される
                expect(mockRepository.deleteTemplate).toHaveBeenCalledWith(templateId);
                expect(mockRepository.deleteTemplate).toHaveBeenCalledTimes(1);
            });
        });
    });
});
