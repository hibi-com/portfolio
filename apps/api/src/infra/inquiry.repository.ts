import { createPrismaClient } from "@portfolio/db";
import type {
    CreateInquiryInput,
    CreateInquiryResponseInput,
    Inquiry,
    InquiryCategory,
    InquiryPriority,
    InquiryRepository,
    InquiryResponse,
    InquiryStatus,
    UpdateInquiryInput,
} from "~/domain/inquiry";

export class InquiryRepositoryImpl implements InquiryRepository {
    constructor(private readonly databaseUrl?: string) {}

    private mapToInquiry(data: {
        id: string;
        customerId: string | null;
        assigneeId: string | null;
        subject: string;
        content: string;
        status: string;
        priority: string;
        category: string;
        tags: string | null;
        source: string | null;
        metadata: string | null;
        resolvedAt: Date | null;
        closedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }): Inquiry {
        return {
            id: data.id,
            customerId: data.customerId ?? undefined,
            assigneeId: data.assigneeId ?? undefined,
            subject: data.subject,
            content: data.content,
            status: data.status as InquiryStatus,
            priority: data.priority as InquiryPriority,
            category: data.category as InquiryCategory,
            tags: data.tags ? JSON.parse(data.tags) : undefined,
            source: data.source ?? undefined,
            metadata: data.metadata ? JSON.parse(data.metadata) : undefined,
            resolvedAt: data.resolvedAt ?? undefined,
            closedAt: data.closedAt ?? undefined,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }

    private mapToResponse(data: {
        id: string;
        inquiryId: string;
        userId: string | null;
        content: string;
        isInternal: boolean;
        attachments: string | null;
        createdAt: Date;
        updatedAt: Date;
    }): InquiryResponse {
        return {
            id: data.id,
            inquiryId: data.inquiryId,
            userId: data.userId ?? undefined,
            content: data.content,
            isInternal: data.isInternal,
            attachments: data.attachments ? JSON.parse(data.attachments) : undefined,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }

    async findAll(): Promise<Inquiry[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const inquiries = await prisma.inquiry.findMany({
            orderBy: { createdAt: "desc" },
        });

        return inquiries.map((inquiry) => this.mapToInquiry(inquiry));
    }

    async findById(id: string): Promise<Inquiry | null> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const inquiry = await prisma.inquiry.findUnique({
            where: { id },
        });

        if (!inquiry) return null;

        return this.mapToInquiry(inquiry);
    }

    async findByCustomerId(customerId: string): Promise<Inquiry[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const inquiries = await prisma.inquiry.findMany({
            where: { customerId },
            orderBy: { createdAt: "desc" },
        });

        return inquiries.map((inquiry) => this.mapToInquiry(inquiry));
    }

    async findByAssigneeId(assigneeId: string): Promise<Inquiry[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const inquiries = await prisma.inquiry.findMany({
            where: { assigneeId },
            orderBy: { createdAt: "desc" },
        });

        return inquiries.map((inquiry) => this.mapToInquiry(inquiry));
    }

    async findByStatus(status: InquiryStatus): Promise<Inquiry[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const inquiries = await prisma.inquiry.findMany({
            where: { status },
            orderBy: { createdAt: "desc" },
        });

        return inquiries.map((inquiry) => this.mapToInquiry(inquiry));
    }

    async create(input: CreateInquiryInput): Promise<Inquiry> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const inquiry = await prisma.inquiry.create({
            data: {
                customerId: input.customerId,
                assigneeId: input.assigneeId,
                subject: input.subject,
                content: input.content,
                status: input.status ?? "OPEN",
                priority: input.priority ?? "MEDIUM",
                category: input.category ?? "GENERAL",
                tags: input.tags ? JSON.stringify(input.tags) : undefined,
                source: input.source,
                metadata: input.metadata ? JSON.stringify(input.metadata) : undefined,
            },
        });

        return this.mapToInquiry(inquiry);
    }

    async update(id: string, input: UpdateInquiryInput): Promise<Inquiry> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const inquiry = await prisma.inquiry.update({
            where: { id },
            data: {
                customerId: input.customerId,
                assigneeId: input.assigneeId,
                subject: input.subject,
                content: input.content,
                status: input.status,
                priority: input.priority,
                category: input.category,
                tags: input.tags ? JSON.stringify(input.tags) : undefined,
                source: input.source,
                metadata: input.metadata ? JSON.stringify(input.metadata) : undefined,
            },
        });

        return this.mapToInquiry(inquiry);
    }

    async delete(id: string): Promise<void> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        await prisma.inquiry.delete({
            where: { id },
        });
    }

    async resolve(id: string): Promise<Inquiry> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const inquiry = await prisma.inquiry.update({
            where: { id },
            data: {
                status: "RESOLVED",
                resolvedAt: new Date(),
            },
        });

        return this.mapToInquiry(inquiry);
    }

    async close(id: string): Promise<Inquiry> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const inquiry = await prisma.inquiry.update({
            where: { id },
            data: {
                status: "CLOSED",
                closedAt: new Date(),
            },
        });

        return this.mapToInquiry(inquiry);
    }

    async addResponse(input: CreateInquiryResponseInput): Promise<InquiryResponse> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const response = await prisma.inquiryResponse.create({
            data: {
                inquiryId: input.inquiryId,
                userId: input.userId,
                content: input.content,
                isInternal: input.isInternal ?? false,
                attachments: input.attachments ? JSON.stringify(input.attachments) : undefined,
            },
        });

        return this.mapToResponse(response);
    }

    async getResponses(inquiryId: string): Promise<InquiryResponse[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const responses = await prisma.inquiryResponse.findMany({
            where: { inquiryId },
            orderBy: { createdAt: "asc" },
        });

        return responses.map((response) => this.mapToResponse(response));
    }
}
