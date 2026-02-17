import type {
    CreateEmailTemplateInput,
    EmailLog,
    EmailsListEmailLogs200,
    EmailsListEmailLogsParams,
    EmailsListEmailTemplatesParams,
    EmailsSendEmailWithTemplateParams,
    EmailTemplate,
    SendEmailInput,
    UpdateEmailTemplateInput,
} from "@generated/api.schemas";
import { getEmails } from "@generated/emails/emails";

const getClient = () => getEmails();

export const listEmailLogs = (params?: EmailsListEmailLogsParams): Promise<EmailsListEmailLogs200> => {
    return getClient().emailsListEmailLogs(params);
};

export const getEmailLogById = (id: string): Promise<EmailLog> => {
    return getClient().emailsGetEmailLogById(id);
};

export const sendEmail = (input: SendEmailInput): Promise<EmailLog> => {
    return getClient().emailsSendEmail(input);
};

export const listEmailTemplates = (params?: EmailsListEmailTemplatesParams): Promise<EmailTemplate[]> => {
    return getClient().emailsListEmailTemplates(params);
};

export const getEmailTemplateById = (id: string): Promise<EmailTemplate> => {
    return getClient().emailsGetEmailTemplateById(id);
};

export const getEmailTemplateBySlug = (slug: string): Promise<EmailTemplate> => {
    return getClient().emailsGetEmailTemplateBySlug(slug);
};

export const createEmailTemplate = (input: CreateEmailTemplateInput): Promise<EmailTemplate> => {
    return getClient().emailsCreateEmailTemplate(input);
};

export const updateEmailTemplate = (id: string, input: UpdateEmailTemplateInput): Promise<EmailTemplate> => {
    return getClient().emailsUpdateEmailTemplate(id, input);
};

export const deleteEmailTemplate = (id: string): Promise<void> => {
    return getClient().emailsDeleteEmailTemplate(id);
};

export const sendEmailWithTemplate = (
    params: EmailsSendEmailWithTemplateParams,
    body?: { variables?: Record<string, string> },
): Promise<EmailLog> => {
    return getClient().emailsSendEmailWithTemplate(params, body);
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
