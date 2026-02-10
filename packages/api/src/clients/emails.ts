import { getEmails } from "@generated/emails/emails";
import type {
    EmailLog,
    EmailTemplate,
    SendEmailInput,
    CreateEmailTemplateInput,
    UpdateEmailTemplateInput,
    EmailsListEmailLogsParams,
    EmailsListEmailLogs200,
    EmailsListEmailTemplatesParams,
    EmailsSendEmailWithTemplateParams,
} from "@generated/api.schemas";

const emailsClient = getEmails();

export const listEmailLogs = (params?: EmailsListEmailLogsParams): Promise<EmailsListEmailLogs200> => {
    return emailsClient.emailsListEmailLogs(params);
};

export const getEmailLogById = (id: string): Promise<EmailLog> => {
    return emailsClient.emailsGetEmailLogById(id);
};

export const sendEmail = (input: SendEmailInput): Promise<EmailLog> => {
    return emailsClient.emailsSendEmail(input);
};

export const listEmailTemplates = (params?: EmailsListEmailTemplatesParams): Promise<EmailTemplate[]> => {
    return emailsClient.emailsListEmailTemplates(params);
};

export const getEmailTemplateById = (id: string): Promise<EmailTemplate> => {
    return emailsClient.emailsGetEmailTemplateById(id);
};

export const getEmailTemplateBySlug = (slug: string): Promise<EmailTemplate> => {
    return emailsClient.emailsGetEmailTemplateBySlug(slug);
};

export const createEmailTemplate = (input: CreateEmailTemplateInput): Promise<EmailTemplate> => {
    return emailsClient.emailsCreateEmailTemplate(input);
};

export const updateEmailTemplate = (id: string, input: UpdateEmailTemplateInput): Promise<EmailTemplate> => {
    return emailsClient.emailsUpdateEmailTemplate(id, input);
};

export const deleteEmailTemplate = (id: string): Promise<void> => {
    return emailsClient.emailsDeleteEmailTemplate(id);
};

export const sendEmailWithTemplate = (
    params: EmailsSendEmailWithTemplateParams,
    body?: { variables?: Record<string, string> },
): Promise<EmailLog> => {
    return emailsClient.emailsSendEmailWithTemplate(params, body);
};

export const emails = {
    listLogs: listEmailLogs,
    getLogById: getEmailLogById,
    send: sendEmail,
    listTemplates: listEmailTemplates,
    getTemplateById: getEmailTemplateById,
    getTemplateBySlug: getEmailTemplateBySlug,
    createTemplate: createEmailTemplate,
    updateTemplate: updateEmailTemplate,
    deleteTemplate: deleteEmailTemplate,
    sendWithTemplate: sendEmailWithTemplate,
} as const;
