import type { CreateEmailTemplateInput, EmailRepository, EmailTemplate } from "~/domain/email";

export class CreateEmailTemplateUseCase {
    constructor(private readonly emailRepository: EmailRepository) {}

    async execute(input: CreateEmailTemplateInput): Promise<EmailTemplate> {
        return this.emailRepository.createTemplate(input);
    }
}
