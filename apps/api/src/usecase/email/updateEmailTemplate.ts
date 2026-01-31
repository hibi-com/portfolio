import type { EmailRepository, EmailTemplate, UpdateEmailTemplateInput } from "~/domain/email";

export class UpdateEmailTemplateUseCase {
    constructor(private readonly emailRepository: EmailRepository) {}

    async execute(id: string, input: UpdateEmailTemplateInput): Promise<EmailTemplate> {
        return this.emailRepository.updateTemplate(id, input);
    }
}
