import type { EmailLog, EmailRepository, EmailService, SendEmailInput } from "~/domain/email";

interface ResendEmailResponse {
    id: string;
}

interface ResendErrorResponse {
    statusCode: number;
    message: string;
    name: string;
}

export class ResendEmailService implements EmailService {
    constructor(
        private readonly emailRepository: EmailRepository,
        private readonly resendApiKey: string,
        private readonly defaultFromEmail: string,
    ) {}

    private async sendToResend(input: {
        from: string;
        to: string;
        cc?: string;
        bcc?: string;
        subject: string;
        html?: string;
        text?: string;
    }): Promise<{ success: true; id: string } | { success: false; error: string }> {
        try {
            const response = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.resendApiKey}`,
                },
                body: JSON.stringify({
                    from: input.from,
                    to: input.to,
                    cc: input.cc,
                    bcc: input.bcc,
                    subject: input.subject,
                    html: input.html,
                    text: input.text,
                }),
            });

            if (!response.ok) {
                const errorData: ResendErrorResponse = await response.json();
                return { success: false, error: errorData.message || "Failed to send email" };
            }

            const data: ResendEmailResponse = await response.json();
            return { success: true, id: data.id };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
            };
        }
    }

    private replaceVariables(content: string, variables: Record<string, string>): string {
        let result = content;
        for (const [key, value] of Object.entries(variables)) {
            result = result.replaceAll(`{{${key}}}`, value);
        }
        return result;
    }

    async send(input: SendEmailInput): Promise<EmailLog> {
        const fromEmail = input.fromEmail || this.defaultFromEmail;

        const log = await this.emailRepository.createLog({
            customerId: input.customerId,
            templateId: input.templateId,
            fromEmail,
            toEmail: input.toEmail,
            ccEmail: input.ccEmail,
            bccEmail: input.bccEmail,
            subject: input.subject,
            htmlContent: input.htmlContent,
            textContent: input.textContent,
            status: "PENDING",
            metadata: input.metadata,
        });

        const result = await this.sendToResend({
            from: fromEmail,
            to: input.toEmail,
            cc: input.ccEmail,
            bcc: input.bccEmail,
            subject: input.subject,
            html: input.htmlContent,
            text: input.textContent,
        });

        if (result.success) {
            return this.emailRepository.updateLogStatus(log.id, "SENT", {
                resendId: result.id,
                sentAt: new Date(),
            });
        }

        return this.emailRepository.updateLogStatus(log.id, "FAILED", {
            errorMessage: result.error,
        });
    }

    async sendWithTemplate(
        templateSlug: string,
        toEmail: string,
        variables?: Record<string, string>,
        customerId?: string,
    ): Promise<EmailLog> {
        const template = await this.emailRepository.findTemplateBySlug(templateSlug);

        if (!template) {
            throw new Error(`Template not found: ${templateSlug}`);
        }

        if (!template.isActive) {
            throw new Error(`Template is not active: ${templateSlug}`);
        }

        const subject = variables ? this.replaceVariables(template.subject, variables) : template.subject;
        const htmlContent = variables ? this.replaceVariables(template.htmlContent, variables) : template.htmlContent;
        const textContent =
            template.textContent && variables
                ? this.replaceVariables(template.textContent, variables)
                : template.textContent;

        return this.send({
            customerId,
            templateId: template.id,
            toEmail,
            subject,
            htmlContent,
            textContent,
        });
    }
}
