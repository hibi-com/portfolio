import type { EmailLog, EmailRepository } from "~/domain/email";

export class GetEmailLogByIdUseCase {
    constructor(private readonly emailRepository: EmailRepository) {}

    async execute(id: string): Promise<EmailLog | null> {
        return this.emailRepository.findLogById(id);
    }
}
