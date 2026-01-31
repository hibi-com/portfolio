import type { EmailLog, EmailRepository } from "~/domain/email";

export class GetEmailLogsUseCase {
    constructor(private readonly emailRepository: EmailRepository) {}

    async execute(): Promise<EmailLog[]> {
        return this.emailRepository.findAllLogs();
    }
}
