import type { EmailLog, EmailService } from "~/domain/email";

export class SendEmailWithTemplateUseCase {
    constructor(private readonly emailService: EmailService) {}

    async execute(
        templateSlug: string,
        toEmail: string,
        variables?: Record<string, string>,
        customerId?: string,
    ): Promise<EmailLog> {
        return this.emailService.sendWithTemplate(templateSlug, toEmail, variables, customerId);
    }
}
