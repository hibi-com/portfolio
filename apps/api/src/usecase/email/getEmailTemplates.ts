import type { EmailRepository, EmailTemplate } from "~/domain/email";

export class GetEmailTemplatesUseCase {
    constructor(private readonly emailRepository: EmailRepository) {}

    async execute(): Promise<EmailTemplate[]> {
        return this.emailRepository.findAllTemplates();
    }
}
