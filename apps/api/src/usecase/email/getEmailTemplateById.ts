import type { EmailRepository, EmailTemplate } from "~/domain/email";

export class GetEmailTemplateByIdUseCase {
    constructor(private readonly emailRepository: EmailRepository) {}

    async execute(id: string): Promise<EmailTemplate | null> {
        return this.emailRepository.findTemplateById(id);
    }
}
