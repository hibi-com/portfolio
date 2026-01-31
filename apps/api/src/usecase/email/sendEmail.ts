import type { EmailLog, EmailService, SendEmailInput } from "~/domain/email";

export class SendEmailUseCase {
    constructor(private readonly emailService: EmailService) {}

    async execute(input: SendEmailInput): Promise<EmailLog> {
        return this.emailService.send(input);
    }
}
