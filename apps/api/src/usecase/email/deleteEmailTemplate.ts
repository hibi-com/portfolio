import type { EmailRepository } from "~/domain/email";

export class DeleteEmailTemplateUseCase {
    constructor(private readonly emailRepository: EmailRepository) {}

    async execute(id: string): Promise<void> {
        return this.emailRepository.deleteTemplate(id);
    }
}
