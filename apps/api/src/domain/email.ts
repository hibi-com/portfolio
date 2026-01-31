export type EmailStatus = "PENDING" | "SENT" | "DELIVERED" | "BOUNCED" | "FAILED";
export type EmailTemplateCategory = "MARKETING" | "TRANSACTIONAL" | "SUPPORT" | "NOTIFICATION";

export interface EmailLog {
    id: string;
    customerId?: string;
    templateId?: string;
    resendId?: string;
    fromEmail: string;
    toEmail: string;
    ccEmail?: string;
    bccEmail?: string;
    subject: string;
    htmlContent?: string;
    textContent?: string;
    status: EmailStatus;
    errorMessage?: string;
    sentAt?: Date;
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    bouncedAt?: Date;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

export interface EmailTemplate {
    id: string;
    name: string;
    slug: string;
    description?: string;
    category: EmailTemplateCategory;
    subject: string;
    htmlContent: string;
    textContent?: string;
    variables?: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface SendEmailInput {
    customerId?: string;
    templateId?: string;
    fromEmail?: string;
    toEmail: string;
    ccEmail?: string;
    bccEmail?: string;
    subject: string;
    htmlContent?: string;
    textContent?: string;
    variables?: Record<string, string>;
    metadata?: Record<string, unknown>;
}

export interface CreateEmailTemplateInput {
    name: string;
    slug: string;
    description?: string;
    category?: EmailTemplateCategory;
    subject: string;
    htmlContent: string;
    textContent?: string;
    variables?: string[];
    isActive?: boolean;
}

export interface UpdateEmailTemplateInput {
    name?: string;
    slug?: string;
    description?: string;
    category?: EmailTemplateCategory;
    subject?: string;
    htmlContent?: string;
    textContent?: string;
    variables?: string[];
    isActive?: boolean;
}

export interface EmailRepository {
    findAllLogs(): Promise<EmailLog[]>;
    findLogById(id: string): Promise<EmailLog | null>;
    findLogsByCustomerId(customerId: string): Promise<EmailLog[]>;
    createLog(log: Omit<EmailLog, "id" | "createdAt" | "updatedAt">): Promise<EmailLog>;
    updateLogStatus(id: string, status: EmailStatus, details?: { resendId?: string; errorMessage?: string; sentAt?: Date }): Promise<EmailLog>;

    findAllTemplates(): Promise<EmailTemplate[]>;
    findTemplateById(id: string): Promise<EmailTemplate | null>;
    findTemplateBySlug(slug: string): Promise<EmailTemplate | null>;
    createTemplate(input: CreateEmailTemplateInput): Promise<EmailTemplate>;
    updateTemplate(id: string, input: UpdateEmailTemplateInput): Promise<EmailTemplate>;
    deleteTemplate(id: string): Promise<void>;
}

export interface EmailService {
    send(input: SendEmailInput): Promise<EmailLog>;
    sendWithTemplate(templateSlug: string, toEmail: string, variables?: Record<string, string>, customerId?: string): Promise<EmailLog>;
}
