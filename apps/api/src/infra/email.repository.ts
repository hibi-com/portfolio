import { createPrismaClient } from "@portfolio/db";
import type {
    CreateEmailTemplateInput,
    EmailLog,
    EmailRepository,
    EmailStatus,
    EmailTemplate,
    EmailTemplateCategory,
    UpdateEmailTemplateInput,
} from "~/domain/email";

function toDateString(d: Date | null | undefined): string | undefined {
    if (d == null) return undefined;
    return d instanceof Date ? d.toISOString() : String(d);
}

export class EmailRepositoryImpl implements EmailRepository {
    constructor(private readonly databaseUrl?: string) {}

    private mapToEmailLog(data: {
        id: string;
        customerId: string | null;
        templateId: string | null;
        resendId: string | null;
        fromEmail: string;
        toEmail: string;
        ccEmail: string | null;
        bccEmail: string | null;
        subject: string;
        htmlContent: string | null;
        textContent: string | null;
        status: string;
        errorMessage: string | null;
        sentAt: Date | null;
        deliveredAt: Date | null;
        openedAt: Date | null;
        clickedAt: Date | null;
        bouncedAt: Date | null;
        metadata: string | null;
        createdAt: Date;
        updatedAt: Date;
    }): EmailLog {
        return {
            id: data.id,
            customerId: data.customerId ?? undefined,
            templateId: data.templateId ?? undefined,
            resendId: data.resendId ?? undefined,
            fromEmail: data.fromEmail,
            toEmail: data.toEmail,
            ccEmail: data.ccEmail ?? undefined,
            bccEmail: data.bccEmail ?? undefined,
            subject: data.subject,
            htmlContent: data.htmlContent ?? undefined,
            textContent: data.textContent ?? undefined,
            status: data.status as EmailStatus,
            errorMessage: data.errorMessage ?? undefined,
            sentAt: toDateString(data.sentAt),
            deliveredAt: toDateString(data.deliveredAt),
            openedAt: toDateString(data.openedAt),
            clickedAt: toDateString(data.clickedAt),
            bouncedAt: toDateString(data.bouncedAt),
            metadata: data.metadata ? JSON.parse(data.metadata) : undefined,
            createdAt: toDateString(data.createdAt) ?? "",
            updatedAt: toDateString(data.updatedAt) ?? "",
        };
    }

    private mapToEmailTemplate(data: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        category: string;
        subject: string;
        htmlContent: string;
        textContent: string | null;
        variables: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }): EmailTemplate {
        return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description ?? undefined,
            category: data.category as EmailTemplateCategory,
            subject: data.subject,
            htmlContent: data.htmlContent,
            textContent: data.textContent ?? undefined,
            variables: data.variables ? JSON.parse(data.variables) : undefined,
            isActive: data.isActive,
            createdAt: toDateString(data.createdAt) ?? "",
            updatedAt: toDateString(data.updatedAt) ?? "",
        };
    }

    async findAllLogs(): Promise<EmailLog[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const logs = await prisma.emailLog.findMany({
            orderBy: { createdAt: "desc" },
        });

        return logs.map((log) => this.mapToEmailLog(log));
    }

    async findLogById(id: string): Promise<EmailLog | null> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const log = await prisma.emailLog.findUnique({
            where: { id },
        });

        if (!log) return null;

        return this.mapToEmailLog(log);
    }

    async findLogsByCustomerId(customerId: string): Promise<EmailLog[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const logs = await prisma.emailLog.findMany({
            where: { customerId },
            orderBy: { createdAt: "desc" },
        });

        return logs.map((log) => this.mapToEmailLog(log));
    }

    async createLog(log: Omit<EmailLog, "id" | "createdAt" | "updatedAt">): Promise<EmailLog> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const sentAt =
            log.sentAt == null ? null : new Date(log.sentAt as string);
        const created = await prisma.emailLog.create({
            data: {
                customerId: (log.customerId ?? null) as string | null,
                templateId: (log.templateId ?? null) as string | null,
                resendId: (log.resendId ?? null) as string | null,
                fromEmail: log.fromEmail as string,
                toEmail: log.toEmail as string,
                ccEmail: (log.ccEmail ?? null) as string | null,
                bccEmail: (log.bccEmail ?? null) as string | null,
                subject: log.subject as string,
                htmlContent: (log.htmlContent ?? null) as string | null,
                textContent: (log.textContent ?? null) as string | null,
                status: log.status as EmailStatus,
                errorMessage: (log.errorMessage ?? null) as string | null,
                sentAt,
                metadata: log.metadata ? JSON.stringify(log.metadata) : undefined,
            },
        });

        return this.mapToEmailLog(created);
    }

    async updateLogStatus(
        id: string,
        status: EmailStatus,
        details?: { resendId?: string; errorMessage?: string; sentAt?: Date },
    ): Promise<EmailLog> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const updated = await prisma.emailLog.update({
            where: { id },
            data: {
                status,
                resendId: details?.resendId,
                errorMessage: details?.errorMessage,
                sentAt: details?.sentAt,
            },
        });

        return this.mapToEmailLog(updated);
    }

    async findAllTemplates(): Promise<EmailTemplate[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const templates = await prisma.emailTemplate.findMany({
            orderBy: { createdAt: "desc" },
        });

        return templates.map((template) => this.mapToEmailTemplate(template));
    }

    async findTemplateById(id: string): Promise<EmailTemplate | null> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const template = await prisma.emailTemplate.findUnique({
            where: { id },
        });

        if (!template) return null;

        return this.mapToEmailTemplate(template);
    }

    async findTemplateBySlug(slug: string): Promise<EmailTemplate | null> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const template = await prisma.emailTemplate.findUnique({
            where: { slug },
        });

        if (!template) return null;

        return this.mapToEmailTemplate(template);
    }

    async createTemplate(input: CreateEmailTemplateInput): Promise<EmailTemplate> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const template = await prisma.emailTemplate.create({
            data: {
                name: input.name,
                slug: input.slug,
                description: input.description,
                category: input.category ?? "TRANSACTIONAL",
                subject: input.subject,
                htmlContent: input.htmlContent,
                textContent: input.textContent,
                variables: input.variables ? JSON.stringify(input.variables) : undefined,
                isActive: input.isActive ?? true,
            },
        });

        return this.mapToEmailTemplate(template);
    }

    async updateTemplate(id: string, input: UpdateEmailTemplateInput): Promise<EmailTemplate> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const template = await prisma.emailTemplate.update({
            where: { id },
            data: {
                name: input.name,
                slug: input.slug,
                description: input.description,
                category: input.category,
                subject: input.subject,
                htmlContent: input.htmlContent,
                textContent: input.textContent,
                variables: input.variables ? JSON.stringify(input.variables) : undefined,
                isActive: input.isActive,
            },
        });

        return this.mapToEmailTemplate(template);
    }

    async deleteTemplate(id: string): Promise<void> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        await prisma.emailTemplate.delete({
            where: { id },
        });
    }
}
