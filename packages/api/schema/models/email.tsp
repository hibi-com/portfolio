import "@typespec/http";
import "@typespec/openapi3";

enum EmailStatus {
    PENDING,
    SENT,
    DELIVERED,
    BOUNCED,
    FAILED,
}

enum EmailTemplateCategory {
    MARKETING,
    TRANSACTIONAL,
    SUPPORT,
    NOTIFICATION,
}

model EmailLog {
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
    sentAt?: string;
    deliveredAt?: string;
    openedAt?: string;
    clickedAt?: string;
    bouncedAt?: string;
    metadata?: Record<unknown>;
    createdAt: string;
    updatedAt: string;
}

model EmailTemplate {
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
    createdAt: string;
    updatedAt: string;
}

model SendEmailInput {
    customerId?: string;
    templateId?: string;
    fromEmail?: string;
    toEmail: string;
    ccEmail?: string;
    bccEmail?: string;
    subject: string;
    htmlContent?: string;
    textContent?: string;
    variables?: Record<string>;
    metadata?: Record<unknown>;
}

model CreateEmailTemplateInput {
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

model UpdateEmailTemplateInput {
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
