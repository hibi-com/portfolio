export type {
    CreateEmailTemplateInput,
    EmailLog,
    EmailStatus,
    EmailTemplate,
    EmailTemplateCategory,
    SendEmailInput,
    UpdateEmailTemplateInput,
} from "@portfolio/api/generated/zod";

import type {
    CreateEmailTemplateInput,
    EmailLog,
    EmailStatus,
    EmailTemplate,
    SendEmailInput,
    UpdateEmailTemplateInput,
} from "@portfolio/api/generated/zod";

export interface EmailRepository {
    findAllLogs(): Promise<EmailLog[]>;
    findLogById(id: string): Promise<EmailLog | null>;
    findLogsByCustomerId(customerId: string): Promise<EmailLog[]>;
    createLog(log: Omit<EmailLog, "id" | "createdAt" | "updatedAt">): Promise<EmailLog>;
    updateLogStatus(
        id: string,
        status: EmailStatus,
        details?: { resendId?: string; errorMessage?: string; sentAt?: Date },
    ): Promise<EmailLog>;

    findAllTemplates(): Promise<EmailTemplate[]>;
    findTemplateById(id: string): Promise<EmailTemplate | null>;
    findTemplateBySlug(slug: string): Promise<EmailTemplate | null>;
    createTemplate(input: CreateEmailTemplateInput): Promise<EmailTemplate>;
    updateTemplate(id: string, input: UpdateEmailTemplateInput): Promise<EmailTemplate>;
    deleteTemplate(id: string): Promise<void>;
}

export interface EmailService {
    send(input: SendEmailInput): Promise<EmailLog>;
    sendWithTemplate(
        templateSlug: string,
        toEmail: string,
        variables?: Record<string, string>,
        customerId?: string,
    ): Promise<EmailLog>;
}
